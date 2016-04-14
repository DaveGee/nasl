var request = require('request'),
    fs = require('fs');

function normalize(str) {
  if(!str) return str;
  
  return require('diacritics').remove(str.trim().toLowerCase()).replace(/[^a-z0-9]+/g, '_');
}


var key = require('./bingkey').key; // replace by the bing API key
var auth = new Buffer(key + ':' + key).toString('base64');
var rootUri = 'https://api.datamarket.azure.com/Bing/Search/v1/Image';

var options = encodeURIComponent("'DisableLocationDetection'");
var adult = encodeURIComponent("'Strict'");
var filters = encodeURIComponent("'Size:Medium+Aspect:Square'");

  
var productDb = [];
var processedProducts = {};
var finishedFile = false;

function everyOneGotImage() {
  return !Object.keys(processedProducts).some(function(k) {
    return processedProducts[k] !== 2;
  });
}

function processData() {
  if(finishedFile && everyOneGotImage()) {
    // write producDb to a file
    fs.writeFile('products.json', JSON.stringify(productDb), function(err) {
      if(err) console.log('Err: ' + err);
    });
  }
}
  
var lineReader = require('readline').createInterface({
  input: fs.createReadStream('products.txt')
});

lineReader.on('close', function() {
  finishedFile = true;
});

lineReader.on('line', function (line) {  
  var q = encodeURIComponent('\'' + line + '\'');
  
  var normalizedName = normalize(line);
  
  if(!processedProducts[normalizedName]) {
    processedProducts[normalizedName] = 1;
    
    request({
      url: `${rootUri}?Query=${q}&Options=${options}&Adult=${adult}&ImageFilters=${filters}&$top=1`,
      method: 'get',
      json: true,
      headers: {
        'Authorization': 'Basic ' + auth
      }
    }, function(err, res, body) {      
      productDb.push({
        name: line,
        normalizedName: normalizedName,
        image: body.d.results[0].MediaUrl
      });
      
      processedProducts[normalizedName] = 2;
      processData();
    });
  }
});