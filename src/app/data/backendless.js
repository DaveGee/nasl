import Config from '../../config';
import Identity from '../services/identity';
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
  
  saveUserToken(userToken) {
    localStorage.setItem('nasl-user-token', userToken);
  }
  
  getUserToken() {
    return localStorage.getItem('nasl-user-token');
  }

  login(credentials) {
    
    return this.checkSession()
      // session is ok, download user profile + list
      .then(() => {
        return this.fetch({
          table: 'users',
          where: `email='${credentials.login}'`
        })
        .then(data => data[0]);
      })
      // session is not ok, login and download data
      .catch(err => {
        console.log(err);
        return fetch(`${this.root}/users/login`,
        {
          method: 'post',
          headers: Config.backendless.headers,
          body: JSON.stringify(credentials)
        })
        .then(response => handleErrors(response))
        .then(response => response.json())
        .then(data => {
          // save token
          this.saveUserToken(data['user-token']);
          return data;  // return user
        });
      })
      .then(user => Object.assign({
        userId: user.objectId
      }, user));
  }
  
  checkSession() {
    if(this.getUserToken()) 
      return fetch(this.root + '/users/isvalidusertoken/' + this.getUserToken(), {
        headers: Config.backendless.headers
      })
      .then(response => response.json())
      .then(response => {
        if(!response) 
          throw "Invalid security token";
        return true;
      });
    else
      return Promise.reject('No security token');
  }
  
  update(tableName, itemId, itemProps) {
    return fetch(`${this.root}/data/${tableName}/${itemId}`, {
      method: 'put',
      headers: Object.assign({}, Config.backendless.headers, {'user-token': this.getUserToken()}),
      body: JSON.stringify(itemProps)
    })
    .then(response => response.json());
  }
  
  create(tableName, item) {
    return fetch(`${this.root}/data/${tableName}`, {
      method: 'post',
      headers: Object.assign({}, Config.backendless.headers, {"user-token": this.getUserToken()}),
      body: JSON.stringify(item)
    })
    .then(response => response.json());
  }
  
  fetchOne(table, id) {
    return fetch(`${this.root}/data/${table}/${id}`, 
      {
        headers: Object.assign({}, Config.backendless.headers, {"user-token": this.getUserToken()})
      })
      .then(res => res.json());
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
      headers: Object.assign({}, Config.backendless.headers, {"user-token": this.getUserToken()})
    };
    let props = params.props ? '&props=' + params.props.join(',') : '';
    let sort = params.order ? '&sortBy=' + params.order.join(',') : '';
    let offset = all ? '' : '&offset=' + (params.startAt || 0);
    
    let filters = (params.filters || []).map(f => `${f.colName}='${f.value}'`);
    let where = encode([params.where, ...filters].filter(w => !!w).join(' and '));
      
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