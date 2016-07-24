//  api.js
//  List
//
//  Created by Oluwalayomi Akinrinade on 7/23/16.
//  Copyright © 2016 Oluwalayomi Akinrinade. All rights reserved.

var User = require("../models/user");

module.exports = function(app, express) {
	
	var apiRouter = express.Router();
	
	//middleware to use for all requests
	apiRouter.use(function(req, res, next) {
		//authenticate users here
		
		next();
	});
	
	//root response for api
	//accessed at http://list-backend-api.herokuapp.com/api/
	apiRouter.get("/", function(req, res) {
		res.json({ message: "Hooray! Welcome to List API!" });
	});
	
	return apiRouter;
}
