//  List.js
//  List
//
//  Created by Oluwalayomi Akinrinade on 11/15/16.
//  Copyright © 2016 Oluwalayomi Akinrinade. All rights reserved.

// CALL PACKAGES
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// list schema
var ListSchema = new Schema({
	owner: String, // { type: String, ref: 'User' },
	name: { type: String, required: true },
	description: String,
	groceries: { type: Schema.Types.Mixed, required: true },
	imgName: String,
	funds: { type: Number, required: true }
}, {
	timestamps: true
});

// return model
module.exports = mongoose.model('List', ListSchema);