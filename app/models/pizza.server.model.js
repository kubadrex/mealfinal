'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;


/**
 * Pizza Schema
 */
var PizzaSchema = new Schema({
	pizzaName: {
		type: String,
		default: '',
		required: 'Please fill Pizza name',
		trim: true
	},
	ingredients: {
		type: String,
		default: '',
		required: 'Please fill ingredients',
		trim: true
	},
	bigPrice: {
		type: String,
		default: '',
		required: 'Please fill price',
		trim: true
	},
	mediumPrice: {
		type: String,
		default: '',
		required: 'Please fill price',
		trim: true
	},
	smallPrice: {
		type: String,
		default: '',
		required: 'Please fill price',
		trim: true
	},
	thumbnail: {
		type: String,
		default: '',
		required: 'Please fill thumbnail name',
		trim: true
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

mongoose.model('Pizza', PizzaSchema);
