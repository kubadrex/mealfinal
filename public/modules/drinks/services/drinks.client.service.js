'use strict';

//Drinks service used to communicate Drinks REST endpoints
angular.module('drinks').factory('Drinks', ['$resource',
	function($resource) {
		return $resource('drinks/:drinkId', { drinkId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);