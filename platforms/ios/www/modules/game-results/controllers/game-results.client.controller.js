'use strict';

// Game results controller
angular.module('game-results').controller('GameResultsController', ['$scope', '$stateParams', '$location', 'Authentication', 'GameResults',
	function($scope, $stateParams, $location, Authentication, GameResults) {
		$scope.authentication = Authentication;

		// Create new Game result
		$scope.create = function() {
			// Create new Game result object
			var gameResult = new GameResults ({
				name: this.name
			});

			// Redirect after save
			gameResult.$save(function(response) {
				$location.path('game-results/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Game result
		$scope.remove = function(gameResult) {
			if ( gameResult ) { 
				gameResult.$remove();

				for (var i in $scope.gameResults) {
					if ($scope.gameResults [i] === gameResult) {
						$scope.gameResults.splice(i, 1);
					}
				}
			} else {
				$scope.gameResult.$remove(function() {
					$location.path('game-results');
				});
			}
		};

		// Update existing Game result
		$scope.update = function() {
			var gameResult = $scope.gameResult;

			gameResult.$update(function() {
				$location.path('game-results/' + gameResult._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Game results
		$scope.find = function() {
			$scope.gameResults = GameResults.query();
		};

		// Find existing Game result
		$scope.findOne = function() {
			$scope.gameResult = GameResults.get({ 
				gameResultId: $stateParams.gameResultId
			});
		};
	}
]);