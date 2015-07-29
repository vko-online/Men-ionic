// by bwin on 7/24/15.

// by bwin on 6/25/15.
'use strict';
angular.module('users').controller('TripHistoryController', ['$scope', '$location', 'Trips', 'Authentication', '$stateParams', 'GeoLocation', 'CORE_CONST',
    function($scope, $location, Trips, Authentication, $stateParams, GeoLocation, CORE_CONST){
        $scope.authentication = Authentication;

        $scope.find = function(){
            $scope.trips = Trips.history();
        };
        $scope.findOne = function(){
            $scope.trip = Trips.get({
                tripId: $stateParams.tripId
            });
        };
        $scope.center = {
            lat: CORE_CONST.MAP_LAT,
            lng: CORE_CONST.MAP_LNG,
            zoom: CORE_CONST.MAP_ZOOM
        };
    }
]);