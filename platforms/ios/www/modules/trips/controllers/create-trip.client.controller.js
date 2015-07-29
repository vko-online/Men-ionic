// by bwin on 7/24/15.

// by bwin on 6/25/15.
'use strict';
angular.module('users').controller('CreateTripController', ['$scope', '$location', 'Trips', 'Authentication', '$stateParams', 'GeoLocation', 'CORE_CONST',
    function($scope, $location, Trips, Authentication, $stateParams, GeoLocation, CORE_CONST){
        $scope.authentication = Authentication;
        $scope.preparation = {};
        GeoLocation.current()
            .then(function(successResponse){
                $scope.center = {
                    lat: successResponse.coords.latitude,
                    lng: successResponse.coords.longitude,
                    zoom: 15
                };
                $scope.markers = {
                    marker: {
                        lat: successResponse.coords.latitude,
                        lng: successResponse.coords.longitude,
                        message: 'I\'m here',
                        focus: true,
                        draggable: true
                    }
                };
                window.c = $scope.markers;
            }, function(errorResponse){
                $scope.error = errorResponse;
            });
        $scope.$on('leafletDirectiveMarker.dragend', function (e, args) {
            $scope.markers.marker.lng = args.model.lng;
            $scope.markers.marker.lat = args.model.lat;
        });
        $scope.center = {
            lat: CORE_CONST.MAP_LAT,
            lng: CORE_CONST.MAP_LNG,
            zoom: CORE_CONST.MAP_ZOOM
        };
        $scope.defautls = {
            scrollWheelZoom: false
        };
        $scope.prepare = function(){
            if($scope.markers && $scope.markers.marker && $scope.markers.marker.lat && $scope.markers.marker.lng)
                angular.extend($scope.preparation, {
                    meet_location: {
                        lat: $scope.markers.marker.lat,
                        lng: $scope.markers.marker.lng
                    }
                });
            Trips.prepare_trip({
                tripId: $stateParams.tripId
            }, $scope.preparation, function(successResponse){
                $location.path('trips/' + successResponse._id);
            }, function(errorResponse){
                $scope.error = errorResponse.data.message;
            });
        };
        $scope.findTrip = function(){
            if($stateParams.tripId){
                $scope.trip = Trips.get({
                    tripId: $stateParams.tripId
                });
            } else {
                var trip = new Trips($scope.preparation);
                trip.$save(function(response){
                    $location.path('trips/' + response._id);
                }, function(errorResponse){
                    $scope.error = errorResponse.data.message;
                });
            }
        };
        $scope.begin_trip = function(){
            $scope.trip.$begin_trip();
        };
        $scope.end_trip = function(){
            $scope.trip.$end_trip();
        };
        $scope.cancel_trip = function(){
            $scope.trip.$remove();
        };
    }
]);