var http = require('http');

module.exports = {

    itemLookup: function(item, callback) {

      var apiKey = process.env.bestbuy.apiKey;

      var options = {

        host: 'api.remix.bestbuy.com',
        path: '/v1/products/' + item + '.json?apiKey=' + apiKey,
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
              return apiResult.onSale;
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
