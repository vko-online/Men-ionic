'use strict';
// Authentication service for user variables
angular.module('users').service('Authentication', ['$http', '$q', 'CORE_CONST',
    function($http, $q, CORE_CONST){
        this.user = false;
        this.get_user = function(){
            var that = this;
            var defer = $q.defer();
            if(that.user){
                defer.resolve(that.user);
            } else {
                $http.get(CORE_CONST.REST_URL + 'users/me')
                    .success(function(response){
                        //for dev
                        window.user = response;
                        that.user = response;
                        defer.resolve(response);
                    })
                    .error(function(errorResponse){
                        defer.reject(errorResponse);
                    });
            }
            return defer.promise;
        };
        this.set_user = function(user){
            this.user = user;
        };
        this.set_prop = function(propname, value){
            this.user[propname] = value;
        };
    }
]);