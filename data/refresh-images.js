var request = require('./requestp').request,
  Promise = require('promise'),
  fs = require('fs'),
  helpers = require('./helpers'),
  config = require('./config');

var productPromises = [];
var products = [];

var lineReader = require('readline').createInterface({
  input: fs.createReadStream('products.txt')
});

lineReader.on('close', function () {
  Promise.all(productPromises)
    .then(processData);
});

lineReader.on('line', function (line) {

  var normalizedName = helpers.normalize(line);

  productPromises.push(Promise.all([
    reqImage(line),
    reqObjectId(normalizedName)
  ])
  .then(function (values) {

    var imgUrl = values[0];
    var id = values[1];

    var o = {
      name: line,
      normalizedName: normalizedName,
      image: imgUrl,
      objectId: id
    };
    
    products.push(o);
    return o;
  }));
});

function processData(data) {
  // write producDb to a file
  fs.writeFile('products.json', JSON.stringify(data), function (err) {
    if (err) console.log('Err: ' + err);
    else console.log('Wrote ' + data.length + ' object in products.json');
    
    var sendToBackendLess = function(i) {
      
      if(i<products.length) {
        updateObjectInDb(products[i])
          .then(function(res) {
            console.log('Saved: ' + products[i].name)
          })
          .catch(function(err) {
            console.log('Err: ', arguments);
          });
          
        // api limit to 50req/sec on backendless
        setTimeout(sendToBackendLess.bind(undefined, i+1), 100);
      }
    }
    
    sendToBackendLess(0);
    
  });
}


function reqObjectId(normalizedName) {
  var q = encodeURIComponent(`normalizedName='${normalizedName}'`)
  var url = `${config.backendless.url}/${config.backendless.version}/data/products?props=objectId&where=${q}`;
  return request({
    url: url,
    method: 'get',
    json: true,
    headers: config.backendless.headers
  })
    .then(function (obj) {
      return obj && obj.data && obj.data.length > 0 ? obj.data[0].objectId : null;
    })
    .catch(function (err) {
      console.log(err);
    });
}

function updateObjectInDb(object) {

  var url = `${config.backendless.url}/${config.backendless.version}/data/products`;

  if (object.objectId) {
    return request({
      url: url + '/' + object.objectId,
      method: 'put',
      json: true,
      headers: config.backendless.headers,
      body: object
    });
  }
  else {
    return request({
      url: url,
      method: 'post',
      json: true,
      headers: config.backendless.headers,
      body: object
    });
  }
}

var key = config.bingKey; // replace by the bing API key
var auth = new Buffer(key + ':' + key).toString('base64');
var rootUri = 'https://api.datamarket.azure.com/Bing/Search/v1/Image';
var options = encodeURIComponent("'DisableLocationDetection'");
var adult = encodeURIComponent("'Strict'");
var filters = encodeURIComponent("'Size:Medium+Aspect:Square'");

function reqImage(keyWord) {
  var q = encodeURIComponent('\'' + keyWord + '\'');

  return request({
    url: `${rootUri}?Query=${q}&Options=${options}&Adult=${adult}&ImageFilters=${filters}&$top=1`,
    method: 'get',
    json: true,
    headers: {
      'Authorization': 'Basic ' + auth
    }
  })
    .then(function (imgJson) {
      return imgJson.d.results[0].MediaUrl;
    });
}