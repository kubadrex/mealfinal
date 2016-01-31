'use strict';

// Pizzas controller
angular.module('pizzas').controller('PizzasController', ['$scope', '$stateParams', '$location', 'Authentication', 'Pizzas',
	function($scope, $stateParams, $location, Authentication, Pizzas) {
		$scope.authentication = Authentication;

		// Create new Pizza
		$scope.create = function() {
			// Create new Pizza object
			var pizza = new Pizzas ({
				pizzaName: this.pizzaName,
				ingredients: this.ingredients,
				bigPrice: this.bigPrice,
				mediumPrice: this.mediumPrice,
				smallPrice: this.smallPrice,
				thumbnail: this.thumbnail,
				active: this.active
			});

			// Redirect after save
			pizza.$save(function(response) {
				$location.path('pizzas');

				// Clear form fields
				$scope.pizza = '';
				$scope.ingredients = '';
				$scope.bigPrice = '';
				$scope.mediumPrice = '';
				$scope.smallPrice = '';
				$scope.thumbnail = '';
				$scope.active = '';

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Pizza
		$scope.remove = function(pizza) {
			if ( pizza ) {
				pizza.$remove();

				for (var i in $scope.pizzas) {
					if ($scope.pizzas [i] === pizza) {
						$scope.pizzas.splice(i, 1);
					}
				}
			} else {
				$scope.pizza.$remove(function() {
					$location.path('pizzas');
				});
			}
		};

		// Update existing Pizza
		$scope.update = function() {
			var pizza = $scope.pizza;

			pizza.$update(function() {
				$location.path('pizzas');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Pizzas
		$scope.find = function() {
			Pizzas.query().$promise.then(function(pizzas) {
				$scope.pizzas = pizzas.map(function(pizza) {
					return angular.extend(pizza, { orderType: 'PIZZA'} );
				});
			});
		};

		// Find existing Pizza
		$scope.findOne = function() {
			$scope.pizza = Pizzas.get({
				pizzaId: $stateParams.pizzaId
			});
		};
	}
]);
