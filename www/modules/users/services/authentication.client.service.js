'use strict';
// Authentication service for user variables
angular.module('users').factory('Authentication', ['$http', '$q',
    function($http, $q){
        function _get_user(){
            var defer = $q.defer();
            if(window.user){
                defer.resolve(window.user);
            } else {
                $http.get('http://localhost:3000/users/me')
                    .success(function(response){
                        window.user = response;
                        defer.resolve(response);
                    })
                    .error(function(errorResponse){
                        defer.reject(errorResponse);
                    });
            }
            return defer.promise;
        }
        return {
            get_user: _get_user,
            user: window.user,
            set_user: function(user){
                this.user = user;
                window.user = user;
            }
        };
    }
]);