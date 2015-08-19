// by bwin on 7/24/15.

// by bwin on 6/25/15.
'use strict';
angular.module('users').controller('CreateTripController', ['$scope', '$location', 'Trips', 'Authentication', '$stateParams', 'GeoLocation', 'CORE_CONST', 'TripStatuses', '$ionicModal', '$rootScope',
    function($scope, $location, Trips, Authentication, $stateParams, GeoLocation, CORE_CONST, TripStatuses, $ionicModal, $rootScope){
        $scope.TRIP_STATUS = TripStatuses.query();
        $scope.authentication = Authentication;
        $scope.preparation = {};
        $scope.defaults = {
            tileLayer: 'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png',
            attributionControl: false,
            scrollWheelZoom: false,
            location_success: false
        };
        $scope.markers = {
            marker: {
                lat: 0,
                lng: 0,
                message: 'I\'m here',
                focus: true,
                draggable: true
            },
            center: {
                lat: CORE_CONST.MAP_LAT,
                lng: CORE_CONST.MAP_LNG,
                zoom: 15
            }
        };
        GeoLocation.current()
            .then(function(successResponse){
                $scope.markers.marker = {
                    lat: successResponse.coords.latitude,
                    lng: successResponse.coords.longitude,
                    message: 'I\'m here',
                    focus: true,
                    draggable: true
                };
                $scope.markers.center.lat = successResponse.coords.latitude;
                $scope.markers.center.lng = successResponse.coords.longitude;
                $scope.defaults.location_success = true;
            }, function(errorResponse){
                console.log(errorResponse);
                $scope.error = 'Не удалось получить ваше местоположение';
                //todo: we need pattern for load indicators
                //maybe angular-loading module is enough
                $scope.defaults.location_success = true;
            });
        $scope.$on('leafletDirectiveMarker.dragend', function (e, args) {
            $scope.markers.marker.lng = args.model.lng;
            $scope.markers.marker.lat = args.model.lat;
        });

        $scope.prepare = function(){
            if($scope.markers && $scope.markers.marker && $scope.markers.marker.lat && $scope.markers.marker.lng)
                angular.extend($scope.preparation, {
                    meet_location: {
                        lat: $scope.markers.marker.lat,
                        lng: $scope.markers.marker.lng
                    },
                    loc: [$scope.markers.marker.lng, $scope.markers.marker.lat]
                });
            Trips.prepare_trip({
                tripId: $stateParams.tripId
            }, $scope.preparation, function(successResponse){
                $location.path('trips/' + successResponse._id);
            }, function(errorResponse){
                $scope.error = errorResponse.data.message;
            });
        };
        $scope.init_modal = function(){
            $ionicModal.fromTemplateUrl('modules/trips/views/create-trip-misc.client.view.html', {
                scope: $scope,
                animation: 'slide-in-up',
                custom: $scope.preparation
            }).then(function(modal) {
                $scope.misc_modal = modal;
                $scope.misc_modal.show();
                $scope.misc = modal.custom;
                $scope.close_misc_modal = function(){
                    $rootScope.$broadcast('event:create-misc', $scope.misc);
                    $scope.misc_modal.hide();
                };
            });
        };
        $scope.$on('event:create-misc', function(){
            console.log($scope.misc);
            //if(Object.keys($scope.misc).length){
            //    angular.extend($scope.preparation, $scope.misc);
            //}
        });
    }
]);