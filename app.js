var http = require('http');
var cheerio = require('cheerio');
var nodemailer = require('nodemailer');
var MongoClient = require('mongodb').MongoClient;
var moment = require('moment');
var q = require('q');
var url = 'mongodb://localhost:27017/page_monitor';
var api = require('./api.js');
var amqp = require('amqplib/callback_api');
var when = require('when');
var _ = require('lodash');
var Q = require('q');

// Main portion of the code

var connection = Q.defer();

amqp.connect('amqp://localhost', function(err, conn) {
	connection.resolve(conn);
});


init();

function init(){

	MongoClient.connect(url, function(err, db){

		console.log("Connected correctly to server");
			execute(db);
			setInterval(execute, 60000, db);
	});

}

function execute(db){

	var itemsCollection = db.collection('items');
	var usersCollection = db.collection('users');

	itemsCollection.find({}).toArray(function(err, items){

		usersCollection.find({}).toArray(function(err, users){

			console.log('\nStarting Execution at ' + moment().format('MMMM Do YYYY, h:mm:ss a') + '\n');

			items.forEach(function(item){

				api.itemLookup(item.api, item.item.id, function(apiResult){

					var isAvailable = apiResult.isAvailable();

					itemsCollection.update({ "item.id": item.item.id }, { $set : { 'lastChecked': moment().toString()}});

						if(isAvailable && !item.available){

							itemsCollection.update({ "item.id": item.item.id }, { $set : { 'available' : true , 'lastChecked': moment().toString(), 'lastAvailable': moment().toString()}});

							publishTopic('notifications.available', item);

						} else if(!isAvailable && item.available){

							itemsCollection.update({ "item.id": item.item.id }, { $set : { 'available' : false }});

						}

						publishTopic('notifications.log', item);

						console.log(item.store + ' ' + item.item.name + ' ' + isAvailable);

				});

			});

		});

	});
}

function publishTopic(key, item){
	  connection.promise.then(function(conn){
			conn.createChannel(function(err, ch) {
		    var ex = 'notifications';

				var msg = buildItemsList([item])[0];

				ch.assertExchange(ex, 'topic', {durable: false});
		    ch.publish(ex, key, new Buffer(JSON.stringify(msg)));
		    console.log(" [x] Sent %s:'%s'", key, msg.name);
		  });

		})
}


function publish(item){

	amqp.connect('amqp://localhost', function(err, conn) {
	  conn.createChannel(function(err, ch) {
	    var ex = 'notifications';
			var msg = {
				store: item.store,
				name: item.item.name,
				notify: item.notify,
				url: item.url
			};

	    ch.assertExchange(ex, 'fanout', {durable: false});
	    ch.publish(ex, '', new Buffer(JSON.stringify(msg)));
	    console.log(" [x] Sent %s", msg.name);
	  });

	});

}

function buildItemsList(itemList){

  var items = {};

  itemList.forEach(function(item){

    if(!items[item._id]){
      items[item._id] = {
        name: item.item.name,
        id: item._id,
        stores:[]
      }
    }

    items[item._id].stores.push(
      {
        api: item.api,
        id: item.item.id,
        name: item.store,
        url: item.url,
        lastChecked: item.lastChecked,
        lastAvailable: item.lastAvailable || null,
        available: item.available || false,
				users: item.notify
      }
    );

  });

  return _.map(items, function(item){
    return item;
  });

}
