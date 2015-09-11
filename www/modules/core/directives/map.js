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
angular.module('core').directive('map', ['CORE_CONST', '$compile', 'GeoLocation', function(CORE_CONST, $compile, GeoLocation){
    return {
        restrict: 'E',
        transclude: true,
        template: '<div id="map" data-tap-disabled="true"></div>',
        //template: '<leaflet data-tap-disabled="true" height="_height" center="_center" defaults="_defaults" controls="_controls" markers="_markers" ng-transclude=""></leaflet>',
        scope: {
            model: '=?',
            center: '=?',
            markers: '=?',
            fullscreenControl: '=?',
            locateControl: '=?',
            edgeMarker: '=?'
        },
        compile: function(tElem, tAttr, tTransclude){
            return function link(scope, elem, attr, ctrl){
                var defaults = {
                    height: 300,
                    attributionControl: false,
                    scrollWheelZoom: false,
                    maxZoom: 18,
                    layer: 'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png',
                    zoom: 13
                };
                elem.height(defaults.height);
                var map = L.map('map', {
                    attributionControl: defaults.attributionControl
                }).setView([CORE_CONST.MAP_LAT, CORE_CONST.MAP_LNG], defaults.zoom);
                L.tileLayer(defaults.layer, {
                    scrollWheelZoom: defaults.scrollWheelZoom,
                    maxZoom: defaults.maxZoom
                }).addTo(map);

                if(scope.center){
                    map.panTo(scope.center.lat, scope.center.lng);
                }

                if(scope.fullscreenControl){
                    L.control.fullscreen().addTo(map);
                }
                if(scope.locateControl){
                    L.control.locate({
                        icon: 'ion ion-ios-location-outline',
                        iconLoading: 'ion ion-load-d spin',
                        drawCircle: false,
                        displayWithZoomControl: true
                    }).addTo(map);
                }
                if(scope.edgeMarker){
                    L.circle([51.96309632078721, 7.622795104980469], 5000).addTo(map);
                    L.circle([51.650378463223326, 9.440699815750122], 200).addTo(map);
                    L.circleMarker([52.3688917060255, 9.722900390625]).addTo(map);
                    L.circleMarker([51.508742458803326, 9.942626953125]).addTo(map);
                    L.marker([48.85,2.35]).addTo(map);
                    L.marker([52.52,13.40]).addTo(map);
                    L.marker([40.18,44.51]).addTo(map);
                    L.marker([48.21,16.37]).addTo(map);
                    L.marker([53.9,27.57]).addTo(map);
                    L.marker([50.85,4.35]).addTo(map);
                    L.marker([43.85,18.38]).addTo(map);
                    L.marker([42.7,23.32]).addTo(map);
                    L.marker([50.09,14.42]).addTo(map);
                    L.marker([55.68,12.57]).addTo(map);
                    L.marker([59.44,24.75]).addTo(map);
                    L.marker([60.18,24.93]).addTo(map);
                    L.marker([37.98,23.73]).addTo(map);
                    L.marker([64.17,-51.74]).addTo(map);
                    L.marker([47.5,19.08]).addTo(map);
                    L.marker([64.15,-21.95]).addTo(map);
                    L.marker([41.9,12.48]).addTo(map);
                    L.marker([56.95,24.1]).addTo(map);
                    L.marker([47.14,9.52]).addTo(map);
                    L.marker([54.68,25.32]).addTo(map);
                    L.marker([49.61,6.13]).addTo(map);
                    L.marker([42,21.43]).addTo(map);
                    L.marker([35.9,14.51]).addTo(map);
                    L.marker([52.37,4.9]).addTo(map);
                    L.marker([59.91,10.74]).addTo(map);
                    L.marker([52.25,21]).addTo(map);
                    L.marker([38.72,-9.13]).addTo(map);
                    L.marker([40.42,-3.7]).addTo(map);
                    L.marker([59.33,18.06]).addTo(map);
                    L.marker([46.95,7.45]).addTo(map);
                    L.marker([50.43,30.52]).addTo(map);
                    L.edgeMarker({
                        icon: L.icon({ // style markers
                            iconUrl : 'lib/Leaflet.EdgeMarker/images/edge-arrow-marker.png',
                            clickable: true,
                            iconSize: [48,48],
                            iconAnchor: [24, 24]
                        }),
                        distanceOpacity: true,
                        distanceOpacityFactor: 10
                    }).addTo(map);
                }
            }
        }
    }
}]);