// by bwin on 7/31/15.
'use strict';

angular.module('trips').factory('template_resolve', ['$http', '$q', function($http, $q){
    return function(role, status){
        if(!role || !status)
            throw new Error('Need role AND status param');
        var append = 'modules/trips/views/status/';
        var prepend = '.client.view.html';
        var src = append + role + '-' + status + prepend;
        return $http.get(src);
    }
}]);