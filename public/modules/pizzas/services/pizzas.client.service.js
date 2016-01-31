'use strict';

//Pizzas service used to communicate Pizzas REST endpoints
angular.module('pizzas').factory('Pizzas', ['$resource',
	function($resource) {
		return $resource('pizzas/:pizzaId', { pizzaId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);