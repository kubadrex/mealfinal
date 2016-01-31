'use strict';

//Setting up route
angular.module('pizzas').config(['$stateProvider',
	function($stateProvider) {
		// Pizzas state routing
		$stateProvider.
		state('listPizzas', {
			url: '/pizzas',
			templateUrl: 'modules/pizzas/views/list-pizzas.client.view.html'
		}).
		state('createPizza', {
			url: '/pizzas/create',
			templateUrl: 'modules/pizzas/views/create-pizza.client.view.html'
		}).
		state('viewPizza', {
			url: '/pizzas/:pizzaId',
			templateUrl: 'modules/pizzas/views/edit-pizza.client.view.html'
		}).
		state('editPizza', {
			url: '/pizzas/:pizzaId/edit',
			templateUrl: 'modules/pizzas/views/edit-pizza.client.view.html'
		});
	}
]);
