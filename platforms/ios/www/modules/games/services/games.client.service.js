'use strict';

//Games service used to communicate Games REST endpoints
angular.module('games').factory('Games', ['$resource', 'CORE_CONST',
	function($resource, CORE_CONST) {
		return $resource(CORE_CONST.REST_URL + 'games/:gameId', { gameId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},
			add_comment: {
				url: CORE_CONST.REST_URL + 'games/:gameId/comments',
				method: 'POST'
			},
			remove_comment: {
				url: CORE_CONST.REST_URL + 'games/:gameId/comments',
				method: 'DELETE'
			},
			follow_unfollow: {
				url: CORE_CONST.REST_URL + 'games/:gameId/follow_unfollow',
				method: 'POST'
			},
			cancel_game: {
				url: CORE_CONST.REST_URL + 'games/:gameId/cancel_game',
				method: 'POST'
			},
			game_result: {
				url: CORE_CONST.REST_URL + 'games/:gameId/game_result',
				method: 'POST'
			},
			confirm_result: {
				url: CORE_CONST.REST_URL + 'games/:gameId/confirm_result',
				method: 'POST'
			}
		});
	}
]);
