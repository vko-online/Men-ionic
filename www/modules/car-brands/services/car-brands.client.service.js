'use strict';

//Car brands service used to communicate Car brands REST endpoints
angular.module('car-brands').factory('CarBrands', ['$resource',
	function($resource) {
		return $resource('car-brands/:carBrandId', { carBrandId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);