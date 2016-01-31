'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Side = mongoose.model('Side'),
	_ = require('lodash');

/**
 * Create a Side
 */
exports.create = function(req, res) {
	var side = new Side(req.body);
	side.user = req.user;

	side.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(side);
		}
	});
};

/**
 * Show the current Side
 */
exports.read = function(req, res) {
	res.jsonp(req.side);
};

/**
 * Update a Side
 */
exports.update = function(req, res) {
	var side = req.side ;

	side = _.extend(side , req.body);

	side.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(side);
		}
	});
};

/**
 * Delete an Side
 */
exports.delete = function(req, res) {
	var side = req.side ;

	side.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(side);
		}
	});
};

/**
 * List of Sides
 */
exports.list = function(req, res) {
	Side.find().sort('-created').populate('user', 'displayName').exec(function(err, sides) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(sides);
		}
	});
};

/**
 * Side middleware
 */
exports.sideByID = function(req, res, next, id) {
	Side.findById(id).populate('user', 'displayName').exec(function(err, side) {
		if (err) return next(err);
		if (! side) return next(new Error('Failed to load Side ' + id));
		req.side = side ;
		next();
	});
};

/**
 * Side authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	var isAdmin = req.user.roles.indexOf('admin') > -1 ? true : false;

	if (!isAdmin) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
