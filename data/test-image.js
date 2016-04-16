var request = require('./requestp').request,
    fs = require('fs');
    
    
request({
  url: 'http://jpod.fr/wp-content/uploads/2015/04/shampoing-7.jpg',
  method: 'head'
})
.then(function() {
  console.log('ok', arguments);
})
.catch(function() {
  console.log('nok', arguments);
});