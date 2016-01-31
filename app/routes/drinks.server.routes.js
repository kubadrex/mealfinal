'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var drinks = require('../../app/controllers/drinks.server.controller');

	// Drinks Routes
	app.route('/drinks')
		.get(drinks.list)
		.post(users.requiresLogin, drinks.create);

	app.route('/drinks/:drinkId')
		.get(drinks.read)
		.put(users.requiresLogin, drinks.hasAuthorization, drinks.update)
		.delete(users.requiresLogin, drinks.hasAuthorization, drinks.delete);

	// Finish by binding the Drink middleware
	app.param('drinkId', drinks.drinkByID);
};
