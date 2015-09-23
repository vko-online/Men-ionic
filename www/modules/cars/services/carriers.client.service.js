'use strict';

angular.module('cars').factory('Carriers', ['$resource', 'CORE_CONST',
	function($resource, CORE_CONST) {
		return $resource(CORE_CONST.REST_URL + 'carriers/:carrierId', { carrierId: '@_id'
		}, {
			get_by_frames: {
				method: 'GET',
				isArray: true,
				url: CORE_CONST.REST_URL + 'carriers/:carrierId/date_frame'
			},
			update: {
				method: 'PUT'
			}
		});
	}
]);