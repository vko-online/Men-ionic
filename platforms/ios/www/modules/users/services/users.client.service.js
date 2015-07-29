'use strict';
// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource', 'CORE_CONST',
    function($resource, CORE_CONST){
        return $resource(CORE_CONST.REST_URL + 'users/:userId', {
            userId: '@_id'
        }, {
            update: {
                method: 'PUT'
            },
            follow_unfollow: {
                method: 'POST',
                url: CORE_CONST.REST_URL + 'users/:userId/follow_unfollow'
            }
        });
    }
]);
