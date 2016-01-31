'use strict';

// Sides controller
angular.module('sides').controller('SidesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Sides',
	function($scope, $stateParams, $location, Authentication, Sides) {
		$scope.authentication = Authentication;

		// Create new Side
		$scope.create = function() {
			// Create new Side object
			var side = new Sides ({
				name: this.name,
				ingredients: this.ingredients,
				price: this.price,
				thumbnail: this.thumbnail,
				gluten: this.gluten,
				lactose: this.lactose,
				active: this.active
			});

			// Redirect after save
			side.$save(function(response) {
				$location.path('sides');

				// Clear form fields
				$scope.name = '';
				$scope.ingredients = '';
				$scope.price = '';
				$scope.thumbnail = '';
				$scope.gluten = '';
				$scope.lactose = '';

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Side
		$scope.remove = function(side) {
			if ( side ) {
				side.$remove();

				for (var i in $scope.sides) {
					if ($scope.sides [i] === side) {
						$scope.sides.splice(i, 1);
					}
				}
			} else {
				$scope.side.$remove(function() {
					$location.path('sides');
				});
			}
		};

		// Update existing Side
		$scope.update = function() {
			var side = $scope.side;

			side.$update(function() {
				$location.path('sides');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Sides
		$scope.find = function() {
			Sides.query().$promise.then(function(sides) {
				$scope.sides = sides.map(function(side) {
					return angular.extend(side, { orderType: 'SIDE'} );
				});
			});
		};

		// Find existing Side
		$scope.findOne = function() {
			$scope.side = Sides.get({
				sideId: $stateParams.sideId
			});
		};
	}
]);
