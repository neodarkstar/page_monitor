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
		notify : ['John', 'Eddie', 'Raidel'],
		lastAvailable: null,
		lastChecked: null
	},
	{
		item:{
			name: 'Ganondorf',
			id: '24012008',
			dpci: '207-03-4002'
		},
		active: true,
		available: false,
		selector: '.butonblock',
		url: 'http://www.target.com/p/nintendo-ganondorf-amiibo-figure/-/A-24012008',
		store: 'Target',
		api: 'target',
		results: '',
		notify : ['John', 'Eddie', 'Raidel'],
		lastAvailable: null,
		lastChecked: null
	},
	{
		item:{
			name: 'Zero Suit Samus',
			id: '24012007',
			dpci: '207-03-4001'
		},
		active: true,
		available: false,
		selector: '.butonblock',
		url: 'http://www.target.com/p/nintendo-zero-suit-samus-amiibo-figure/-/A-24012007',
		store: 'Target',
		api: 'target',
		results: '',
		notify : ['John', 'Eddie', 'Raidel'],
		lastAvailable: null,
		lastChecked: null
	},
	{
		item:{
			name: 'Nintendo Classic Mario',
			id: '24012006',
			dpci: '207-03-4000'
		},
		active: true,
		available: false,
		selector: '.butonblock',
		url: 'http://www.target.com/p/nintendo-classic-mario-30th-anniversary-amiibo-figure/-/A-24012006',
		store: 'Target',
		api: 'target',
		results: '',
		notify : ['John', 'Eddie', 'Raidel'],
		lastAvailable: null,
		lastChecked: null
	},
	{
		item:{
			name: 'Olimar & Pikmin',
			id: '24012009',
			dpci: '207-03-4003'
		},
		active: true,
		available: false,
		selector: '.butonblock',
		url: 'http://www.target.com/p/nintendo-olimar-pikmin-amiibo-figure/-/A-24012009',
		store: 'Target',
		api: 'target',
		results: '',
		notify : ['John', 'Eddie', 'Raidel'],
		lastAvailable: null,
		lastChecked: null
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
