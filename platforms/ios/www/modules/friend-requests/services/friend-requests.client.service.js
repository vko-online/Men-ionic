'use strict';

//Friend requests service used to communicate Friend requests REST endpoints
angular.module('friend-requests').factory('FriendRequests', ['$resource', 'CORE_CONST',
	function($resource, CORE_CONST) {
		return $resource(CORE_CONST.REST_URL + 'friend-requests/:friendRequestId', { friendRequestId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);