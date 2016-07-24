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
	
	apiRouter.route("/users")
	
		.post(function(req, res) {
			//new instance of User model
			var user = new User();
			
			//set users information (which comes from request)
			user.firstName = req.body.firstName;
			user.lastName  = req.body.lastName;
			user.username  = req.body.username;
			user.email     = req.body.email;
			user.password  = req.body.password;
			
			user.save(function(err) {
			
				if (err) {
					//duplicate entry
					if (err.code == 11000)
						return res.json({ success: false, message: "A user with either that username or that password already exists." });
					else
						return res.send(err);
				}
				
				res.json({ message: "User created!", user_id: user.id });
			
			});
		})
	
		.get(function(req, res) {
			//attempt to find all users
			User.find(function(err, users) {
				//if error, return error
				if (err)
					res.send(err);
				
				//return all users
				res.json(users);
			});
		});
	
	return apiRouter;
}
