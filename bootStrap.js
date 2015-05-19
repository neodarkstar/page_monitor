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
		item: {
			name: 'Lucina',
			id: '17318489',
			dpci: '207-00-5039'
		},
		active: true,
		api: 'target',
		selector: '.butonblock',
		url: 'http://www.target.com/p/nintendo-lucina-amiibo-figure/-/A-17318489',
		store: 'Target',
		results: '',
		notify : ['John', 'Eddie', 'Raidel']
	},
	{
		item: {
			name: 'Jigglypuff',
			id: '17315174',
			dpci: '207-00-5033'
		},
		active: true,
		api: 'target',
		selector: '.butonblock',
		url: 'http://www.target.com/p/nintendo-amiibo-jigglypuff-target-exclusive/-/A-17315174',
		store: 'Target',
		results: '',
		notify : ['John', 'Eddie', 'Raidel']
	},
	{
		item: {
			name: 'Robin',
			id: '17318490',
			dpci: '207-00-5038'
		},
		active: true,
		api: 'target',
		selector: '.butonblock',
		url: 'http://www.target.com/p/nintendo-robin-amiibo-figure/-/A-17318490',
		store: 'Target',
		results: '',
		notify : ['John', 'Eddie', 'Raidel']
	},
	{
		item: {
			name: 'Lucina',
			id: '44606833'
		},
		active: true,
		selector: '.price-display-oos',
		url:'http://www.walmart.com/ip/Lucina-Super-Smash-Bros-Series-Amiibo-Nintendo-WiiU-or-Nintendo-3DS/44606833',
		store: 'Walmart',
		api: 'walmart',
		results: '',
		notify : ['John', 'Eddie', 'Raidel']
	},
	{
		item: {
			name: 'Robin',
			id: '44606828'
		},
		active: true,
		selector: '.price-display-oos',
		url:'http://www.walmart.com/ip/Robin-Super-Smash-Bros-Series-Amiibo-Nintendo-WiiU-or-Nintendo-3DS/44606828',
		store: 'Walmart',
		api: 'walmart',
		results: '',
		notify : ['John', 'Eddie', 'Raidel']
	},
	{
		item: {
			name: 'Robin',
			id: 'B00V86BRHU'
		},
		active: true,
		selector: '#priceBlock',
		url:'http://www.amazon.com/gp/product/B00V86BRHU',
		store: 'Amazon US',
		api: 'amazon',
		results: '',
		notify : ['John', 'Eddie', 'Raidel']
	},
	{
		item: {
			name: 'Silver Mario',
			id: 'B00WKJ0LA8'
		},
		active: true,
		selector: '#priceBlock',
		url:'http://www.amazon.com/dp/B00WKJ0LA8',
		store: 'Amazon US',
		api: 'amazon',
		results: '',
		notify : ['John', 'Eddie', 'Raidel']
	},
	{
		item: {
			name: 'Robin',
			id: '5712035'
		},
		active: true,
		selector: '#priceblock-wrapper-wrapper',
		url:'http://www.bestbuy.com/site/nintendo-amiibo-figure-super-smash-bros-series-robin-multi/5712035.p',
		store: 'Best Buy',
		api: 'bestbuy',
		results: '',
		notify : ['John', 'Eddie', 'Raidel']
	},
	{
		item: {
			name: 'Lucina',
			id: '5711027'
		},
		active: true,
		selector: '#priceblock-wrapper-wrapper',
		url:'http://www.bestbuy.com/site/nintendo-amiibo-figure-super-smash-bros-series-lucina-multi/5711027.p',
		store: 'Best Buy',
		api: 'bestbuy',
		results: '',
		notify : ['John', 'Eddie', 'Raidel']
	},
	{
		item: {
			name: 'Marth',
			id: 'B00N4ABOXU'
		},
		active: true,
		selector: '#priceblock-wrapper-wrapper',
		url:'http://www.amazon.com/gp/product/B00N4ABOXU/',
		store: 'Amazon',
		api: 'amazon',
		results: '',
		notify : ['John']
	},{
		item:{
			name: 'Silver Mario',
			id: '7532038'
		},
		active: true,
		selector: '#priceblock-wrapper-wrapper',
		url: 'http://www.bestbuy.com/site/nintendo-amiibo-figure-super-mario-series-mario-silver-edition-multi/7532038.p',
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
