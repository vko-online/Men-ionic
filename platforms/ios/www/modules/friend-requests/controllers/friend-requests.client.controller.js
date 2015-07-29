'use strict';

// Friend requests controller
angular.module('friend-requests').controller('FriendRequestsController', ['$scope', '$stateParams', '$location', 'Authentication', 'FriendRequests',
	function($scope, $stateParams, $location, Authentication, FriendRequests) {
		$scope.authentication = Authentication;

		// Create new Friend request
		$scope.create = function() {
			// Create new Friend request object
			var friendRequest = new FriendRequests ({
				name: this.name
			});

			// Redirect after save
			friendRequest.$save(function(response) {
				$location.path('friend-requests/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Friend request
		$scope.remove = function(friendRequest) {
			if ( friendRequest ) { 
				friendRequest.$remove();

				for (var i in $scope.friendRequests) {
					if ($scope.friendRequests [i] === friendRequest) {
						$scope.friendRequests.splice(i, 1);
					}
				}
			} else {
				$scope.friendRequest.$remove(function() {
					$location.path('friend-requests');
				});
			}
		};

		// Update existing Friend request
		$scope.update = function() {
			var friendRequest = $scope.friendRequest;

			friendRequest.$update(function() {
				$location.path('friend-requests/' + friendRequest._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Friend requests
		$scope.find = function() {
			$scope.friendRequests = FriendRequests.query();
		};

		// Find existing Friend request
		$scope.findOne = function() {
			$scope.friendRequest = FriendRequests.get({ 
				friendRequestId: $stateParams.friendRequestId
			});
		};
	}
]);