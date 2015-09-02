'use strict';

// Car colors controller
angular.module('car-colors').controller('CarColorsController', ['$scope', '$stateParams', '$location', 'Authentication', 'CarColors',
	function($scope, $stateParams, $location, Authentication, CarColors) {
		$scope.authentication = Authentication;

		// Create new Car color
		$scope.create = function() {
			// Create new Car color object
			var carColor = new CarColors ({
				name: this.name
			});

			// Redirect after save
			carColor.$save(function(response) {
				$location.path('car-colors/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Car color
		$scope.remove = function(carColor) {
			if ( carColor ) { 
				carColor.$remove();

				for (var i in $scope.carColors) {
					if ($scope.carColors [i] === carColor) {
						$scope.carColors.splice(i, 1);
					}
				}
			} else {
				$scope.carColor.$remove(function() {
					$location.path('car-colors');
				});
			}
		};

		// Update existing Car color
		$scope.update = function() {
			var carColor = $scope.carColor;

			carColor.$update(function() {
				$location.path('car-colors/' + carColor._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Car colors
		$scope.find = function() {
			$scope.carColors = CarColors.query();
		};

		// Find existing Car color
		$scope.findOne = function() {
			$scope.carColor = CarColors.get({ 
				carColorId: $stateParams.carColorId
			});
		};
	}
]);