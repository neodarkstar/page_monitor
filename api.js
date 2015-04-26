
var api = {
    amazon: require('./amazon.js'),
    bestbuy: require('./bestbuy.js'),
    walmart: require('./walmart.js'),
    target: require('./target.js'),
    gamestop: require('./gamestop.js'),
    toysrus: require('./toysrus.js')
};

module.exports = {

  itemLookup: function(apiName, itemId, callback){

    api[apiName].itemLookup(itemId, callback);

  }

};
