'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication', 'CORE_CONST', '$state', '$rootScope',
    function($scope, $http, $location, Authentication, CORE_CONST, $state, $rootScope) {
        $scope.authentication = Authentication;
        $scope.credentials = {};
        // If user is signed in then redirect back home
        //if ($scope.authentication.user) $location.path('/');
        var auth_token_key = 'auth_token';
        $scope.signup = function() {
            $http.post(CORE_CONST.REST_URL + 'auth/signup', $scope.credentials).success(function(response) {
                // If successful we assign the response to the global user model
                Authentication.user = response;
                // And redirect to the index page
                $state.go('home', {}, {reload: true});
            }).error(function(response) {
                $scope.error = response.message;
            });
        };
        $scope.signin = function() {
            $http.post(CORE_CONST.REST_URL + 'auth/signin', $scope.credentials).success(function(response) {
                // If successful we assign the response to the global user model
                Authentication.user = response;
                $scope.close_signin_modal();
                // And redirect to the index page
                $state.go('home', {}, {reload: true});

            }).error(function(response) {
                $scope.error = response.message;
            });
        };
        $scope.close_signin_modal = function(){
            $rootScope.$broadcast('event:auth-login_hide');
        }
    }
]);