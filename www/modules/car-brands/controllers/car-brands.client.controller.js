'use strict';

// Car brands controller
angular.module('car-brands').controller('CarBrandsController', ['$scope', '$stateParams', '$location', 'Authentication', 'CarBrands',
	function($scope, $stateParams, $location, Authentication, CarBrands) {
		$scope.authentication = Authentication;

		// Create new Car brand
		$scope.create = function() {
			// Create new Car brand object
			var carBrand = new CarBrands ({
				name: this.name
			});

			// Redirect after save
			carBrand.$save(function(response) {
				$location.path('car-brands/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Car brand
		$scope.remove = function(carBrand) {
			if ( carBrand ) { 
				carBrand.$remove();

				for (var i in $scope.carBrands) {
					if ($scope.carBrands [i] === carBrand) {
						$scope.carBrands.splice(i, 1);
					}
				}
			} else {
				$scope.carBrand.$remove(function() {
					$location.path('car-brands');
				});
			}
		};

		// Update existing Car brand
		$scope.update = function() {
			var carBrand = $scope.carBrand;

			carBrand.$update(function() {
				$location.path('car-brands/' + carBrand._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Car brands
		$scope.find = function() {
			$scope.carBrands = CarBrands.query();
		};

		// Find existing Car brand
		$scope.findOne = function() {
			$scope.carBrand = CarBrands.get({ 
				carBrandId: $stateParams.carBrandId
			});
		};
	}
]);