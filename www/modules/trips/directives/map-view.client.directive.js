// by bwin on 8/7/15.
angular.module('trips').directive('mapView', ['$compile', 'GeoLocation', 'CORE_CONST', 'Trips', 'leafletData',
    function($compile, GeoLocation, CORE_CONST, Trips, leafletData){
        return {
            restrict: 'E',
            priority: 0,
            templateUrl: 'modules/trips/directives/templates/map-view.client.directive.html',
            controller: function($scope, GeoLocation, CORE_CONST, Trips, leafletData){
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
                function click_handler(event){
                    console.log('clicked');
                    $scope.current_trip = event.target.options.trip;
                    $scope.current_point = event.latlng;
                }

                function bind_marker(a, b, obj, map){
                    var redIcon = L.divIcon({html: '<span>' + obj.price + '</span>', className: 'red-div-icon'});
                    var marker = L.marker([a, b], {icon: redIcon, trip: obj}).on('click', click_handler);
                    marker.addTo(map);
                }

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
                                        if($scope.existing_markers.length){
                                            var diff = $scope.trips.filter(function(n){
                                                return $scope.existing_markers.filter(function(m){
                                                        return n._id != m._id;
                                                    }).length == 0;
                                            });
                                            angular.forEach(diff, function(i){
                                                //L.marker([i.loc[1], i.loc[0]]).addTo(map);
                                                bind_marker(i.loc[1], i.loc[0], i, map);
                                            });
                                        } else {
                                            $scope.existing_markers = successResponse;
                                            angular.forEach($scope.trips, function(i){
                                                bind_marker(i.loc[1], i.loc[0], i, map);
                                                //L.marker([i.loc[1], i.loc[0]]).addTo(map);
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