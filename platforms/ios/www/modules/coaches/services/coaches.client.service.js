'use strict';

//Coaches service used to communicate Coaches REST endpoints
angular.module('coaches').factory('Coaches', ['$resource', 'CORE_CONST',
	function($resource, CORE_CONST) {
		return $resource(CORE_CONST.REST_URL + 'coaches/:coachId', { coachId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},
			create_price_list: {
				method: 'POST',
				url: CORE_CONST.REST_URL + 'coaches/:coachId/price-list'
			},
			delete_price_list: {
				method: 'DELETE',
				url: CORE_CONST.REST_URL + 'coaches/:coachId/price-list'
			}
		});
	}
]);
