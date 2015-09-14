/*
 * mobile Copyright (c) 2015, Medet Tleukabiluly
 * Available via the MIT license. http://vko-online.mit-license.org/
 * Created at 9/10/15
 *         _                           _ _            
 *  __   _| | _____         ___  _ __ | (_)_ __   ___ 
 *  \ \ / / |/ / _ \ _____ / _ \| '_ \| | | '_ \ / _ \
 *   \ V /|   < (_) |_____| (_) | | | | | | | | |  __/
 *    \_/ |_|\_\___/       \___/|_| |_|_|_|_| |_|\___|
 *                                                  
 */
'use strict';
angular.module('core').directive('map', ['CORE_CONST', '$compile', 'GeoLocation', 'Socket', '$rootScope', function(CORE_CONST, $compile, GeoLocation, Socket, $rootScope){
    return {
        restrict: 'E',
        transclude: true,
        priority: 1,
        //template: '<div id="map" data-tap-disabled="true"></div><div ng-transclude></div>',
        scope: {
            model: '=?',
            center: '=?',
            fullscreenControl: '=?',
            locateControl: '=?',
            edgeMarker: '=?',
            markersFunction: '=?',
            models: '=?',
            listenEvents: '=?',
            singleMarkerModel: '=?',
            singleMarkerModelFixed: '=?',
            height: '@'
        },
        compile: function(tElem, tAttr, tTransclude){
            return function link(scope, elem, attr, ctrl){
                var defaults = {
                    height: scope.height || 300,
                    attributionControl: false,
                    scrollWheelZoom: false,
                    maxZoom: 18,
                    layer: 'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png',
                    zoom: 13,
                    internal: {
                        markers: [],
                        addEvent: 'add_trip',
                        removeEvent: 'remove_trip',
                        model: false,
                        modelOptions: {
                            draggable: true,
                            message: 'I\'m here',
                            focus: true
                        },
                        dom_html: ''
                    }
                };
                //fix elem height
                elem.height(defaults.height);
//--------------------------------------------------------------------
//map
//--------------------------------------------------------------------
                elem.html('<div id="map" data-tap-disabled="true"></div><div ng-transclude></div>');
                var map = L.map('map', {
                    attributionControl: defaults.attributionControl
                }).setView([CORE_CONST.MAP_LAT, CORE_CONST.MAP_LNG], defaults.zoom);
                L.tileLayer(defaults.layer, {
                    scrollWheelZoom: defaults.scrollWheelZoom,
                    maxZoom: defaults.maxZoom
                }).addTo(map);
                //center map
                if(scope.center){
                    map.panTo(scope.center.lat, scope.center.lng);
                }
                //enable fullscreen control
                if(scope.fullscreenControl){
                    L.control.fullscreen().addTo(map);
                }
                //enable location control
                if(scope.locateControl){
                    L.control.locate({
                        icon: 'ion ion-ios-location-outline',
                        iconLoading: 'ion ion-load-d spin',
                        displayWithZoomControl: true
                    }).addTo(map);
                }
//--------------------------------------------------------------------
//Marker binders
//--------------------------------------------------------------------
                function click_handler(event){
                    scope.active_marker = event.target;
                    scope.active_object = event.target.options.object;
                    if(defaults.internal.dom_html){
                        $compile(defaults.internal.dom_html)(scope)
                    } else {
                        var dom = document.createElement('point-preview');
                        dom.setAttribute('ng-show', 'active_object');
                        dom.setAttribute('current-trip', 'active_object');
                        defaults.internal.dom_html = $compile(dom)(scope);
                        elem.append(defaults.internal.dom_html);
                    }
                    defaults.internal.markers.forEach(function(i_marker){
                        if(i_marker.options.object._id === event.target.options.object._id)
                            angular.element(i_marker._icon).addClass('active visited');
                        else {
                            angular.element(i_marker._icon).removeClass('active');
                        }
                    });
                }

                //marker binders
                function unbind_marker(obj){
                    //todo: we should use l.Marker api here
                    defaults.internal.markers = defaults.internal.markers.filter(function(marker){
                        return marker.options.object._id != obj._id;
                    });
                }

                function bind_marker(latLng, obj, map){
                    if(latLng && latLng.lat && latLng.lng){
                        var redIcon = L.divIcon({html: '<span>' + obj.price + '</span>', className: 'red-div-icon'});
                        var marker = L.marker(latLng, {icon: redIcon, object: obj}).on('click', function(e){
                            map.panTo(latLng);
                            return click_handler(e);
                        });
                        marker.addTo(map);
                        defaults.internal.markers.push(marker);
                    }
                }

                //use markerFn, instead of scope.models
                if(scope.markersFunction){
                    scope.markersFunction().then(function(successResponse){
                        angular.forEach(successResponse, function(obj){
                        });
                    }, function(errorResponse){
                    });
                }
                if(scope.models){
                    angular.forEach(scope.models, function(obj){
                        bind_marker(obj.meet_location, obj, map);
                    });
                }
                //todo: should we use `obj.loc[0]` or `obj.loc.lat` or `obj.lat` here?
                if(scope.singleMarkerModel){
                    if(scope.singleMarkerModelFixed){
                        if(defaults.internal.model){
                            defaults.internal.model.setLatLng(scope.model);
                            map.panTo(scope.model);
                        } else {
                            if(scope.model && scope.model.lat && scope.model.lng){
                                defaults.internal.model = L.marker(scope.model);
                                defaults.internal.model.bindPopup('Meet location').openPopup().addTo(map);
                                map.panTo(scope.model);
                            }
                        }
                    } else {
                        map.on('click', function(event){
                            if(!scope.model)
                                scope.model = {};
                            scope.model.lat = event.latlng.lat;
                            scope.model.lng = event.latlng.lng;
                            if(defaults.internal.model){
                                defaults.internal.model.setLatLng(scope.model);
                            } else {
                                defaults.internal.model = L.marker(scope.model, defaults.internal.modelOptions);
                                defaults.internal.model.bindPopup('I\'m here').openPopup().addTo(map);
                            }
                        });
                    }
                }
//--------------------------------------------------------------------
//Socket event listeners
//--------------------------------------------------------------------
                //socket event handlers
                function addEventFn(trip){
                }

                function removeEventFn(trip){
                }

                //use event handlers
                if(scope.listenEvents){
                    Socket.on(defaults.internal.addEvent, addEventFn);
                    Socket.on(defaults.internal.removeEvent, removeEventFn);
                }
//--------------------------------------------------------------------
//Enable edge markers
//--------------------------------------------------------------------
                if(scope.edgeMarker){
                    L.edgeMarker({
                        icon: L.icon({ // style markers
                            iconUrl: 'lib/Leaflet.EdgeMarker/images/edge-arrow-marker.png',
                            clickable: true,
                            iconSize: [48, 48],
                            iconAnchor: [24, 24]
                        }),
                        distanceOpacity: true,
                        distanceOpacityFactor: 10
                    }).addTo(map);
                }
//--------------------------------------------------------------------
//clean up
//--------------------------------------------------------------------
                $rootScope.$on('$stateChangeStart', function(){
                    console.log('$stateChangeStart');
                    elem.html('<div id="map" data-tap-disabled="true"></div><div ng-transclude></div>');
                    elem.remove();
                });
                //scope.$on('$destroy', function(){
                //    console.log('$destroy');
                //    if(map)
                //        map.remove();
                //    elem.remove();
                //});
            }
        }
    }
}]);