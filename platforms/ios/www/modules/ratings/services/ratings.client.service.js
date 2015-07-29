'use strict';

//Ratings service used to communicate Ratings REST endpoints
angular.module('ratings').factory('Ratings', ['$resource', 'CORE_CONST',
	function($resource, CORE_CONST) {
		return $resource(CORE_CONST.REST_URL + 'ratings/:ratingId', { ratingId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);