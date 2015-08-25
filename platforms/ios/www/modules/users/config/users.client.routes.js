'use strict';
// Setting up route
angular.module('users').config(['$stateProvider',
    function($stateProvider){
        // Users state routing
        $stateProvider.
            state('edit_profile', {
                url: '/settings/profile',
                templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
            }).
            state('me', {
                url: '/me',
                templateUrl: 'modules/users/views/profile.client.view.html'
            }).
            state('share', {
                url: '/share',
                templateUrl: 'modules/users/views/share.client.view.html'
            }).
            //create driver route
            state('become_driver', {
                url: '/become_driver',
                templateUrl: 'modules/users/views/driver/driver-pre-create.client.view.html'
            }).
            state('driver_edit', {
                url: '/driver_edit',
                templateUrl: 'modules/users/views/driver/driver-edit.client.view.html'
            }).
            state('profile_list', {
                url: '/profiles',
                templateUrl: 'modules/users/views/profile-list.client.view.html'
            }).
            state('profile', {
                url: '/profiles/:userId',
                templateUrl: 'modules/users/views/profile.client.view.html'
            }).
            state('rating', {
                url: '/settings/rating',
                templateUrl: 'modules/users/views/rating.client.view.html'
            }).
            state('password', {
                url: '/settings/password',
                templateUrl: 'modules/users/views/settings/change-password.client.view.html'
            }).
            state('accounts', {
                url: '/settings/accounts',
                templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
            }).
            state('signup_client', {
                url: '/signup_client',
                templateUrl: 'modules/users/views/authentication/signup_client.client.view.html'
            }).
            state('signin', {
                url: '/signin',
                templateUrl: 'modules/users/views/authentication/signin.client.view.html'
            }).
            state('forgot', {
                url: '/password/forgot',
                templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
            }).
            state('reset-invalid', {
                url: '/password/reset/invalid',
                templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
            }).
            state('reset-success', {
                url: '/password/reset/success',
                templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
            }).
            state('reset', {
                url: '/password/reset/:token',
                templateUrl: 'modules/users/views/password/reset-password.client.view.html'
            });
    }
]);
