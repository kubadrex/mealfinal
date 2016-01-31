'use strict';

// Drinks controller
angular.module('drinks').controller('DrinksController', ['$scope', '$stateParams', '$location', 'Authentication', 'Drinks',
	function($scope, $stateParams, $location, Authentication, Drinks) {
		$scope.authentication = Authentication;

		// Create new Drink
		$scope.create = function() {
			// Create new Drink object
			var drink = new Drinks ({
				name: this.name,
				volume: this.volume,
				price: this.price,
				thumbnail: this.thumbnail,
				active: this.active
			});

			// Redirect after save
			drink.$save(function(response) {
				$location.path('drinks');

				// Clear form fields
				$scope.name = '';
				$scope.volume = '';
				$scope.price = '';
				$scope.thumbnail = '';
				$scope.active = '';

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Drink
		$scope.remove = function(drink) {
			if ( drink ) {
				drink.$remove();

				for (var i in $scope.drinks) {
					if ($scope.drinks [i] === drink) {
						$scope.drinks.splice(i, 1);
					}
				}
			} else {
				$scope.drink.$remove(function() {
					$location.path('drinks');
				});
			}
		};

		// Update existing Drink
		$scope.update = function() {
			var drink = $scope.drink;

			drink.$update(function() {
				$location.path('drinks');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Drinks
		$scope.find = function() {
			Drinks.query().$promise.then(function(drinks) {
				$scope.drinks = drinks.map(function(drink) {
					return angular.extend(drink, { orderType: 'DRINK'} );
				});
			});
		};

		// Find existing Drink
		$scope.findOne = function() {
			$scope.drink = Drinks.get({
				drinkId: $stateParams.drinkId
			});
		};
	}
]);
