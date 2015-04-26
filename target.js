var spawn = require('child_process').spawn;
var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://localhost:27017/page_monitor';

var store = 'Target';

module.exports = {

  itemLookup: function(itemId, callback){

    MongoClient.connect(url, function(err, db){

      var cursor = db.collection('items').find({ store: store, 'item.id': itemId});

      cursor.on('data', function(doc){

        var url = doc.url;
        var selector = doc.selector;

        var bin = 'phantomjs';
        var args = ['scrape.js', url, selector];

        var pjs = spawn(bin, args);

        pjs.stdout.setEncoding('utf8');

        var response = '';

        pjs.stdout.on('data', function(data){

          response += data;

        });

        pjs.on('exit', function(code){

          callback({
            apiResult: response,
            isAvailable: function(){
              if(response) return true;
              return false;
            }
          });

        });

      });

      cursor.once('end', function(){
        db.close();
      });

    });

  }

};
