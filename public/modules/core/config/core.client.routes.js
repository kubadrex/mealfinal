'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		}).
		state('checkout', {
			url: '/checkout',
			templateUrl: 'modules/core/views/checkout.client.view.html'
		}).
		state('about-us', {
			url: '/about-us',
			templateUrl: 'modules/core/views/aboutus.client.view.html'
		}).
		state('restaurants', {
			url: '/restaurants',
			templateUrl: 'modules/core/views/restaurants.client.view.html'
		});
	}
]);
