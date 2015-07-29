'use strict';

//Game requests service used to communicate Game requests REST endpoints
angular.module('game-requests').factory('GameRequests', ['$resource', 'CORE_CONST',
	function($resource, CORE_CONST) {
		return $resource(CORE_CONST.REST_URL + 'game-requests/:gameRequestId', { gameRequestId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);