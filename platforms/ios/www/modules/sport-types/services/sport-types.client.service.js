'use strict';

//Sport types service used to communicate Sport types REST endpoints
angular.module('sport-types').factory('SportTypes', ['$resource', 'CORE_CONST',
	function($resource, CORE_CONST) {
		return $resource(CORE_CONST.REST_URL + 'sport-types/:sportTypeId', { sportTypeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);