var request = require('./requestp').request,
  Promise = require('promise'),
  fs = require('fs'),
  helpers = require('./helpers'),
  config = require('./config');

var productPromises = [];

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

      return {
        name: line,
        normalizedName: normalizedName,
        image: imgUrl,
        objectId: id
      };
    }));
});

function processData(data) {
  // write producDb to a file
  fs.writeFile('products.json', JSON.stringify(data), function (err) {
    if (err) console.log('Err: ' + err);
  });
}


function reqObjectId(normalizedName) {
  var q = encodeURIComponent(`normalizedName='${normalizedName}'`)
  var url = `${config.backendless.url}/${config.backendless.version}/data/products?props=objectId&where=${q}`;
  console.log(url);
  return request({
    url: url,
    method: 'get',
    json: true,
    headers: config.backendless.headers
  })
    .then(function (obj) {
      console.log(obj);
      return obj && obj.data && obj.data.length > 0 ? obj.data[0].objectId : null;
    })
    .catch(function (err) {
      console.log(err);
    });
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