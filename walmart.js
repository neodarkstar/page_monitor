var http = require('http');

module.exports = {

    itemLookup: function(item, callback) {

      var apiKey = process.env.walmart.apiKey;

      var options = {
        host: 'api.walmartlabs.com',
        path: '/v1/items/' + item + '?apiKey=' + apiKey,
        method: 'GET'
      };

      var request = http.request(options, function(response){

        var body = '';

        response.on('data', function(chunk){
          body += chunk;
        });

        response.on('end', function(){

          var apiResult = JSON.parse(body);

          callback({

            apiResult: apiResult,
            isAvailable: function(){
              return apiResult.availableOnline;
            }
          });

        });

      });

      request.on('error', function(e) {
        console.log('problem with request: ' + e.message);
      });

      request.end();

    }

};
