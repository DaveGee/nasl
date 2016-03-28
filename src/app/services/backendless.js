import Config from '../../config';

class Backendless {
  constructor() {
  }

  get root() {
    return `${Config.backendless.url}/${Config.backendless.version}`;
  }

  fetch(params, all = true) {
    let reqParams = {
      headers: Object.assign({}, Config.backendless.headers)
    };
    let props = params.props.join(',');
    let sort = params.order.join(',');
    let offset = all ? '' : '&offset=' + params.startAt;
    let startUrl = `${this.root}/data/${params.table}?pageSize=${Config.defaultPageSize}&props=${props}&sortBy=${sort}${offset}`;

    if (all) {
      var data = [];

      var remoteCall = function(url) {
        return fetch(url, reqParams)
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