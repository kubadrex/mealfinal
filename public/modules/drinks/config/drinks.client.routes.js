'use strict';

//Setting up route
angular.module('drinks').config(['$stateProvider',
	function($stateProvider) {
		// Drinks state routing
		$stateProvider.
		state('listDrinks', {
			url: '/drinks',
			templateUrl: 'modules/drinks/views/list-drinks.client.view.html'
		}).
		state('createDrink', {
			url: '/drinks/create',
			templateUrl: 'modules/drinks/views/create-drink.client.view.html'
		}).
		state('viewDrink', {
			url: '/drinks/:drinkId',
			templateUrl: 'modules/drinks/views/edit-drink.client.view.html'
		}).
		state('editDrink', {
			url: '/drinks/:drinkId/edit',
			templateUrl: 'modules/drinks/views/edit-drink.client.view.html'
		});
	}
]);
