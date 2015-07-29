// by bwin on 7/8/15.
'use strict';
angular.module('core').factory('Misc', ['$http', 'CORE_CONST',
    function($http, CORE_CONST){
        return {
            server_time: function(callback){
                $http({
                    method: 'GET',
                    url: CORE_CONST.REST_URL + 'server_time'
                }).success(function(successResponse){
                    callback(successResponse);
                });
            }
        };
    }
]);
