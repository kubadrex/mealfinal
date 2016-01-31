'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var pizzas = require('../../app/controllers/pizzas.server.controller');

	// Pizzas Routes
	app.route('/pizzas')
		.get(pizzas.list)
		.post(users.requiresLogin, pizzas.create);

	app.route('/pizzas/:pizzaId')
		.get(pizzas.read)
		.put(users.requiresLogin, pizzas.hasAuthorization, pizzas.update)
		.delete(users.requiresLogin, pizzas.hasAuthorization, pizzas.delete);

	// Finish by binding the Pizza middleware
	app.param('pizzaId', pizzas.pizzaByID);
};
