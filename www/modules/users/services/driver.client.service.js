// by bwin on 6/25/15.

'use strict';
// Drivers service used for communicating with the users REST endpoint
angular.module('users').factory('Drivers', ['$resource', 'CORE_CONST',
    function($resource, CORE_CONST){
        return $resource(CORE_CONST.REST_URL + 'drivers/:driverId', {
            driverId: '@_id'
        }, {
            update: {
                method: 'PUT'
            },
            create_driver: {
                url: CORE_CONST.REST_URL + 'drivers/create_driver',
                method: 'POST'
            },
            create_driver_car: {
                url: CORE_CONST.REST_URL + 'drivers/:driverId/create_driver_car',
                method: 'POST'
            }
        });
    }
]);
