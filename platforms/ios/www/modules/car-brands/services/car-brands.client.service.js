'use strict';

//Car brands service used to communicate Car brands REST endpoints
angular.module('car-brands').factory('CarBrands', ['$resource', 'CORE_CONST',
	function($resource, CORE_CONST) {
		return $resource(CORE_CONST.REST_URL + 'car-brands/:carBrandId', { carBrandId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);