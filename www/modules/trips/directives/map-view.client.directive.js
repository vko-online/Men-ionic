// by bwin on 8/7/15.
angular.module('trips').directive('mapView', ['$compile', 'GeoLocation', 'CORE_CONST', 'Trips', 'leafletData', '$ionicLoading',
    function($compile, GeoLocation, CORE_CONST, Trips, leafletData, $ionicLoading){
        return {
            restrict: 'E',
            priority: 0,
            templateUrl: 'modules/trips/directives/templates/map-view.client.directive.html',
            controller: function($scope, GeoLocation, CORE_CONST, Trips, leafletData){
                $scope.show = function() {
                    $ionicLoading.show({
                        template: 'Loading...'
                    });
                };
                $scope.hide = function(){
                    $ionicLoading.hide();
                };
                $scope.show();
                //todo: colorize active, visited markers
                $scope.center = {
                    lat: CORE_CONST.MAP_LAT,
                    lng: CORE_CONST.MAP_LNG,
                    zoom: CORE_CONST.MAP_ZOOM
                };
                $scope.defaults = {
                    tileLayer: 'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png',
                    attributionControl: false
                };

                $scope.existing_markers = [];
                var internal_markers = [];
                function click_handler(event){
                    $scope.current_trip = event.target.options.trip;
                    $scope.existing_markers.forEach(function(e_trip, index){
                        if(e_trip._id === $scope.current_trip._id)
                            $scope.current_trip_index = index;
                    });
                    internal_markers.forEach(function(i_marker){
                        if(i_marker.options.trip._id === $scope.current_trip._id)
                            angular.element(i_marker._icon).addClass('active visited');
                        else {
                            angular.element(i_marker._icon).removeClass('active');
                        }
                    });
                }
                $scope.hide_callback = function(){
                    //$scope.show_preview = false;
                };
                $scope.indexer_callback = function (index){
                    $scope.current_trip = $scope.existing_markers[index];
                    $scope.current_trip_index = index;
                    internal_markers.forEach(function(i_marker){
                        if(i_marker.options.trip._id === $scope.current_trip._id)
                            angular.element(i_marker._icon).addClass('active visited');
                        else {
                            angular.element(i_marker._icon).removeClass('active');
                        }
                    });
                };

                function bind_marker(a, b, obj, map){
                    var redIcon = L.divIcon({html: '<span>' + obj.price + '</span>', className: 'red-div-icon'});
                    var marker = L.marker([a, b], {icon: redIcon, trip: obj}).on('click', click_handler);
                    marker.addTo(map);
                    internal_markers.push(marker);
                }

                GeoLocation.current()
                    .then(function(successResponse){
                        $scope.hide();
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
                                draggable: false
                            }
                        };
                        leafletData.getMap().then(function(map){
                            var timeout = undefined;
                            map.on('dragend zoomend', function(event){
                                if(event.distance > 30){
                                    var bounds = event.target.getBounds();
                                    $scope.trips = Trips.by_location({
                                        lat_ne: bounds._northEast.lat,
                                        lng_ne: bounds._northEast.lng,
                                        lat_sw: bounds._southWest.lat,
                                        lng_sw: bounds._southWest.lng
                                    }, function(successResponse){
                                        //todo: refactor this
                                        if ($scope.existing_markers.length) {
                                            var diff = $scope.trips.filter(function(trip) {
                                                return $scope.existing_markers.filter(function(existing_trip) {
                                                        return trip._id === existing_trip._id;
                                                    }).length === 0;
                                            });
                                            angular.forEach(diff, function(i) {
                                                bind_marker(i.loc[1], i.loc[0], i, map);
                                                $scope.existing_markers.push(i);
                                            });
                                        } else {
                                            $scope.existing_markers = successResponse;
                                            angular.forEach($scope.trips, function(i) {
                                                bind_marker(i.loc[1], i.loc[0], i, map);
                                            });
                                        }
                                    }, function(errorResponse){
                                    });
                                }
                            });
                        });
                    }, function(errorResponse){
                        $scope.error = errorResponse;
                    });
            },
            controllerAs: 'mapViewCtrl',
            bindToController: true,
            scope: {},
            link: function(scope, elem, attr){
            }
        }
    }]);