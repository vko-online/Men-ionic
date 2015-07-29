'use strict';

//Setting up route
angular.module('game-requests').config(['$stateProvider',
	function($stateProvider) {
		// Game requests state routing
		$stateProvider.
		state('listGameRequests', {
			url: '/game-requests',
			templateUrl: 'modules/game-requests/views/list-game-requests.client.view.html'
		}).
		state('createGameRequest', {
			url: '/game-requests/create',
			templateUrl: 'modules/game-requests/views/create-game-request.client.view.html'
		}).
		state('viewGameRequest', {
			url: '/game-requests/:gameRequestId',
			templateUrl: 'modules/game-requests/views/view-game-request.client.view.html'
		}).
		state('editGameRequest', {
			url: '/game-requests/:gameRequestId/edit',
			templateUrl: 'modules/game-requests/views/edit-game-request.client.view.html'
		});
	}
]);