'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Side Schema
 */
var SideSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill side',
		trim: true
	},
	ingredients: {
		type: String,
		default: '',
		required: 'Please fill ingredients',
		trim: true
	},
	price: {
		type: String,
		default: '',
		required: 'Please fill price',
		trim: true
	},
	thumbnail: {
		type: String,
		default: '',
		required: 'Please fill thumbnail',
		trim: true
	},
	gluten: {
		type: Boolean
	},
	lactose: {
		type: Boolean
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Side', SideSchema);
