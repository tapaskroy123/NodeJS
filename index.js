/*
*
* Basic start file of the API
*/

//Dependencies
var http = require('http');
var https = require('https');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config');
var fs = require('fs');


//Create the http server
var httpServer = http.createServer(function(req,res){
unifiedServer(req,res);
});



//Create the https server
var httpsServerOptions = {
'key': fs.readFileSync('./https/key.pem'),
'cert':fs.readFileSync('./https/cert.pem')

};

var httpsServer = https.createServer(httpsServerOptions,function(req,res){
    unifiedServer(req,res);
    });


//Listen to the http port 3000
httpServer.listen(config.httpPort,function(){
    console.log("The server is listening to port "+config.httpPort+" in "+ config.envName +" mode.");
    });


    //Listen to the http port 3000
httpsServer.listen(config.httpsPort,function(){
    console.log("The server is listening to port "+config.httpsPort+" in "+ config.envName +" mode.");
    });

var unifiedServer = function(req,res){

    //Get and Parse the url
var parsedUrl = url.parse(req.url,true);

//Get the path from the url
var path = parsedUrl.pathname;
var trimmedPath = path.replace(/^\/+|\/+$/g,'');

//Get the query object
var stringQueryObject = parsedUrl.query;

//Get the headers as object
var requestHeaders = req.headers;

//Get the method
var method = req.method.toLowerCase();

//Get the request payload, if any
var decoder = new StringDecoder('utf-8'); 
var buffer='';

req.on('data',function(data){

    buffer += decoder.write(data);

});

req.on('end',function(){

buffer += decoder.end();

//get the chosen handler
var chosenHandler = typeof(router[trimmedPath.toLowerCase()]) !== 'undefined' ? router[trimmedPath.toLowerCase()]: handlers.notFound;

var data = {

    'trimmedpath' : trimmedPath,
    'querystring' : stringQueryObject,
    'method' : method,
    'headers' : requestHeaders,
    'payload' : buffer
};

//route the request to the appropriate handler
chosenHandler(data,function(statusCode,payload){

    //get the status code or default 202
    statusCodeS = typeof(statusCode)=='number' ? statusCode : 202;

// Get the payload or default to empty object
    payload = typeof(payload) =='object' ? payload : {};

var payLoadString = JSON.stringify(payload)
//Send the response
//res.end('Hello World!\n');
res.setHeader('content-type','application/json');
res.writeHead(statusCode);
res.end(payLoadString);
console.log('returning the response',statusCode,payLoadString);
//Log the request
//console.log('Request received at the path: '+ trimmedPath + ' with method: '+ method + ' with the query object ', stringQueryObject);
//console.log('Request received with http headers',requestHeaders);
//console.log('Payload is ',buffer)

        });
    });
};



var handlers ={};

handlers.hello = function(data,callback){
callback(200,{'msg':'Welcome to the Hello World demo!'});

};

handlers.sample = function(data, callback){

callback(200,{foo:'Bar', fuzz:'buzz'});
};

handlers.users = function(data, callback){

    callback(200,{firstName:'Tapas', lastName:'Roy'});
};

handlers.ping = function(data,callback){
callback(202);

};

handlers.notFound = function(data,callback){

callback(404,{});

};

var router = {
'hello':handlers.hello,
'sample' : handlers.sample,
'users' : handlers.users,
'ping': handlers.ping

};