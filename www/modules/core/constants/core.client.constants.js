'use strict';
// Setting up route

angular.module('core').constant('CORE_CONST', {
    SERVER_URL: document.body ? ((document.body.getAttribute('dev-env') === 'true') ? 'http://localhost:3000' : 'http://taxi.herokuapp.com') : 'http://localhost:3000',
    REST_URL: 'http://localhost:3000/',
    MAP_ZOOM: 15,
    MAP_LAT: 43.25,
    MAP_LNG: 76.92
});