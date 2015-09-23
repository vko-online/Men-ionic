'use strict';
// Authentication service for user variables
angular.module('users').service('Authentication', ['$http', '$q', 'CORE_CONST', 'Socket',
    function($http, $q, CORE_CONST, Socket){
        this.user = false;
        this.set_user = function(user){
            this.user = user;
            window.user = user;
            //set socket user
        };
        this.set_prop = function(propname, value){
            this.user[propname] = value;
        };
    }
]);