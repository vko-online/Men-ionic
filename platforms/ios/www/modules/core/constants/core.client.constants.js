'use strict';
// Setting up route

angular.module('core').constant('CORE_CONST', {
    SERVER_URL: 'http://78.40.108.32:3000/', //http://ttaxi.herokuapp.com/ //document.body ? ((document.body.getAttribute('dev-env') === 'true') ? 'http://localhost:3000' : 'http://ttaxi.herokuapp.com') : 'http://localhost:3000',
    REST_URL: 'http://78.40.108.32:3000/', //'http://localhost:3000/', //http://ttaxi.herokuapp.com/, http://78.40.108.32:3000/
    MAP_ZOOM: 15,
    MAP_LAT: 43.25,
    MAP_LNG: 76.92
});