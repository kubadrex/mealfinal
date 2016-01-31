'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Drink = mongoose.model('Drink'),
	_ = require('lodash');

/**
 * Create a Drink
 */
exports.create = function(req, res) {
	var drink = new Drink(req.body);
	drink.user = req.user;

	drink.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(drink);
		}
	});
};

/**
 * Show the current Drink
 */
exports.read = function(req, res) {
	res.jsonp(req.drink);
};

/**
 * Update a Drink
 */
exports.update = function(req, res) {
	var drink = req.drink ;

	drink = _.extend(drink , req.body);

	drink.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(drink);
		}
	});
};

/**
 * Delete an Drink
 */
exports.delete = function(req, res) {
	var drink = req.drink ;

	drink.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(drink);
		}
	});
};

/**
 * List of Drinks
 */
exports.list = function(req, res) {
	Drink.find().sort('-created').populate('user', 'displayName').exec(function(err, drinks) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(drinks);
		}
	});
};

/**
 * Drink middleware
 */
exports.drinkByID = function(req, res, next, id) {
	Drink.findById(id).populate('user', 'displayName').exec(function(err, drink) {
		if (err) return next(err);
		if (! drink) return next(new Error('Failed to load Drink ' + id));
		req.drink = drink ;
		next();
	});
};

/**
 * Drink authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	var isAdmin = req.user.roles.indexOf('admin') > -1 ? true : false;

	if (!isAdmin) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
