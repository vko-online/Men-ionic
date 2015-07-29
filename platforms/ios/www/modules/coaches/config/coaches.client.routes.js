'use strict';
//Setting up route
angular.module('coaches').config(['$stateProvider',
    function($stateProvider){
        // Coaches state routing
        $stateProvider.
            state('listCoaches', {
                url: '/coaches',
                templateUrl: 'modules/coaches/views/list-coaches.client.view.html'
            }).
            state('createCoach', {
                url: '/coaches/create',
                templateUrl: 'modules/coaches/views/create-coach.client.view.html'
            }).
            state('viewCoach', {
                url: '/coaches/:coachId',
                templateUrl: 'modules/coaches/views/view-coach.client.view.html'
            }).
            state('editCoach', {
                url: '/coaches/:coachId/edit',
                templateUrl: 'modules/coaches/views/edit-coach.client.view.html'
            });
    }
]);
