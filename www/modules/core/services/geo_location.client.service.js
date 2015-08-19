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
    var d = 0.001;
    function watch(success, error){
        //todo: not tested yet

        //dev testing head
        var debug = true;

        var options = {
            enableHighAccuracy: false,
            timeout: 5000,
            maximumAge: 60000
        };

        if(navigator && navigator.geolocation){
            return navigator.geolocation.watchPosition(function(successResponse){
                if(success){
                    success(successResponse);
                    //dev testing body
                    if(debug){


                        var timeout = setInterval(function(){
                            var copy = {
                                coords: {
                                    latitude: successResponse.coords.latitude + (d),
                                    longitude: successResponse.coords.longitude + (d)
                                }
                            };
                            d = d + 0.001;
                            console.log('executing fake location change', copy);
                            success(copy);
                        }, 2000); //every 5secs
                    }
                }
            }, function(errorResponse){
                if(error)
                    error(errorResponse.message);
            }, options);
        } else {
            if(error)
                error('Device doesn\'t support geo-location');
            return false;
        }
    }
    function clear_watch(number){
        if(navigator && navigator.geolocation){
            navigator.geolocation.clearWatch(number);
        }
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
        distance: getDistanceFromLatLonInKm,
        watch: watch,
        clear_watch: clear_watch
    };
}]);