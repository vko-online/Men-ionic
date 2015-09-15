// by bwin on 7/8/15.

'use strict';

angular.module('core').factory('Misc', ['$http', 'CORE_CONST', '$timeout',
    function($http, CORE_CONST, $timeout){
        return {
            server_time: function(callback){
                $http({
                    method: 'GET',
                    url: CORE_CONST.REST_URL + 'server_time'
                }).success(function(successResponse){
                    callback(successResponse);
                });
            },
            throttle: function (fn, threshhold, scope){
                console.log('th');
                threshhold = threshhold || 250;
                var last, promise;
                return function throttle(){
                    var context = scope || this;
                    var now = Date.now(),
                        args = arguments;
                    if(last && now < last + threshhold){
                        // hold on to it
                        $timeout.cancel(promise);
                        promise = $timeout(function throttleTimeout(){
                            last = now;
                            fn.apply(context, args);
                        }, threshhold);
                    } else {
                        last = now;
                        fn.apply(context, args);
                    }
                }
            }
        }
    }
]);
