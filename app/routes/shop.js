//  shop.js
//  List
//
//  Created by Oluwalayomi Akinrinade on 11/21/16.
//  Copyright © 2016 Oluwalayomi Akinrinade. All rights reserved.

var http =  require('http');

var walmartKey = "nvkbkdkfs8dp5khx9u5t4y2m";

//msrp? salesPrice?
var walmartItemIDMapping = {
	"1": "45796273", // Folgers Classic Roast Ground Coffee Medium, 30.5 OZ
	"2": "10818609", // Kellog's Cornflakes Original
	"3": "22210520", // Libby's Cut Green Beans, 14.5 oz, 4 ct
	// "4": "", // Oranges
	"5": "44391095", // NestFresh Dozen Large Brown Eggs
	"6": "35506194", // Horizon OrganicÂ® Lowfat Milk 6-8 oz. Boxes
	"7": "15754127", // Minute Maid Juices To Go 100% Orange Juice, 6pk
	"8": "48813512", // Ragu Old World Style Traditional Pasta Sauce, 45 oz, (Pack of 2)
	"9": "17179231" // Great Value Spaghetti Pasta, 1 lb, 4ct
}

var walmartPricing = {"1": 5, "2": 6, "3": 7, "4": 10, "5": 5, "6": 4, "7": 7, "8": 5, "9": 3}
var targetPricing = {"1": 8, "2": 5, "3": 9, "4": 8, "5": 3, "6": 8, "7": 8, "8": 5, "9": 6}

function getGroceryIds(groceries) {
	var groceryIDs = []		
	for (var category in groceries) {
		var cat = groceries[category];
				
		for (var grocery in cat) {
			groceryIDs.push(grocery);
		}
	}
	
	return groceryIDs
}

function calculateSum(itemIDs, store) {
	var sum = 0;
	pricing = store == 0 ? walmartPricing : targetPricing;

	for (var i = 0; i < itemIDs.length; i++) {
		sum += pricing[itemIDs[i]];
	}
	
	return sum;
}

module.exports = function(app, express) {
	
	var shopRouter = express.Router();
	
	//middleware to use for all requests
	shopRouter.use(function(req, res, next) {
		//authenticate users here
		next();
	});
	
	//root response for api
	//accessed at http://list-backend-api.herokuapp.com/api/
	shopRouter.get("/", function(req, res) {
		res.json({ message: "Hooray! Welcome to List API!" });
	});
	
	shopRouter.route("/list")
	
		.post(function(req, res) {
			var groceries = req.body.listItems;
			var groceryIDs = getGroceryIds(groceries);
			
			var storePrices = []
			var walmartSum = calculateSum(groceryIDs, 0);
			var targetSum = calculateSum(groceryIDs, 1);
		
			if (walmartSum <= targetSum) {
				storePrices.push({"name":"Walmart", "price": walmartSum, "imgName":"walmart"});
				storePrices.push({"name":"Target", "price": targetSum, "imgName":"target"});
			} else {
				storePrices.push({"name":"Target", "price": targetSum, "imgName":"target"});
				storePrices.push({"name":"Walmart", "price": walmartSum, "imgName":"walmart"});
			}
			
			res.json({"storesInfo": storePrices});
		})
	
		.get(function(req, res) {
			
		});
		
	return shopRouter;
}
