'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Drink Schema
 */
var DrinkSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Drink name',
		trim: true
	},
	volume: {
		type: String,
		default: '',
		required: 'Please fill volume',
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
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Drink', DrinkSchema);
