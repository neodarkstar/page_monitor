var http = require('http');
var cheerio = require('cheerio');
var nodemailer = require('nodemailer');
var MongoClient = require('mongodb').MongoClient;
var moment = require('moment');
var q = require('q');
var url = 'mongodb://localhost:27017/page_monitor';
var api = require('./api.js');

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

						if(apiResult.isAvailable()){
							notify(db, item);
						}

						console.log(item.store + ' ' + item.item.name + ' ' + apiResult.isAvailable());

				});

			});

		});

	});
}

function notify(db, site){

	var msg = {
		subject: site.store + ' : '+ site.item.name + '\n',
		body: site.url
	};

	var transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'amiibo.monitor@gmail.com',
			pass: 'amiiboP@$$'
		}
	});

	site.notify.forEach(function(username){

		db.collection('users').find({ name: username }).limit(1).each(function(err, user){

			if(user === null) return;

			var mailOptions = {

				from: 'amiibo.monitor@gmail.com',
				to: user.text,
				subject: msg.subject,
				text: msg.body

			};

		console.log('Notified : ' + user.name + ' @' + user.text);

		transporter.sendMail(mailOptions);

		});

	});

}

function spamFilter(item){


		console.log(site.store + ' ' + site.item + ' Changed! ');

		db.collection('notifications').find({ store: site.store, item: site.item }).sort({ _id: -1 }).limit(1).toArray(
			function(err, pastNotices){

				var currentNotice = { store: site.store, item: site.item, time: moment().format()};

				db.collection('notifications').insertOne(currentNotice, function(err, result){
					// Insert any error message handling here
				});

				if(pastNotices.length === 0){

					notify(db, site);

				} else {

					var pastNotice = pastNotices[0];

					var timeStamp = moment(pastNotice.time);

					if(moment().diff(timeStamp, 'minutes') >= 1){

						notify(db, site);

					}

				}

			}
		);

}
