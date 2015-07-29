'use strict';

// Game requests controller
angular.module('game-requests').controller('GameRequestsController', ['$scope', '$stateParams', '$location', 'Authentication', 'GameRequests',
	function($scope, $stateParams, $location, Authentication, GameRequests) {
		$scope.authentication = Authentication;

		// Create new Game request
		$scope.create = function() {
			// Create new Game request object
			var gameRequest = new GameRequests ({
				name: this.name
			});

			// Redirect after save
			gameRequest.$save(function(response) {
				$location.path('game-requests/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Game request
		$scope.remove = function(gameRequest) {
			if ( gameRequest ) { 
				gameRequest.$remove();

				for (var i in $scope.gameRequests) {
					if ($scope.gameRequests [i] === gameRequest) {
						$scope.gameRequests.splice(i, 1);
					}
				}
			} else {
				$scope.gameRequest.$remove(function() {
					$location.path('game-requests');
				});
			}
		};

		// Update existing Game request
		$scope.update = function() {
			var gameRequest = $scope.gameRequest;

			gameRequest.$update(function() {
				$location.path('game-requests/' + gameRequest._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Game requests
		$scope.find = function() {
			$scope.gameRequests = GameRequests.query();
		};

		// Find existing Game request
		$scope.findOne = function() {
			$scope.gameRequest = GameRequests.get({ 
				gameRequestId: $stateParams.gameRequestId
			});
		};
	}
]);