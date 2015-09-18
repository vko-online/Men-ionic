// by bwin on 7/24/15.

// by bwin on 6/25/15.
'use strict';
angular.module('users').controller('CreateTripController', ['$scope', '$location', 'Trips', 'Authentication', '$stateParams', 'GeoLocation', 'CORE_CONST', 'TripStatuses', '$ionicModal', '$rootScope', '$ionicHistory', '$ionicSlideBoxDelegate', '$q',
    function($scope, $location, Trips, Authentication, $stateParams, GeoLocation, CORE_CONST, TripStatuses, $ionicModal, $rootScope, $ionicHistory, $ionicSlideBoxDelegate, $q){
        $scope.TRIP_STATUS = TripStatuses.query();
        $scope.authentication = Authentication;
        if($scope.authentication && $scope.authentication.user && $scope.authentication.user.trip){
            $location.path('trips/' + ($scope.authentication.user.trip._id || $scope.authentication.user.trip));
        }
        $scope.current_index = 0;
        $scope.next = function(index){
            if(index === 1)
                $ionicSlideBoxDelegate.previous();
            else
                $ionicSlideBoxDelegate.next();
            $scope.current_index = $ionicSlideBoxDelegate.currentIndex();
        };
        $scope.car_type = 'any';
        $scope.setCarType = function(type){
            $scope.car_type = type;
        };
        $scope.street_handler = function(location){
            var defer = $q.defer();
            Trips.regions_by_location(location, function(successResponse){
                defer.resolve(successResponse);
            }, function(errorResponse){
                defer.reject(errorResponse);
            });
            return defer.promise;
        };
        $scope.preparation = {};
        $scope.prepare = function(){
            $scope.preparation.loc = [$scope.preparation.meet_location.lng, $scope.preparation.meet_location.lat];
            Trips.prepare_trip({
                tripId: $stateParams.tripId
            }, $scope.preparation, function(successResponse){
                $ionicHistory.clearHistory();
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
                    $scope.misc_modal.hide();
                };
            });
        };
    }
]);