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
		text: '3054913991@tmomail.net'
	}

];

var items = [
	{
		item:{
			name: 'Dark Pit',
			id: '6376118'
		},
		active: true,
		available: false,
		selector: '#priceblock-wrapper-wrapper',
		url: 'http://www.bestbuy.com/site/multi/6376118.p?skuId=6376118',
		store: 'Best Buy',
		api: 'bestbuy',
		results: '',
		notify : ['John', 'Eddie', 'Raidel']
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
