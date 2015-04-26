var aws = require("aws-lib");

module.exports = {

  itemLookup: function(item, callback){

    var apiKey = process.env.amazon.apiKey;
    var apiSecret = process.env.amazon.apiSecret;
    var associateId = process.env.amazon.associateId;

    prodAdv = aws.createProdAdvClient(apiKey, apiSecret, associateId);

    prodAdv.call("ItemLookup", { ItemId: item, ResponseGroup: 'Offers'}, function(err, result) {

      callback({
        apiResult: result,
        isAvailable: function(){
          if(result.Items.Item.OfferSummary.TotalNew > 0) return true;
          return false;
          }
      });

    });

  }


};
