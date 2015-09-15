// Created by bwin on 5/28/15.

'use strict';

var ApplicationConfiguration = (function(){
    // Init module configuration options
    var applicationModuleName = 'taxi';
    var applicationModuleVendorDependencies = [
        'ionic',
        'ngResource',
        'btford.socket-io',
        'timer',
        'leaflet-directive',
        'ion-affix',
        'angularFileUpload'
    ];
    var module_defers = [];
    // Add a new vertical module
    var registerModule = function(moduleName, dependencies){
        // Create angular module
        module_defers.push({
            moduleName: moduleName,
            dependencies: dependencies
        });
        angular.module(moduleName, dependencies || []);
        //// Add the module to the AngularJS configuration file
        //angular.module(applicationModuleName).requires.push(moduleName);
    };

    var $injected_http = angular.injector(['ng']).get('$http');

    var SERVER_URL = 'http://localhost:3000/'; //'http://localhost:3000/', //http://ttaxi.herokuapp.com/, //http://78.40.108.32:3000/

    //set token header
    var auth_token = localStorage.getItem('auth_token');
    $injected_http({
        method: 'GET',
        url: SERVER_URL + 'users/me',
        headers: {
            Authentication: auth_token
        }
    })
        .success(function(successResponse){
            angular.element(document).ready(function(){
                //Fixing facebook bug with redirect
                if(window.location.hash === '#_=_') window.location.hash = '#!';
                //Then init the app
                angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);
                module_defers.forEach(function(module){
                    angular.module(applicationModuleName).requires.push(module.moduleName);
                });
                angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider', '$urlRouterProvider',
                    function($locationProvider, $urlRouterProvider){
                        $locationProvider.hashPrefix('!');
                    }
                ]);
                angular.module(ApplicationConfiguration.applicationModuleName).run(function($ionicPlatform, $ionicConfig, Authentication, $http, Socket){
                    //set auth-token
                    $http.defaults.headers.common.Authentication = auth_token;
                    //set global user
                    Authentication.set_user(successResponse);

                    $ionicPlatform.ready(function(){
                        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                        // for form inputs)
                        if(window.cordova && window.cordova.plugins.Keyboard) cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                        if(window.StatusBar) StatusBar.styleDefault();
                        $ionicConfig.backButton.text('Назад');
                    });
                });
                angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
            });
        }).error(function(errorResponse){
            /*
             *todo: this is temporary solution, we must define real offline/unauthorized state
             */
            angular.element(document).ready(function(){
                if(window.location.hash === '#_=_') window.location.hash = '#!';
                angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);
                module_defers.forEach(function(module){
                    angular.module(applicationModuleName).requires.push(module.moduleName);
                });
                angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider', '$urlRouterProvider',
                    function($locationProvider, $urlRouterProvider){
                        $locationProvider.hashPrefix('!');
                    }
                ]);
                angular.module(ApplicationConfiguration.applicationModuleName).run(function($ionicPlatform, $ionicConfig, Authentication, $http, $rootScope, $ionicModal){
                    $ionicModal.fromTemplateUrl('modules/users/views/authentication/signin.client.view.html', {
                        scope: $rootScope,
                        animation: 'slide-in-up'
                    }).then(function(modal) {
                        modal.show();
                        $rootScope.$on('event:auth-login_hide', function(){
                            modal.hide();
                        });
                    });
                    $ionicPlatform.ready(function(){
                        if(window.cordova && window.cordova.plugins.Keyboard) cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                        if(window.StatusBar) StatusBar.styleDefault();
                        $ionicConfig.backButton.text('Назад');
                    });
                });
                angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
            });
        });
    return {
        applicationModuleName: applicationModuleName,
        applicationModuleVendorDependencies: applicationModuleVendorDependencies,
        registerModule: registerModule
    };
})();

