'use strict';

//Car colors service used to communicate Car colors REST endpoints
angular.module('car-colors').factory('CarColors', ['$resource', 'CORE_CONST',
	function($resource, CORE_CONST) {
		return $resource(CORE_CONST.REST_URL + 'car-colors/:carColorId', { carColorId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);