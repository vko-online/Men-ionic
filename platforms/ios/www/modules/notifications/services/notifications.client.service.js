'use strict';

//Notifications service used to communicate Notifications REST endpoints
angular.module('notifications').factory('Notifications', ['$resource', 'CORE_CONST',
	function($resource, CORE_CONST) {
		return $resource(CORE_CONST.REST_URL + 'notifications/:notificationId', { notificationId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);