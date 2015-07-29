'use strict';
angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus', 'Socket', 'Users', '$location', '$http',
    function($scope, Authentication, Menus, Socket, Users, $location, $http){
        var socket_registered = false;
        Authentication.get_user().then(function(data){
            Socket.emit('join', data._id);
            Authentication.set_user(data);
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
                $location.path('/signin');
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
    }
]);
