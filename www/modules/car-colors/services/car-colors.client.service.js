'use strict';

//Car colors service used to communicate Car colors REST endpoints
angular.module('car-colors').factory('CarColors', ['$resource',
	function($resource) {
		return $resource('car-colors/:carColorId', { carColorId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);