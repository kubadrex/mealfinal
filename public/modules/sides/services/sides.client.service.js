'use strict';

//Sides service used to communicate Sides REST endpoints
angular.module('sides').factory('Sides', ['$resource',
	function($resource) {
		return $resource('sides/:sideId', { sideId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);