// by bwin on 7/15/15.
'use strict';
angular.module('core').factory('GeoLocation', ['$q', function($q){
    function current(){
        var defer = $q.defer();
        if(navigator && navigator.geolocation){
            navigator.geolocation.getCurrentPosition(function(successResponse){
                defer.resolve(successResponse);
            }, function(errorResponse){
                defer.reject('GeoLocation: ' + errorResponse.message);
            });
        } else {
            defer.reject('Device doesn\'t support geo-location');
        }
        return defer.promise;
    }

    function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2){
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2 - lat1);  // deg2rad below
        var dLon = deg2rad(lon2 - lon1);
        var a =
                Math.sin(dLat/2)*Math.sin(dLat/2) +
                Math.cos(deg2rad(lat1))*Math.cos(deg2rad(lat2))*
                Math.sin(dLon/2)*Math.sin(dLon/2);
        var c = 2*Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R*c; // Distance in km
        return d;
    }

    function deg2rad(deg){
        return deg*(Math.PI/180);
    }

    return {
        current: current,
        distance: getDistanceFromLatLonInKm
    };
}]);