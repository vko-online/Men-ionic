'use strict';

//Game results service used to communicate Game results REST endpoints
angular.module('game-results').factory('GameResults', ['$resource', 'CORE_CONST',
	function($resource, CORE_CONST) {
		return $resource(CORE_CONST.REST_URL + 'game-results/:gameResultId', { gameResultId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);