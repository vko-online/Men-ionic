'use strict';
// Trips controller
angular.module('trips').controller('TripsController', ['$scope', '$stateParams', '$location', '$interval', 'Authentication', 'Trips', 'CarColors', 'CarBrands', 'CarModels', 'Socket', 'TripStatuses', 'DriverRequests', 'Misc', 'CORE_CONST', 'GeoLocation',
    function($scope, $stateParams, $location, $interval, Authentication, Trips, CarColors, CarBrands, CarModels, Socket, TripStatuses, DriverRequests, Misc, CORE_CONST, GeoLocation){
        function errorHandler(errorResponse){
            $scope.error = errorResponse.data.message;
        }

        if(!$scope.server_date_time){
            Misc.server_time(function(time){
                $scope.server_date_time = new Date(time.date_time);
                $interval(function(){
                    $scope.server_date_time.setSeconds($scope.server_date_time.getSeconds() + 1);
                }, 1000);
            });
        }
        $scope.authentication = Authentication;
        $scope.TRIP_STATUS = TripStatuses.query();
        $scope.car_brands = CarBrands.query();
        $scope.car_models = CarModels.query();
        $scope.car_colors = CarColors.query();
        $scope.findOne = function(){
            $scope.trip = Trips.get({
                tripId: $stateParams.tripId
            }, function(successResponse){
                if(successResponse.meet_location && successResponse.meet_location.lat && successResponse.meet_location.lng){
                    $scope.markers = {
                        marker: {
                            lat: successResponse.meet_location.lat,
                            lng: successResponse.meet_location.lng,
                            message: 'Meet location',
                            focus: true,
                            draggable: false
                        }
                    };
                    $scope.center = {
                        lat: successResponse.meet_location.lat,
                        lng: successResponse.meet_location.lng,
                        zoom: CORE_CONST.MAP_ZOOM
                    };
                }
            }, errorHandler);
        };
        $scope.find = function(){
            $scope.trips = Trips.query(function(successResponse){
                GeoLocation.current().then(function(response){
                    var lat2 = response.coords.latitude,
                        lon2 = response.coords.longitude;
                    $scope.getDistanceFromLatLonInKm = function(lat1, lon1){
                        return GeoLocation.distance(lat1, lon1, lat2, lon2).toFixed(3) + 'км';
                    };
                });
            });
        };
        $scope.center = {
            lat: CORE_CONST.MAP_LAT,
            lng: CORE_CONST.MAP_LNG,
            zoom: CORE_CONST.MAP_ZOOM
        };
        $scope.defaults = {
            time: 1
        };
        $scope.active = 'map-view';

        $scope.setActive = function(type) {
            $scope.active = type;
        };

        $scope.isActive = function(type) {
            return type === $scope.active;
        };
        $scope.is_current_driver_request = function(requests){
            if(requests){
                var exists = requests.filter(function(i){
                    return i.driver_profile === $scope.authentication.user._id;
                });
                return ((exists.length > 0) ? exists[0] : null);
            }
            return null;
        };
        $scope.is_requested = function(requests){
            if(!requests || !requests.length){
                return false;
            } else {
                var exist = requests.filter(function(i){
                    return i.driver_profile._id === $scope.authentication.user._id;
                });
                return exist.length > 0;
            }
        };
        $scope.get_my_request = function(requests){
            //single obj as requests cannot have dups
            if(!requests || !requests.length){
                return false;
            } else {
                return requests.filter(function(i){
                    return i.driver_profile._id === $scope.authentication.user._id;
                })[0];
            }
        };
        $scope.countdown_handler = function(request_end_date){
            if(request_end_date){
                var date = new Date(request_end_date);
                if($scope.server_date_time)
                    return (window.moment(date).unix() - window.moment($scope.server_date_time).unix());
                return 0;
            }
            return 0;
        };
        // Find existing Trip
        $scope.prepare = function(){
            Trips.prepare_trip($scope.preparation, function(successResponse){
                $location.path('/trips/' + successResponse._id);
            }, angular.noop, errorHandler);
        };
        $scope.begin_trip = function(){
            $scope.trip.$begin_trip(angular.noop, errorHandler);
        };
        $scope.end_trip = function(){
            $scope.trip.$end_trip(angular.noop, errorHandler);
        };
        $scope.cancel_trip = function(){
            //todo: prompt
            $scope.trip.$cancel_trip(function(successResponse){
                alert('trip canceled, you may have penalties');
            }, errorHandler);
        };
        $scope.delete_trip = function(){
            $scope.trip.$remove(function(successResponse){
                $location.path('/');
                $scope.authentication.user.trip = null;
                Authentication.set_user($scope.authentication.user);
            }, angular.noop, errorHandler);
        };
        $scope.cancel_request_pickup = function(){
            $scope.trip.$cancel_request_pickup(angular.noop, errorHandler);
        };
        $scope.arrived_trip = function(){
            $scope.trip.$arrived_trip(angular.noop, errorHandler);
        };
        $scope.met_trip = function(){
            $scope.trip.$met_trip(angular.noop, errorHandler);
        };
        $scope.request_pickup = function(_optional_trip){
            if(_optional_trip){
                _optional_trip.$request_pickup({
                    time: $scope.defaults.time
                }, angular.noop, errorHandler);
            } else {
                $scope.trip.$request_pickup({
                    time: $scope.defaults.time
                }, angular.noop, errorHandler);
            }
        };
        $scope.accept_pickup = function(id){
            $scope.trip.$accept_pickup({
                driverRequestId: id
            }, angular.noop, errorHandler);
        };
        $scope.get_statistics = function(){
            DriverRequests.query({
                tripId: $stateParams.tripId
            }, function(successResponse){
                $scope.statistic = successResponse;
            }, errorHandler);
        };
        //todo: try to remove trip's driver_request if countdown passes
        $scope.cb_list = function(){
            $scope.find();
        };
        $scope.cb_get = function(){
            $scope.findOne();
        };
        Socket.on('accept_pickup', function(obj){
            $scope.trip.status_code = obj.status_code;
            $scope.trip.requests = obj.requests;
            $scope.trip.driver_profile = obj.driver_profile;
            $scope.trip.driver_car = obj.driver_car;
        });
        Socket.on('request_pickup', function(obj){
            $scope.trip.requests = obj.requests;
        });
        Socket.on('arrived_trip', function(obj){
            $scope.trip.status_code = obj.status_code;
        });
        Socket.on('met_trip', function(obj){
            $scope.trip.status_code = obj.status_code;
        });
        Socket.on('end_trip', function(obj){
            $scope.trip.status_code = obj.status_code;
        });
        Socket.on('cancel_request_pickup', function(obj){
            $scope.trip.requests = obj.requests;
        });
        Socket.on('pickup_request_canceled_by_id', function(id){
            console.log('pickup_request_canceled_by_id', id);
            if($scope.trip && $scope.trip.requests.length){
                $scope.trip.requests = $scope.trip.requests.filter(function(i){
                    console.log(i, id);
                    return (i._id !== id);
                });
            }
        });
        if($scope.authentication && $scope.authentication.user && $scope.authentication.user.is_driver){
            Socket.on('new_trip', function(obj){
                $scope.trips.push(obj);
            });
        }
    }
]);