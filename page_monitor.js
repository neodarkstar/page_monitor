var http = require('http');
var cheerio = require('cheerio');
var nodemailer = require('nodemailer');
var MongoClient = require('mongodb').MongoClient;
var moment = require('moment');
var q = require('q');
var api = require('./api.js');

var url = 'mongodb://localhost:27017/page_monitor';


// Main portion of the code

// init();

function init(){

	MongoClient.connect(url, function(err, db){

		console.log("Connected correctly to server");

			execute(db);

			setInterval(execute, 30000, db);

	});

}


function execute(db){

	var sitesCollection = db.collection('scrapeSites');
	var usersCollection = db.collection('users');

	sitesCollection.find({}).toArray(function(err, sites){

		usersCollection.find({}).toArray(function(err, users){

			console.log('\nStarting Execution at ' + moment().format('MMMM Do YYYY, h:mm:ss a') + '\n');

			sites.forEach(function(site){

				var request = http.request(site.requestOptions, function(response){

					var body = '';

					response.on('data', function(chunk){
						body += chunk;
					});

					response.on('end', function(){

						$ = cheerio.load(body);

							var elementString = $.html(site.selector);

							if(site.results !== elementString && !( site.store === 'Target' && elementString === '')){ // Target Special Case

								db.collection('scrapeSites').update( {
									store: site.store,
									item: site.item
								}, {
									$set : {
										results: elementString
									}
								},
								null,
								function(err, results){

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

								});

							} else {

								console.log(site.store + ' ' + site.item + ' No Change ');
							}

					});

				});

				request.on('error', function(e) {
				  console.log('problem with request: ' + e.message);
				});

				request.end();
			});
		});

	});
}

function notify(db, site){

	var msg = {
		subject: site.item + ' has Changed!\n',
		body:'http://' + site.requestOptions.host + site.requestOptions.path
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
