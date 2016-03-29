import Config from '../../config';
import Security from './security';

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
          email: userData['email']
        }
      });
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
    let where = escape(`(ownerId is null or ownerId='${Security.user.userId}')`);
    if (params.filter)
      where += ` and ${params.filter.colName}='${params.filter.value}'`;
      
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