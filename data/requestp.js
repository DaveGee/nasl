var request = require('request'),
    Promise = require('promise');
    
module.exports.request = function(options) {
    return new Promise(function (resolve, reject) {
        request(options, function (err, res, body) {
            if (err) {
                return reject(err);
            } else if (res.statusCode !== 200) {
                err = new Error("Unexpected status code: " + res.statusCode);
                err.res = res;
                return reject(err);
            }
            resolve(body);
        });
    });
}