'use strict';

//Feeds service used to communicate Feeds REST endpoints
angular.module('feeds').factory('Feeds', ['$resource', 'CORE_CONST',
	function($resource, CORE_CONST) {
		return $resource(CORE_CONST.REST_URL + 'feeds/:feedId', { feedId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);