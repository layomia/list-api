//  api.js
//  List
//
//  Created by Oluwalayomi Akinrinade on 7/23/16.
//  Copyright © 2016 Oluwalayomi Akinrinade. All rights reserved.

var User = require("../models/user");
var List = require("../models/list");

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
					return res.send(err);
				}
				
				res.json({ errmsg: "Nil", message: "User created!", user_id: user.id });
			
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
	
	//authenticate user for login
	//returns json containing user id
	apiRouter.post("/authenticate_user", function(req, res) {
		
		// find the user
		// select the name email and password explicitly
		User.findOne({
			email: req.body.email
		}).select('email password').exec(function(err, user) {

			if (err) throw err;

			// no user with that email was found
			if (!user) {
				res.json({
					success: false,
					message: 'Authentication failed. User not found.'
				});
			} else if (user) {

				// check if password matches
				var validPassword = user.comparePassword(req.body.password);
				if (!validPassword) {
					res.json({
						success: false,
						message: 'Authentication failed. Wrong password.'
					});
				} else
					res.json(user);
			}

		});
		
	});
	
	//on routes that end in /users/:user_id
	apiRouter.route('/users/:user_id')

		// get the user with this id
		// (accessed at GET https://list-backend-api.herokuapp.com/api/users/:user_id)
		.get(function(req, res) {
			User.findById(req.params.user_id, function(err, user) {
				if (err) 
					res.send(err);

				// return that user
				res.json(user);
			});
		})
	
		// update the user with this id
		// (accessed at PUT https://list-backend-api.herokuapp.com/api/users/:user_id)
		.put(function(req, res) {
		
			// use user model to find user
			User.findById(req.params.user_id, function(err, user) {
		
				if (err) 
					res.send(err);

				// update the users info only if its new
				if (req.body.firstName) 
					user.firstName = req.body.firstName;
				if (req.body.lastName) 
					user.lastName = req.body.lastName;
				if (req.body.email) 
					user.email = req.body.email;
				if (req.body.username) 
					user.username = req.body.username;
				if (req.body.password) 
					user.password = req.body.password;

				// save the user
				user.save(function(err) {
					if (err)
						res.send(err);
					else
						res.json({ message: 'User updated!' });	
				});

			});
		})
	
		// delete the user with this id
		// (accessed at DELETE https://list-backend-api.herokuapp.com/api/users/:user_id)
		.delete(function(req, res) {
			User.remove({
				_id: req.params.user_id
			}, function(err, user) {
				if (err) 
					return res.send(err);
				else
					res.json({ message: 'Successfully deleted' });
			});
		});
		
	apiRouter.route('/lists')
		.post(function(req, res) {
			// new instance of List model
			var list = new List();
			
			// set lists information (which comes from request)
			list.owner = req.body.user_id;
			list.name  = req.body.name;
			list.description  = req.body.description;
			list.groceries = req.body.groceries;
			list.imgName     = req.body.imgName;
			list.funds  = req.body.funds;
			
			list.save(function(err) {
				if (err) {
					return res.send(err);
				}
				res.json({ errmsg: "Nil", message: "List created!", list_id: list.id });
			});
		})
		
		.get(function(req, res) {
			//attempt to find all users
			List.find(function(err, lists) {
				//if error, return error
				if (err)
					res.send(err);
				
				//return all users
				res.json(lists);
			});
		});
	
	apiRouter.route('/lists/:user_id')

		// get the lists associated with this user id
		// (accessed at GET https://endorse-backend-api.herokuapp.com/api/lists/:user_id)
		.get(function(req, res) {
			console.log(req.params.user_id);
			List.find({owner: req.params.user_id}, function(err, lists) {
				if (err) 
					res.send(err);
				// return all lists
				res.json(lists);
			});
		});
	
	return apiRouter;
}
