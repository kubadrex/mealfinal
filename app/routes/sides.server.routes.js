'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var sides = require('../../app/controllers/sides.server.controller');

	// Sides Routes
	app.route('/sides')
		.get(sides.list)
		.post(users.requiresLogin, sides.create);

	app.route('/sides/:sideId')
		.get(sides.read)
		.put(users.requiresLogin, sides.hasAuthorization, sides.update)
		.delete(users.requiresLogin, sides.hasAuthorization, sides.delete);

	// Finish by binding the Side middleware
	app.param('sideId', sides.sideByID);
};
