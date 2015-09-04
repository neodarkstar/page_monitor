var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://localhost:27017/page_monitor';

var users = [

	{
		name: 'Eddie',
		email: '',
		text: '7864594881@vtext.com'
	},
	{
		name: 'Raidel',
		email: '',
		text: '7863763797@tmomail.net'
	},
	{
		name: 'John',
		email: '',
		text: 'johnllombart@gmail.com'
	}

];

var items = [
 	{
 		item: {
 			name: 'Shovel Knight',
 			id: '4480901'
 		},
 		active: true,
 		selector: '#priceblock-wrapper-wrapper',
 		url:'http://www.bestbuy.com/site/nintendo-amiibo-figure-shovel-knight/4480901.p',
 		store: 'Best Buy',
 		api: 'bestbuy',
 		results: '',
 		notify : ['John', 'Eddie', 'Raidel']
 	},
 	{
 		item: {
 			name: 'Street Fighter V Collector\'s Edition',
 			id: '4479602'
 		},
 		active: true,
 		selector: '#priceblock-wrapper-wrapper',
 		url:'http://www.bestbuy.com/site/street-fighter-v-collectors-edition-playstation-4/4479602.p',
 		store: 'Best Buy',
 		api: 'bestbuy',
 		results: '',
 		notify : ['Raidel']
 	}
];


MongoClient.connect(url, function(err, db){

	var itemsCollection = db.collection('items');
	var usersCollection = db.collection('users');

	// cleanup

	itemsCollection.drop();
	usersCollection.drop();

		itemsCollection.insertMany(items, function(err, result){

			console.log("Inserted " + result.result.n + ' documents');

			usersCollection.insertMany(users, function(err, result){

				console.log("Inserted " + result.result.n + ' documents');

				db.close();

			});


	});


});
