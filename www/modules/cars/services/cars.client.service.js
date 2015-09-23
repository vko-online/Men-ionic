'use strict';

//Car models service used to communicate Car models REST endpoints
angular.module('cars').factory('Cars', ['$resource', 'CORE_CONST',
	function($resource, CORE_CONST) {
		return $resource(CORE_CONST.REST_URL + 'cars/:carId', { carId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);