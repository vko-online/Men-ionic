'use strict';

//Tournaments service used to communicate Tournaments REST endpoints
angular.module('tournaments').factory('Tournaments', ['$resource', 'CORE_CONST',
	function($resource, CORE_CONST) {
		return $resource(CORE_CONST.REST_URL + 'tournaments/:tournamentId', { tournamentId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);