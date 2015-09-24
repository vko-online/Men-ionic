'use strict';

// Car models controller
angular.module('cars').controller('CarsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Cars', 'Carriers',
	function($scope, $stateParams, $location, Authentication, Cars, Carriers) {
		$scope.authentication = Authentication;

		// Create new Car model
		$scope.create = function() {
			// Create new Car model object
			var car = new Cars ({
				name: this.name
			});

			// Redirect after save
			car.$save(function(response) {
				$location.path('cars/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
		$scope.callback = function(){
			$location.path('cars');
		};
		// Update existing Car model
		$scope.update = function() {
			var car = $scope.car;

			car.$update(function() {
				$location.path('cars/' + car._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Car models
		$scope.find = function() {
			$scope.cars = Cars.query();
		};

		// Find existing Car model
		$scope.findOne = function() {
			$scope.car = Cars.get({ 
				carId: $stateParams.carId
			});
		};
		$scope.findCarriers = function() {
			$scope.carriers = Carriers.query();
		};

		// Find existing Car model
		$scope.findOneByCarrier = function() {
			$scope.carriers = Carriers.get_by_frames({ 
				carrierId: $stateParams.carrierId
			});
		};
	}
]);