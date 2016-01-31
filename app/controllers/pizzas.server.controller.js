'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Pizza = mongoose.model('Pizza'),
	_ = require('lodash');

/**
 * Create a Pizza
 */
exports.create = function(req, res) {
	var pizza = new Pizza(req.body);
	pizza.user = req.user;

	pizza.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(pizza);
		}
	});
};

/**
 * Show the current Pizza
 */
exports.read = function(req, res) {
	res.jsonp(req.pizza);
};

/**
 * Update a Pizza
 */
exports.update = function(req, res) {
	var pizza = req.pizza ;

	pizza = _.extend(pizza , req.body);

	pizza.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(pizza);
		}
	});
};

/**
 * Delete an Pizza
 */
exports.delete = function(req, res) {
	var pizza = req.pizza ;

	pizza.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(pizza);
		}
	});
};

/**
 * List of Pizzas
 */
exports.list = function(req, res) {
	Pizza.find().sort('-created').populate('user', 'displayName').exec(function(err, pizzas) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(pizzas);
		}
	});
};

/**
 * Pizza middleware
 */
exports.pizzaByID = function(req, res, next, id) {
	Pizza.findById(id).populate('user', 'displayName').exec(function(err, pizza) {
		if (err) return next(err);
		if (! pizza) return next(new Error('Failed to load Pizza ' + id));
		req.pizza = pizza ;
		next();
	});
};

/**
 * Pizza authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	var isAdmin = req.user.roles.indexOf('admin') > -1 ? true : false;

	if (!isAdmin) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
