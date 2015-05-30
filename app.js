var http = require('http');
var cheerio = require('cheerio');
var nodemailer = require('nodemailer');
var MongoClient = require('mongodb').MongoClient;
var moment = require('moment');
var q = require('q');
var url = 'mongodb://localhost:27017/page_monitor';
var api = require('./api.js');
var amqp = require('amqplib');
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

						if(apiResult.isAvailable() && item.available === false){

							itemsCollection.update({ "item.id": item.item.id }, { $set : { 'available' : true }});

							notify(item);
						} else if(apiResult.isAvailable() === false && item.available === true){

							itemsCollection.update({ "item.id": item.item.id }, { $set : { 'available' : false }});

						}

						console.log(item.store + ' ' + item.item.name + ' ' + apiResult.isAvailable());

				});

			});

		});

	});
}

function notify(item){

	amqp.connect('amqp://localhost').then(function(conn) {
	  return when(conn.createChannel().then(function(ch) {
	    var q = 'email';
	    var msg = {
				store: item.store,
				item: item.item.name,
				notify: item.notify,
				url: item.url
			};

	    var ok = ch.assertQueue(q, {durable: false});

	    return ok.then(function(_qok) {
	      ch.sendToQueue(q, new Buffer(JSON.stringify(msg)));
	      console.log(" [x] Sent '%s'", 'Item: ' + msg.item + ' Store: ' + msg.store);
	      return ch.close();
	    });
	  })).ensure(function() { conn.close(); });
	}).then(null, console.warn);

}
