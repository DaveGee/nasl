var Config = {

  TMPUser: {
    login: 'xxx',
    password: 'xxx'
  },

  database: 'backendless',

  defaultPageSize: 100,

  firebase: {
    url: 'https://flickering-heat-1357.firebaseio.com'
  },

  backendless: {
    url: 'https://api.backendless.com',
    version: 'v1',


    headers: {
      "application-id": "<YOUR-APP-ID>",
      "secret-key": "<YOUR-SECRET-KEY>",
      "application-type": "REST"
    }
  }
};

export default Config;