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

// Main portion of the code

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

	amqp.connect('amqp://localhost', function(err, conn) {
	  conn.createChannel(function(err, ch) {
	    var ex = 'notifications';
			var msg = {
				id: item._id,
				store: item.store,
				name: item.item.name,
				notify: item.notify,
				url: item.url
			};

			ch.assertExchange(ex, 'topic', {durable: false});
	    ch.publish(ex, key, new Buffer(JSON.stringify(msg)));
	    console.log(" [x] Sent %s:'%s'", key, msg.name);
	  });

	});

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
