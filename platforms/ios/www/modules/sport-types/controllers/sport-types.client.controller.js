'use strict';

// Sport types controller
angular.module('sport-types').controller('SportTypesController', ['$scope', '$stateParams', '$location', 'Authentication', 'SportTypes',
	function($scope, $stateParams, $location, Authentication, SportTypes) {
		$scope.authentication = Authentication;

		// Create new Sport type
		$scope.create = function() {
			// Create new Sport type object
			var sportType = new SportTypes ({
				name: this.name,
				player_amount: this.player_amount
			});

			// Redirect after save
			sportType.$save(function(response) {
				$location.path('sport-types/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Sport type
		$scope.remove = function(sportType) {
			if ( sportType ) { 
				sportType.$remove();

				for (var i in $scope.sportTypes) {
					if ($scope.sportTypes [i] === sportType) {
						$scope.sportTypes.splice(i, 1);
					}
				}
			} else {
				$scope.sportType.$remove(function() {
					$location.path('sport-types');
				});
			}
		};

		// Update existing Sport type
		$scope.update = function() {
			var sportType = $scope.sportType;

			sportType.$update(function() {
				$location.path('sport-types/' + sportType._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Sport types
		$scope.find = function() {
			$scope.sportTypes = SportTypes.query();
		};

		// Find existing Sport type
		$scope.findOne = function() {
			$scope.sportType = SportTypes.get({ 
				sportTypeId: $stateParams.sportTypeId
			});
		};
	}
]);
