var http = require('http');

module.exports = {

    itemLookup: function(item, callback) {

      var apiKey = process.env.BESTBUY_APIKEY;

      var options = {

        host: 'api.remix.bestbuy.com',
        path: '/v1/products(sku=' + item + ')?format=json&apiKey=' + apiKey,
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

              var products = apiResult.products;

              if(products && products.length > 0){
                return products[0].onSale || products[0].onlineAvailability || products[0].inStoreAvailability;
              }

              return false;
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
