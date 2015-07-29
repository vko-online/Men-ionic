'use strict';
//Setting up route
angular.module('trips').config(['$stateProvider',
    function($stateProvider){
        // Trips state routing
        $stateProvider.
            state('createTrip', {
                url: '/trips/create',
                templateUrl: 'modules/trips/views/create-trip.client.view.html'
            }).
            state('listTrips', {
                url: '/trips',
                templateUrl: 'modules/trips/views/list-trips.client.view.html'
            }).
            state('listHistoryTrips', {
                url: '/trips_history',
                templateUrl: 'modules/trips/views/list-history-trips.client.view.html'
            }).
            state('viewHistoryTrip', {
                url: '/trips_history/:tripId',
                templateUrl: 'modules/trips/views/view-history-trip.client.view.html'
            }).
            state('viewTrip', {
                url: '/trips/:tripId',
                templateUrl: 'modules/trips/views/view-trip.client.view.html'
            });
    }
]);