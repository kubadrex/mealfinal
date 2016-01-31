'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * News Schema
 */
var NewsSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill title',
		trim: true
	},
	subtitle: {
		type: String,
		default: '',
		required: 'Please fill title',
		trim: true
	},
	excerpt: {
		type: String,
		default: '',
		required: 'Please fill excerpt',
		trim: true
	},
	postContent: {
		type: String,
		default: '',
		required: 'Please fill post content',
		trim: true
	},
	image: {
		type: String,
		default: '',
		required: 'Please fill image',
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

mongoose.model('News', NewsSchema);
