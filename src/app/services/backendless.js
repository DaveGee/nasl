import Config from '../../config';
import Security from './security';
import {encode} from '../helpers/strings';

var handleErrors = function(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    var error = new Error(response.statusText)
    error.response = response
    throw error
  }
};

class Backendless {
  constructor() {
  }

  get root() {
    return `${Config.backendless.url}/${Config.backendless.version}`;
  }

  login(credentials) {
    return fetch(`${this.root}/users/login`,
      {
        method: 'post',
        headers: Config.backendless.headers,
        body: JSON.stringify(credentials)
      })
      .then(response => handleErrors(response))
      .then(response => response.json())
      .then(userData => {
        return {
          userId: userData["objectId"],
          userToken: userData['user-token'],
          name: userData['name'],
          email: userData['email'],
          listRef: userData['listRef']
        }
      });
  }
  
  checkSession(userToken, username) {
    return fetch(this.root + '/users/isvalidusertoken/' + userToken, {
      headers: Config.backendless.headers
    })
    .then(response => response.json())
    .then(response => {
      if(response)
        return fetch(this.root + '/data/users?where=' + encode(`email='${username}'`), {
          headers: Config.backendless.headers
        })
        .then(response => response.json())
        .then(response => {
          return {
            userId: response.data[0].objectId,
            userToken: userToken,
            name: response.data[0].name,
            email: response.data[0].email,
            listRef: response.data[0].listRef
          };
        });
       else 
        throw "Invalid security token";
    })
  }
  
  update(tableName, itemId, itemProps) {
    return fetch(`${this.root}/data/${tableName}/${itemId}`, {
      method: 'put',
      headers: Object.assign({}, Config.backendless.headers, {'user-token': Security.user.userToken}),
      body: JSON.stringify(itemProps)
    })
    .then(response => response.json());
  }
  
  create(tableName, item) {
    return fetch(`${this.root}/data/${tableName}`, {
      method: 'post',
      headers: Object.assign({}, Config.backendless.headers, {"user-token": Security.user.userToken}),
      body: JSON.stringify(item)
    })
    .then(response => response.json());
  }
  
  /*
    params: {
              table: 'products',
              props: ['objectId', 'image', 'name'],
              order: ['name'],
              filter: { colName: 'name', value: 'xx'}
            }
  */
  fetch(params, all = true) {
    let reqParams = {
      headers: Object.assign({}, Config.backendless.headers, {"user-token": Security.user.userToken})
    };
    let props = params.props ? '&props=' + params.props.join(',') : '';
    let sort = params.order ? '&sortBy=' + params.order.join(',') : '';
    let offset = all ? '' : '&offset=' + (params.startAt || 0);
    
    let filters = (params.filters || []).map(f => `${f.colName}='${f.value}'`);
    let where = [params.where, ...filters].filter(w => !!w).join(' and ');
      
    let startUrl = `${this.root}/data/${params.table}?pageSize=${Config.defaultPageSize}${props}${sort}${offset}&where=${where}`;

    if (all) {
      var data = [];

      var remoteCall = function(url) {
        return fetch(url, reqParams)
          .then(response => handleErrors(response))
          .then(response => response.json())
          .then(function(json) {
            data = [...data, ...json.data];
            if (json.nextPage)
              return remoteCall(json.nextPage);
            else
              return data;
          });
      }

      return remoteCall(startUrl);

    } else {
      return fetch(startUrl, reqParams)
        .then(response => response.json());
    }
  }
}

export default new Backendless();