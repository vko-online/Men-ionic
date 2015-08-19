'use strict';
// Trips controller
angular.module('trips').controller('TripsController', ['$scope', '$stateParams', '$location', '$interval', 'Authentication', 'Trips', 'CarColors', 'CarBrands', 'CarModels', 'Socket', 'TripStatuses', 'DriverRequests', 'Misc', 'CORE_CONST', 'GeoLocation', '$ionicPopover', '$timeout', 'leafletData',
    function($scope, $stateParams, $location, $interval, Authentication, Trips, CarColors, CarBrands, CarModels, Socket, TripStatuses, DriverRequests, Misc, CORE_CONST, GeoLocation, $ionicPopover, $timeout, leafletData){
        //todo: GET RID OF FUNCTION CALLS, AND REFACTOR, USE GROUPED ACTIONS
        //it increases scope digest cycle count
        //use single object instances, as they are already in digest
        function errorHandler(errorResponse){
            $scope.error = errorResponse.data.message;
        }
        $scope.center = {
            lat: CORE_CONST.MAP_LAT,
            lng: CORE_CONST.MAP_LNG,
            zoom: CORE_CONST.MAP_ZOOM
        };

        $scope.markers = {
            center: {
                lat: CORE_CONST.MAP_LAT,
                lng: CORE_CONST.MAP_LNG,
                zoom: CORE_CONST.MAP_ZOOM
            },
            meet_location: {
                lat: 0,
                lng: 0,
                message: 'Meet location',
                focus: true,
                draggable: false
            },
            external_marker: {
                lat: 0,
                lng: 0,
                message: 'Driver',
                focus: true,
                draggable: false
            },
            driver_marker: {
                lat: 0,
                lng: 0,
                message: 'Driver',
                focus: true,
                draggable: false
            }
        };
        $ionicPopover.fromTemplateUrl('modules/trips/views/templates/trip-request-popover.client.view.html', {
            scope: $scope
        }).then(function(popover){
            $scope.popover = popover;
        });
        $scope.CORE_CONST = CORE_CONST;
        if(!$scope.server_date_time){
            Misc.server_time(function(time){
                $scope.server_date_time = new Date(time.date_time);
                $interval(function(){
                    $scope.server_date_time.setSeconds($scope.server_date_time.getSeconds() + 1);
                }, 1000);
            });
        }
        $scope.set_request_minute = function(minute){
            $scope.defaults.time = minute;
            $scope.request_pickup();
            $scope.popover.hide();
        };
        $scope.authentication = Authentication;
        $scope.TRIP_STATUS = TripStatuses.query();
        $scope.car_brands = CarBrands.query();
        $scope.car_models = CarModels.query();
        $scope.car_colors = CarColors.query();
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
            },
            timer_class: function(time){
                switch(time){
                    case(5):
                        return 'five';
                    case(10):
                        return 'ten';
                    case(15):
                        return 'fifteen';
                    case(20):
                        return 'twenty';
                    case(25):
                        return 'twenty_five';
                    case(30):
                        return 'thirty';
                    case(45):
                        return 'forty_five';
                    case(60):
                        return 'sixty';
                    default:
                        return 'ten';
                }
            }
        };
        $scope.findOne = function(callback){
            $scope.trip = Trips.get({
                tripId: $stateParams.tripId
            }, function(successResponse){
                if(successResponse.meet_location && successResponse.meet_location.lat && successResponse.meet_location.lng){
                    $scope.markers.meet_location.lat = successResponse.loc[1];
                    $scope.markers.meet_location.lng = successResponse.loc[0];
                    $scope.markers.center.lat = successResponse.loc[1];
                    $scope.markers.center.lng = successResponse.loc[0];
                }
                if(callback){
                    callback();
                }
            }, errorHandler);
        };
        $scope.findRequest = function(){
            //$scope.trip = Trips.get({
            //    tripId: $stateParams.tripId
            //}, function(successResponse){
            //    if(successResponse.meet_location && successResponse.meet_location.lat && successResponse.meet_location.lng){
            //        $scope.markers = {
            //            marker: {
            //                lat: successResponse.meet_location.lat,
            //                lng: successResponse.meet_location.lng,
            //                message: 'Meet location',
            //                focus: true,
            //                draggable: false
            //            }
            //        };
            //        $scope.center = {
            //            lat: successResponse.meet_location.lat,
            //            lng: successResponse.meet_location.lng,
            //            zoom: CORE_CONST.MAP_ZOOM
            //        };
            //    }
            //    $scope.request = DriverRequests.get({
            //        driverRequestId: $stateParams.driverRequestId
            //    }, function(successResponse){
            //        console.log(successResponse);
            //    }, errorHandler);
            //}, errorHandler);
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
                    $scope.markers.driver_marker.lat = response.coords.latitude;
                    $scope.markers.driver_marker.lng = response.coords.longitude;
                    var lat2 = response.coords.latitude,
                        lon2 = response.coords.longitude;
                    $scope.getDistanceFromLatLonInKm = function(lat1, lon1){
                        return GeoLocation.distance(lat1, lon1, lat2, lon2).toFixed(3) + 'км';
                    };
                });
            });
        };

        $scope.defaults = {
            time: 1,
            tileLayer: 'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png',
            attributionControl: false
        };
        $scope.sync_driver_location = function(){
            if($scope.trip && $scope.trip.$resolved){
                console.log('watch');
                GeoLocation.watch(function(obj){
                    $scope.trip.$driver_location({lat: obj.coords.latitude, lng: obj.coords.longitude});
                }, function(e){
                    console.log(e);
                });
            } else{
                console.log('no trip');
            }
        };
        //function sync_driver_location(){
        //    return GeoLocation.watch(function(obj){
        //        console.log(obj);
        //        $scope.trip.$driver_location({lat: 1, lng: 2});
        //    }, function(e){
        //        console.log(e);
        //    });
        //}
        ////todo: what is this
        //$scope.register_timeout = function(time){
        //    var location_watch_id = sync_driver_location();
        //    $timeout(function(){
        //        GeoLocation.clear_watch(location_watch_id);
        //    }, (time*60*1000));
        //};
        $scope.active = 'list-view';
        $scope.setActive = function(type){
            $scope.active = type;
        };
        $scope.isActive = function(type){
            return type === $scope.active;
        };
        $scope.is_current_driver_request = function(trip){
            if(trip){
                $scope.driver_request = trip.requests.filter(function(i){
                    return i.driver_profile === $scope.authentication.user._id;
                })[0];
                return $scope.driver_request;
            } else {
                if($scope.trip && $scope.trip.requests){
                    $scope.driver_request = $scope.trip.requests.filter(function(i){
                        return i.driver_profile === $scope.authentication.user._id;
                    })[0];
                    return $scope.driver_request;
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
        $scope.get_my_request = function(requests){
            //single obj as requests cannot have dups
            if(!requests || !requests.length){
                return false;
            } else {
                $scope.driver_request = requests.filter(function(i){
                    return i.driver_profile._id === $scope.authentication.user._id;
                })[0];
                return $scope.driver_request;
            }
        };
        $scope.countdown_handler = function(request_end_date, callback_key){
            if(request_end_date){
                var date = new Date(request_end_date);
                if($scope.server_date_time){
                    var time = (window.moment(date).unix() - window.moment($scope.server_date_time).unix());
                    //todo:this is stupid hack, related to countdown timer, get rid off asap
                    if(time < 0){
                        if(callback_key && callback_key === 'list')
                            $scope.cb_list();
                        else
                            $scope.cb_get();
                    }
                    return time;
                }
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
            console.log(id);
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
            //todo: this should only return current trip requests, don't reload trip
            $scope.findOne();
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
            alert('client canceled trip');
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
        $scope.external_markers = {
            driver_location: {
                lat: 0,
                lng: 0,
                message: 'Driver location',
                focus: true,
                draggable: false
            }
        };
        var marker;
        Socket.on('driver:location', function(data){
            leafletData.getMap().then(function(map){
                var lat = parseFloat(data.lat),
                    lng = parseFloat(data.lng);
                if(marker){
                    marker.setLatLng({lat: lat, lng: lng});
                    marker.update();
                } else {
                    marker = L.marker({lat: lat, lng: lng});
                    marker.addTo(map);
                }
                map.panTo({lat: lat, lng: lng});
                $scope.external_markers.driver_location.lat = lat;
                $scope.external_markers.driver_location.lng = lng;
                //$scope.markers.external_marker.lat = lat;
                //$scope.markers.external_marker.lng = lng;
                console.log('panned map', lat, lng);
            });
        });
        if($scope.authentication && $scope.authentication.user && $scope.authentication.user.is_driver){
            Socket.on('new_trip', function(obj){
                $scope.trips.push(obj);
            });
        }
        console.log($scope.markers);
    }
]);