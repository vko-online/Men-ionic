'use strict';

//Setting up route
angular.module('game-results').config(['$stateProvider',
	function($stateProvider) {
		// Game results state routing
		$stateProvider.
		state('listGameResults', {
			url: '/game-results',
			templateUrl: 'modules/game-results/views/list-game-results.client.view.html'
		}).
		state('createGameResult', {
			url: '/game-results/create',
			templateUrl: 'modules/game-results/views/create-game-result.client.view.html'
		}).
		state('viewGameResult', {
			url: '/game-results/:gameResultId',
			templateUrl: 'modules/game-results/views/view-game-result.client.view.html'
		}).
		state('editGameResult', {
			url: '/game-results/:gameResultId/edit',
			templateUrl: 'modules/game-results/views/edit-game-result.client.view.html'
		});
	}
]);