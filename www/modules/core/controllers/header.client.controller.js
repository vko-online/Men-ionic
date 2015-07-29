'use strict';
angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus', 'Socket', 'Users', '$location', '$http', '$ionicModal', '$state',
    function($scope, Authentication, Menus, Socket, Users, $location, $http, $ionicModal, $state){
        var socket_registered = false;
        Authentication.get_user().then(function(data){
            Socket.emit('join', data._id);
            $scope.authentication = Authentication;
            if($scope.authentication.user && !socket_registered){
                socket_registered = true;
                Socket.emit('join', $scope.authentication.user._id);
            }
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
        $scope.menu = Menus.getMenu('topbar');
        $scope.toggleCollapsibleMenu = function(){
            $scope.isCollapsed = !$scope.isCollapsed;
        };
        // Collapsing the menu after navigation
        $scope.$on('$stateChangeSuccess', function(){
            $scope.isCollapsed = false;
        });
        //modal
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
    }
]);
