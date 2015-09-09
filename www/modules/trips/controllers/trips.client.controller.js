'use strict';
// Trips controller
angular.module('trips').controller('TripsController', ['$scope', '$stateParams', '$location', '$interval', 'Authentication', 'Trips', 'CarColors', 'CarBrands', 'CarModels', 'Socket', 'TripStatuses', 'DriverRequests', 'Misc', 'CORE_CONST', 'GeoLocation', '$ionicPopover', '$timeout', 'leafletData',
    function($scope, $stateParams, $location, $interval, Authentication, Trips, CarColors, CarBrands, CarModels, Socket, TripStatuses, DriverRequests, Misc, CORE_CONST, GeoLocation, $ionicPopover, $timeout, leafletData){
        //todo: GET RID OF FUNCTION CALLS, AND REFACTOR, USE GROUPED ACTIONS
        //it increases scope digest cycle count
        //use single object instances, as they are already in digest
        function errorHandler(errorResponse){
            if(errorResponse.status === 500)
                $scope.error = errorResponse.statusText;
            else
                $scope.error = errorResponse.data.message;
        }

        $scope.CORE_CONST = CORE_CONST;
        $scope.authentication = Authentication;
        $scope.TRIP_STATUS = TripStatuses.query();
        $scope.car_brands = CarBrands.query();
        $scope.car_models = CarModels.query();
        $scope.car_colors = CarColors.query();
        $scope.active = 'list-view';
        $scope.setActive = function(type){
            $scope.active = type;
        };
        $scope.isActive = function(type){
            return type === $scope.active;
        };
        $scope.get_driver_request = function(trip){
            if(trip){
                return trip.requests.filter(function(o){
                    return o.driver_profile === $scope.authentication.user._id;
                })[0];
            } else {
                if($scope.trip && $scope.trip.requests){
                    return $scope.trip.requests.filter(function(o){
                        return o.driver_profile === $scope.authentication.user._id;
                    })[0];
                }
            }
        };
        $scope.defaults = {
            time: 1,
            tileLayer: 'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png',
            attributionControl: false,
            center: {
                lat: CORE_CONST.MAP_LAT,
                lng: CORE_CONST.MAP_LNG,
                zoom: CORE_CONST.MAP_ZOOM
            }
        };
        $ionicPopover.fromTemplateUrl('modules/trips/views/templates/trip-request-popover.client.view.html', {
            scope: $scope
        }).then(function(popover){
            $scope.popover = popover;
        });
        if(!$scope.server_time){
            Misc.server_time(function(time){
                $scope.server_time = new Date(time.date_time);
                $interval(function(){
                    $scope.server_time.setSeconds($scope.server_time.getSeconds() + 1);
                }, 1000);
            });
        }
        $scope.set_request_minute = function(minute){
            $scope.defaults.time = minute;
            $scope.request_pickup();
            $scope.popover.hide();
        };
        var interval;
        $scope.get = {
            brand: function(id){
                return $scope.car_brands.filter(function(i){
                    return i._id === id;
                })[0];
            },
            color: function(id){
                return $scope.car_colors.filter(function(i){
                    return i._id === id;
                })[0];
            },
            model: function(id){
                return $scope.car_models.filter(function(i){
                    return i._id === id;
                })[0];
            }
        };
        $scope.findOne = function(callback){
            $scope.trip = Trips.get({
                tripId: $stateParams.tripId
            }, function(successResponse){
                if(successResponse.meet_location && successResponse.meet_location.lat && successResponse.meet_location.lng){
                    if(successResponse.loc && successResponse.loc.length){
                        $scope.trip_markers = {
                            marker: {
                                lat: successResponse.loc[1],
                                lng: successResponse.loc[0],
                                focus: true,
                                draggable: false,
                                message: 'Meet location'
                            }
                        };
                        $scope.defaults.center.lat = successResponse.loc[1];
                        $scope.defaults.center.lng = successResponse.loc[0];
                    }
                }
                if(callback){
                    callback();
                }
            }, errorHandler);
        };
        $scope.findRequest = function(){
            $scope.request = DriverRequests.get({
                driverRequestId: $stateParams.driverRequestId
            }, function(successResponse){
                console.log(successResponse);
            }, errorHandler);
        };
        $scope.find = function(){
            $scope.trips = Trips.query(function(successResponse){
                $scope.$broadcast('scroll.refreshComplete');
                GeoLocation.current().then(function(response){
                    $scope.driver_marker = {
                        marker: {
                            lat: response.coords.latitude,
                            lng: response.coords.longitude
                        }
                    };
                    var lat2 = response.coords.latitude,
                        lon2 = response.coords.longitude;
                    $scope.getDistanceFromLatLonInKm = function(lat1, lon1){
                        return GeoLocation.distance(lat1, lon1, lat2, lon2).toFixed(3) + 'км';
                    };
                });
            });
        };
        $scope.minutes_ago = function(time){
            if($scope.server_time){
                var r = Math.floor((+$scope.server_time - (+new Date(time)))/60000);
                return r + ' min' + ((r === 1) ? '' : 's') + ' ago';
            }
        };
        $scope.is_current_driver_request = function(trip){
            if(trip){
                return trip.requests.filter(function(i){
                    return i.driver_profile === $scope.authentication.user._id;
                })[0];
            } else {
                if($scope.trip && $scope.trip.requests){
                    return $scope.trip.requests.filter(function(i){
                        return i.driver_profile === $scope.authentication.user._id;
                    })[0];
                }
            }
        };
        $scope.is_requested = function(requests){
            if(!requests || !requests.length){
                return false;
            } else {
                console.log('requested');
                var exist = requests.filter(function(i){
                    return i.driver_profile._id === $scope.authentication.user._id;
                });
                return exist.length > 0;
            }
        };
        //(window.moment(request_end_date).unix() - window.moment($scope.server_time).unix());
        $scope.cancel_trip = function(){
            //todo: prompt
            $scope.trip.$cancel_trip(function(successResponse){
                alert('trip canceled, you may have penalties');
                $scope.authentication.user.trip = null;
            }, errorHandler);
        };
        $scope.delete_trip = function(){
            $scope.trip.$remove(function(successResponse){
                $location.path('/');
                $scope.authentication.user.trip = null;
                Authentication.set_user($scope.authentication.user);
            }, angular.noop, errorHandler);
        };
        $scope.cancel_request_pickup = function(trip){
            $scope.error = undefined;
            if(trip)
                trip.$cancel_request_pickup(angular.noop, errorHandler);
            else
                $scope.trip.$cancel_request_pickup(angular.noop, errorHandler);
        };
        $scope.driver_alert = function(){
            alert('time is up');
        };
        $scope.arrived_trip = function(){
            $scope.trip.$arrived_trip(angular.noop, errorHandler);
        };
        $scope.met_trip = function(){
            $scope.trip.$met_trip(angular.noop, errorHandler);
        };
        $scope.end_trip = function(){
            $scope.trip.$end_trip(angular.noop, errorHandler);
        };
        $scope.request_pickup = function(_optional_trip){
            $scope.error = undefined;
            if(_optional_trip){
                $scope.defaults.time = 10;
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
        $scope.remove_pickup_request = function(id){
            $scope.trip.$remove_pickup_request({
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
        $scope.notify_client = function(){
            $scope.trip.$notify_client(function(){
                $scope.message = 'Уведомление отправлено';
            }, errorHandler);
        };
        Socket.on('accept_pickup', function(obj){
            if($scope.trip){
                $scope.trip.status_code = obj.status_code;
                $scope.trip.requests = obj.requests;
                $scope.trip.accepted_request = obj.accepted_request;
                $scope.trip.driver_profile = obj.driver_profile;
                $scope.trip.driver_car = obj.driver_car;
            }
        });
        Socket.on('request_pickup', function(obj){
            if($scope.trip){
                $scope.trip.requests = obj.requests;
            }
        });
        Socket.on('arrived_trip', function(obj){
            $scope.trip.status_code = obj.status_code;
        });
        Socket.on('met_trip', function(obj){
            if($scope.trip){
                $scope.trip.status_code = obj.status_code;
                $scope.trip.transaction = obj.transaction;
                $scope.authentication.user.trip = null;
            }
        });
        Socket.on('end_trip', function(obj){
            if($scope.trip){
                $scope.trip.status_code = obj.status_code;
            }
        });
        Socket.on('cancel_request_pickup', function(obj){
            if($scope.trip)
                $scope.trip.requests = obj.requests;
        });
        Socket.on('trip_canceled', function(obj){
            if($scope.trip)
                $scope.trip.status_code = obj.status_code;
        });
        Socket.on('pickup_request_canceled_by_id', function(id){
            console.log('pickup_request_canceled_by_id', id);
            if($scope.trip && $scope.trip.requests.length){
                $scope.trip.requests = $scope.trip.requests.filter(function(i){
                    return (i._id !== id);
                });
            }
        });
        if($scope.authentication.user.is_driver && $scope.trips){
            Socket.on('new_trip', function(obj){
                $scope.trips.push(obj);
            });
        }
    }
]);