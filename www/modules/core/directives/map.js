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
angular.module('core').directive('map', ['CORE_CONST', '$compile', 'GeoLocation', 'Socket', '$rootScope', '$timeout', function(CORE_CONST, $compile, GeoLocation, Socket, $rootScope, $timeout){
    return {
        restrict: 'E',
        //transclude: true,
        //template: '<div id="map" data-tap-disabled="true"></div><div ng-transclude></div>',
        scope: {
            model: '=?',
            center: '=?',
            fullscreenControl: '=?',
            zoomControl: '=?',
            locateControl: '=?',
            edgeMarker: '=?',
            markersFunction: '=?',
            models: '=?',
            listenEvents: '=?',
            singleMarkerModel: '=?',
            singleMarkerModelFixed: '=?',
            height: '@',
            streetApi: '=?',
            streetModel: '=?',
            streetHandler: '=?',
            resizeControl: '=?',
            routeModel: '=?',
            popupHandler: '=?'
        },
        compile: function(tElem, tAttr, tTransclude){
            return function link(scope, elem, attr, ctrl){
                var defaults = {
                    zoomControl: angular.isDefined(scope.zoomControl) ? scope.zoomControl : true,
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
                            draggable: false,
                            message: 'I\'m here',
                            clickable: false
                        },
                        dom_html: '',
                        threshhold: {
                            last: false,
                            now: false,
                            promise: false,
                            threshhold: 1000
                        }
                    }
                };
                //fix elem height
                elem.height(defaults.height);
//--------------------------------------------------------------------
//map
//--------------------------------------------------------------------
//                var mapContainerParent = oldMapContainer.parentNode;
//                mapContainerParent.removeChild(oldMapContainer);
//
//                var newMapContainer = document.createElement('div');
//                mapContainerParent.appendChild(newMapContainer);
                var html_string = '<div id="map" data-tap-disabled="true"></div>';
                elem.html(html_string);

                var map = L.map('map', {
                    attributionControl: defaults.attributionControl,
                    zoomControl: defaults.zoomControl
                }).setView([CORE_CONST.MAP_LAT, CORE_CONST.MAP_LNG], defaults.zoom);
                L.tileLayer(defaults.layer, {
                    scrollWheelZoom: defaults.scrollWheelZoom,
                    maxZoom: defaults.maxZoom,
                    closePopupOnClick: false
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
                if(scope.resizeControl){
                    var mouse_state = {
                        startY: 0,
                        startHeight: 0,
                        is_down: false,
                        clicked: false
                    };
                    scope.mouse_down = function(e){
                        e.preventDefault();
                        mouse_state.startY = e.clientY;
                        mouse_state.startHeight = elem.height();
                        mouse_state.is_down = true;
                    };
                    scope.mouse_move = function(e){
                        if(mouse_state.is_down){
                            var _height = (mouse_state.startHeight + e.clientY - mouse_state.startY);
                            elem.height(_height < defaults.height ? defaults.height : _height);
                        }
                    };
                    scope.mouse_up = function(e){
                        mouse_state.is_down = false;
                        map.invalidateSize(true);
                    };
                    scope.mouse_click = function(e){
                       if(mouse_state.clicked){
                           elem.height(defaults.height);
                           mouse_state.clicked = false;
                       } else {
                           elem.height(500);
                           mouse_state.clicked = true;
                       }
                        map.invalidateSize(true);
                    };
                    var resize_html = '<div ng-click="mouse_click($event)" ng-mousedown="mouse_down($event)" ng-mousemove="mouse_move($event)" ng-mouseup="mouse_up($event)" class="map_handle"><i class="ion ion-ios-drag"></i></div>';
                    elem.append(resize_html);
                    $compile(elem.contents())(scope);
                }
                //add transclude
                //elem.append('<div ng-transclude></div>');
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
//--------------------------------------------------------------------
//Marker model
//--------------------------------------------------------------------
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
                        var popup = L.popup({
                            closeButton: false,
                            closeOnClick: false,
                            className: 'pickup-location-popup'
                        });
                        scope.test = function(){
                            alert('asd');
                        };
                        var popup_html = '<button ng-click="test()">Set pickup location <i class="ion ion-ios-arrow-right"></i></button>';
                        popup.setContent(popup_html);
                        if(scope.popupHandler){
                            $compile(popup_html)(scope);
                        }
                        defaults.internal.model = L.marker({
                            lat: CORE_CONST.MAP_LAT,
                            lng: CORE_CONST.MAP_LNG
                        }, defaults.internal.modelOptions);
                        defaults.internal.model.bindPopup(popup).addTo(map).openPopup();
                        map.on('move', function(event){
                            var map_center = event.target.getCenter();
                            if(defaults.internal.model){
                                defaults.internal.model.setLatLng(map_center);
                            } else {
                                defaults.internal.model = L.marker(map_center, defaults.internal.modelOptions);
                                defaults.internal.model.bindPopup(popup).addTo(map).openPopup();
                            }
                        });
                        map.on('dragend', function(drag_event){
                            if(!scope.model)
                                scope.model = {};
                            var map_dragend = drag_event.target.getCenter();
                            scope.model.lat = map_dragend.lat;
                            scope.model.lng = map_dragend.lng;
                            if(scope.streetApi){
                                var external_response_handler = function(response){
                                    if(response.data && response.data.address)
                                        scope.streetModel = [{name: response.data.address.road}];// + ' ' + (response.data.address.house_number || '');
                                };
                                var private_response_handler = function(response){
                                    if(response.length)
                                        scope.streetModel = response;// + ' ' + (response.data.address.house_number || '');
                                };
                                if(scope.streetHandler){
                                    scope.streetHandler({lat: map_dragend.lat, lng: map_dragend.lng}).then(private_response_handler, angular.noop);
                                } else {
                                    GeoLocation.street(map_dragend.lat, map_dragend.lng).then(external_response_handler, angular.noop);
                                }
                                //defaults.internal.threshhold.now = Date.now();
                                //if(defaults.internal.threshhold.last && defaults.internal.threshhold.now < defaults.internal.threshhold.last + defaults.internal.threshhold.threshhold){
                                //    $timeout.cancel(defaults.internal.threshhold.promise);
                                //    defaults.internal.threshhold.promise = $timeout(function(){
                                //        defaults.internal.threshhold.last = defaults.internal.threshhold.now;
                                //        if(scope.streetHandler){
                                //            scope.streetHandler({lat: map_dragend.lat, lng: map_dragend.lng}).then(private_response_handler, angular.noop);
                                //        } else {
                                //             GeoLocation.street(map_dragend.lat, map_dragend.lng).then(external_response_handler, angular.noop);
                                //        }
                                //    }, defaults.internal.threshhold.threshhold);
                                //} else {
                                //    defaults.internal.threshhold.last = defaults.internal.threshhold.now;
                                //    if(scope.streetHandler){
                                //        scope.streetHandler({lat: map_dragend.lat, lng: map_dragend.lng}).then(private_response_handler, angular.noop);
                                //    } else {
                                //        GeoLocation.street(map_dragend.lat, map_dragend.lng).then(external_response_handler, angular.noop);
                                //    }
                                //}
                            }
                        });
                    }
                }
//--------------------------------------------------------------------
//Route path
//--------------------------------------------------------------------
                if(scope.routeModel){
                    L.Routing.Localization.ru = {
                        directions: {
                            N: 'север',
                            NE: 'северовосток',
                            E: 'восток',
                            SE: 'юговосток',
                            S: 'юг',
                            SW: 'югозапад',
                            W: 'запад',
                            NW: 'северозапад'
                        },
                        instructions: {
                            // instruction, postfix if the road is named
                            'Head': ['Прямо {dir}', ' на {road}'],
                            'Continue': ['Продолжить {dir}', ' на {road}'],
                            'SlightRight': ['Плавный поворот направо', ' на {road}'],
                            'Right': ['Направо', ' на {road}'],
                            'SharpRight': ['Резкий поворот направо', ' на {road}'],
                            'TurnAround': ['Обернись'],
                            'SharpLeft': ['Резкий поворот налево', ' на {road}'],
                            'Left': ['Налево', ' на {road}'],
                            'SlightLeft': ['Плавный поворот налево', ' на {road}'],
                            'WaypointReached': ['Точку достигнута'],
                            'Roundabout': ['Take the {exitStr} exit in the roundabout', ' onto {road}'],
                            'DestinationReached': ['Цель достигнута']
                        },
                        formatOrder: function(n){
                            return n;
                        },
                        ui: {
                            startPlaceholder: 'Начало',
                            viaPlaceholder: 'С {viaNumber}',
                            endPlaceholder: 'Конец'
                        }
                    };
                    GeoLocation.current().then(function(response){
                        L.Routing.control({
                            draggableWaypoints: false,
                            addWaypoints: false,
                            fitSelectedRoutes: true,
                            waypoints: [
                                L.latLng(response.coords.latitude, response.coords.longitude), //from
                                L.latLng(scope.routeModel.lat, scope.routeModel.lng) //to
                            ],
                            createMarker: function(index, point, count){
                                if(index === 0){
                                    var taxi_icon = L.AwesomeMarkers.icon({
                                        icon: 'model-s',
                                        prefix: 'ion',
                                        markerColor: 'red',
                                        spinClass: 'spin'
                                    });
                                    var taxi_marker = L.marker(point.latLng, {icon: taxi_icon});
                                    taxi_marker.bindPopup('From').openPopup();
                                    return taxi_marker;
                                }
                                if(index === 1){
                                    var client_icon = L.AwesomeMarkers.icon({
                                        icon: 'ios-body',
                                        prefix: 'ion',
                                        markerColor: 'blue',
                                        spinClass: 'spin'
                                    });
                                    var client_marker = L.marker(point.latLng, {icon: client_icon});
                                    client_marker.bindPopup('To').openPopup();
                                    return client_marker;
                                }
                            },
                            show: false,
                            language: 'ru'
                        }).addTo(map);
                    });
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
                            iconUrl: 'img/edge-arrow-marker-black.png',
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