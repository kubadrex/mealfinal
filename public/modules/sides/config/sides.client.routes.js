'use strict';

//Setting up route
angular.module('sides').config(['$stateProvider',
	function($stateProvider) {
		// Sides state routing
		$stateProvider.
		state('listSides', {
			url: '/sides',
			templateUrl: 'modules/sides/views/list-sides.client.view.html'
		}).
		state('createSide', {
			url: '/sides/create',
			templateUrl: 'modules/sides/views/create-side.client.view.html'
		}).
		state('viewSide', {
			url: '/sides/:sideId',
			templateUrl: 'modules/sides/views/edit-side.client.view.html'
		}).
		state('editSide', {
			url: '/sides/:sideId/edit',
			templateUrl: 'modules/sides/views/edit-side.client.view.html'
		});
	}
]);
