'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication', 'CORE_CONST', '$state', '$rootScope',
    function($scope, $http, $location, Authentication, CORE_CONST, $state, $rootScope) {
        $scope.authentication = Authentication;
        $scope.credentials = {};
        // If user is signed in then redirect back home
        //if ($scope.authentication.user) $location.path('/');
        var auth_token_key = 'auth_token';

        $scope.signup_client = function() {
            $http.post(CORE_CONST.REST_URL + 'auth/signup_client', $scope.credentials).success(function(response) {
                // If successful we assign the response to the global user model
                $scope.authentication.user = response;
                $http.defaults.headers.common.Authentication = response.loginToken;
                localStorage.setItem(auth_token_key, response.loginToken);
                Authentication.set_user(response);
                // And redirect to the index page
                $state.go('home', {}, {reload: true});
            }).error(function(response) {
                $scope.error = response.message;
            });
        };
        $scope.signin = function() {
            $http.post(CORE_CONST.REST_URL + 'auth/signin', $scope.credentials).success(function(response) {
                // If successful we assign the response to the global user model
                Authentication.set_user(response);
                $http.defaults.headers.common.Authentication = response.loginToken;
                localStorage.setItem(auth_token_key, response.loginToken);
                // And redirect to the index page
                $state.go('home', {}, {reload: true});
                $scope.close_signin_modal();
            }).error(function(response) {
                $scope.error = response.message;
            });
        };
        $scope.close_signin_modal = function(){
            $rootScope.$broadcast('event:auth-login_hide');
        }
    }
]);