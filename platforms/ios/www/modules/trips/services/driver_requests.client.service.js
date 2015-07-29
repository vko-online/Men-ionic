// by bwin on 7/22/15.

'use strict';

angular.module('trips').factory('DriverRequests', ['$resource', 'CORE_CONST',
    function($resource, CORE_CONST) {
        return $resource(CORE_CONST.REST_URL + 'trips/:tripId/driver_requests', {}, {
            query: {
                method: 'GET',
                isArray: false
            }
        });
    }
]);