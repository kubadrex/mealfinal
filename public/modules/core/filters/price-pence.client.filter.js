'use strict';

angular.module('core').filter('priceFromPence', ['$filter',
	function($filter) {
		return function(input) {
			return $filter('currency')(input/100, "€", "0.00")
		};
	}
]);