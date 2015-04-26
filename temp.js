var http = require('http');
var cheerio = require('cheerio');
var nodemailer = require('nodemailer');
var MongoClient = require('mongodb').MongoClient;
var moment = require('moment');

var site = {};

var request = http.request(site.requestOptions, function(response){

  var body = '';

  response.on('data', function(chunk){
    body += chunk;
  });

  response.on('end', function(){

    $ = cheerio.load(body);

      var elementString = $.html(site.selector);

      callback(elementString);

  });

});

request.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});

request.end();
