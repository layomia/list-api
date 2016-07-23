//  server.js
//  List
//
//  Created by Oluwalayomi Akinrinade on 7/23/16.
//  Copyright © 2016 Oluwalayomi Akinrinade. All rights reserved.

//CALL PACKAGES
var express    = require("express");
var app        = express(); 
var bodyParser = require("body-parser");
var morgan     = require("morgan");
var mongodb    = require("mongodb");
var ObjectID   = mongodb.ObjectId;


//APP Configuration
// use body parser to grab information from POST requests
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

// configure app to handle CORS requests
app.use(function(req, res, next) {
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
next();
});

// log all requests to the console
app.use(morgan('dev'));


// Database variable outside of database connection callback to reuse connection pool in app
var db;

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGODB_URI, function(err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse
  db = database;
  console.log("Database connection ready");

  // Initialize app
  var server = app.listen(process.env.PORT || 8080, function () {
	var port = server.address().port;
    console.log("App now running on port", port);
  });
});

//ROUTES FOR API
