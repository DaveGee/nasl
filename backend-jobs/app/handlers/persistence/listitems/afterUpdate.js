/* global Backendless */

/**
* @param {Object} req The request object contains information about the request
* @param {Object} req.context The execution context contains an information about application, current user and event
* @param {listItems} req.item An item with changes
*
* @param {Object} res The response object
* @param {listItems} res.result Updated item
* @param {Object} res.error
*/
Backendless.ServerCode.Persistence.afterUpdate('listItems', function(req, res) {
  
  var request = require('request'),
      moment = require('moment');
      
  var standardHeaders = {
      'content-type': 'application/json',
      'application-id': '31C950BC-6578-E461-FF2C-9A711D417E00',
      'secret-key': 'D5A2DE70-DA8F-463C-FF4F-75760F503D00',
      'application-type': 'REST'
    };
  
  request({
    url: 'https://api.backendless.com/v1/data/listItems/' + req.item.objectId + '?loadRelations=history',
    method: 'GET',
    json: true,
    headers: standardHeaders
  }, function(err, res, body) {
    if(!body.history)
      return;
      
    var buyTimes = body.history.slice(0, 20)
      .map(h => new Date(h.buyTime))
      .sort(function(a, b) { return b-a; });
    
    var meanDays = Math.floor(
      buyTimes    
      .map(function(current, i, arr) {
        if(arr[i+1]) 
          return (current - arr[i+1]) / 1000 / 60 / 60 / 24;
      })
      .reduce(function(prev, cur) {
        if(cur)
          return prev+cur;
        return prev;
      }) / (buyTimes.length - 1));
      
    if(meanDays !== req.item.meanBuyInterval) {
            
      request({
        url: 'https://api.backendless.com/v1/data/listItems/' + req.item.objectId,
        method: 'PUT',
        json: true,
        headers: standardHeaders,
        body: { meanBuyInterval: meanDays }
      }, function(err, res, body) {
        console.log(err, body);
      });
    }
  });
  
  return res;
});