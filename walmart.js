var http = require('http');

module.exports = {

    itemLookup: function(item, callback) {

      var apiKey = process.env.WALMART_APIKEY;

      var options = {
        host: 'api.walmartlabs.com',
        path: '/v1/items/' + item + '?apiKey=' + apiKey,
        method: 'GET'
      };

      var request = http.request(options, function(response){

        if(response.statusCode !== 200){

          console.log('Walmart Error : ' + response.statusCode );

          callback({

            apiResult: response.statusCode,
            isAvailable: function(){
              return false;
            }
          });
          return;
        }

        var body = '';

        response.on('data', function(chunk){
          body += chunk;
        });

        response.on('end', function(){

          var apiResult = JSON.parse(body);

          callback({

            apiResult: apiResult,
            isAvailable: function(){
              return true;
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
