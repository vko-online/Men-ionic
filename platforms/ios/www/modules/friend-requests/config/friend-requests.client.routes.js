'use strict';

//Setting up route
angular.module('friend-requests').config(['$stateProvider',
	function($stateProvider) {
		// Friend requests state routing
		$stateProvider.
		state('listFriendRequests', {
			url: '/friend-requests',
			templateUrl: 'modules/friend-requests/views/list-friend-requests.client.view.html'
		}).
		state('createFriendRequest', {
			url: '/friend-requests/create',
			templateUrl: 'modules/friend-requests/views/create-friend-request.client.view.html'
		}).
		state('viewFriendRequest', {
			url: '/friend-requests/:friendRequestId',
			templateUrl: 'modules/friend-requests/views/view-friend-request.client.view.html'
		}).
		state('editFriendRequest', {
			url: '/friend-requests/:friendRequestId/edit',
			templateUrl: 'modules/friend-requests/views/edit-friend-request.client.view.html'
		});
	}
]);