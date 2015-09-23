'use strict';
angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Socket', 'Users', '$location', '$http', '$ionicModal', '$state', 'CORE_CONST',
    function($scope, Authentication, Socket, Users, $location, $http, $ionicModal, $state, CORE_CONST){
        $scope.authentication = Authentication;
        $ionicModal.fromTemplateUrl('modules/users/views/authentication/signin.client.view.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.signin_modal = modal;
            $scope.$on('event:auth-login_required', function(e, rejection) {
                $scope.signin_modal.show();
            });
            $scope.$on('event:auth-login_hide', function() {
                $scope.signin_modal.hide();
                $scope.authentication = Authentication;
            });
            $scope.$on('event:auth-complete', function() {
                $state.go('home', {}, {reload: true, inherit: false});
            });
            //Cleanup the modal when we're done with it!
            $scope.$on('$destroy', function() {
                $scope.signin_modal.remove();
            });
        });
        $scope.signout = function(){
            Users.sign_out(function(successResponse){
                Authentication.user = null;
                localStorage.removeItem('a');
                delete $http.defaults.headers.common.Authentication;
                // Redirect to signin page
                $state.go('home', {}, {reload: true, inherit: false});
                //$location.path('/signin');
            }, function(errorResponse){
                $scope.error = errorResponse.message;
            });
        };

        $scope.isCollapsed = false;
        $scope.toggleCollapsibleMenu = function(){
            $scope.isCollapsed = !$scope.isCollapsed;
        };
        // Collapsing the menu after navigation
        $scope.$on('$stateChangeSuccess', function(){
            $scope.isCollapsed = false;
        });
        //modal

        $scope.CORE_CONST = CORE_CONST;
        $scope.exit_app = function(){
            if(navigator.app)
                navigator.app.exitApp();
        }
    }
]);
