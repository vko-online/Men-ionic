'use strict';

//Car models service used to communicate Car models REST endpoints
angular.module('car-models').factory('CarModels', ['$resource', 'CORE_CONST',
	function($resource, CORE_CONST) {
		return $resource(CORE_CONST.REST_URL + 'car-models/:carModelId', { carModelId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);