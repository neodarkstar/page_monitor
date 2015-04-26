var page = require('webpage').create();
var system = require('system');

var args = system.args;

var url = args[1];
var selector = args[2];

page.onConsoleMessage = function(msg){

};

page.onError = function(msg){

};

page.onAlert = function(msg){

};

page.onConfirm = function(msg){
  return true;
};

page.onPrompt = function(msg){
  return '';
};

page.open(
  url,
  function(status){

      if(status === 'success'){

        var html = page.evaluate(function(selector){

          return document.querySelector(selector).outerHTML;

        }, selector);


        system.stdout.write(html);

      }

      phantom.exit();

  }
);
