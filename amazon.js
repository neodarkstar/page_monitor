var aws = require("aws-lib");

module.exports = {

  itemLookup: function(item, callback){

    var apiKey = process.env.AMAZON_APIKEY;
    var apiSecret = process.env.AMAZON_SECRETKEY;
    var associateId = process.env.AMAZON_ASSOCIATEID;

    prodAdv = aws.createProdAdvClient(apiKey, apiSecret, associateId);

    prodAdv.call("ItemLookup", { ItemId: item, ResponseGroup: 'Offers'}, function(err, result) {

      callback({
        apiResult: result,
        isAvailable: function(){

          if(result.Items.Item){
            var offerSummary = result.Items.Item.OfferSummary;

            if(offerSummary.TotalNew > 0 && parseInt(offerSummary.LowestNewPrice.Amount) <= 1299){
              return true;
            }

          }
          return false;

        }

      });

    });

  }

};
