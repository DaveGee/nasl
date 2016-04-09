var Config = {

  defaultPageSize: 100,

  refreshInterval: 1200,

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