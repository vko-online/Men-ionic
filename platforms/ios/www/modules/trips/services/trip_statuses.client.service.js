// by bwin on 7/7/15.

'use strict';

angular.module('trips').factory('TripStatuses', ['$resource', 'CORE_CONST',
    function($resource, CORE_CONST) {
        return $resource(CORE_CONST.REST_URL + 'trips/statuses', {}, {
            query: {
                isArray: false
            }
        });
    }
]);