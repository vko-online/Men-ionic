'use strict';

//Teams service used to communicate Teams REST endpoints
angular.module('teams').factory('Teams', ['$resource', 'CORE_CONST',
	function($resource, CORE_CONST) {
		return $resource(CORE_CONST.REST_URL + 'teams/:teamId', { teamId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);