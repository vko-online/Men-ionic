'use strict';

angular.module('users').controller('ProfileController', ['$scope', '$http', '$location', 'Users', 'Authentication', '$stateParams', 'Lobbies',
    function($scope, $http, $location, Users, Authentication, $stateParams, Lobbies) {

        $scope.query = '';

        if($stateParams.userId){
            $scope.user = Users.get({
                userId: $stateParams.userId
            });
            $scope.active_lobbies = Lobbies.active_lobbies({
                invited_user_id: $stateParams.userId
            });
        } else {
            $scope.user = Authentication.user;
            $scope.active_lobbies = Lobbies.active_lobbies();
        }

        $scope.find = function(){
            $scope.users = Users.query({
                q: $scope.query
            });
        };

        $scope.active_lobbies = Lobbies.active_lobbies({
            invited_user_id: $stateParams.userId
        });

        $scope.follow_unfollow = function(){
            //noinspection JSUnresolvedFunction
            $scope.user.$follow_unfollow();
        };

        $scope.invite_lobby = function(lobby){
            lobby.$invite_lobby({
                invited_user_id: $stateParams.userId
            }, function(success){
                $scope.active_lobbies = Lobbies.active_lobbies({
                    invited_user_id: $stateParams.userId
                });
            }, function(error){
                $scope.error = error.data.message;
            });
        };
        $scope.is_invited= function(lobby){
            return lobby.game_requests.indexOf($stateParams.userId) > -1;
        };
        // If user is not signed in then redirect back home
        if (!$scope.user) $location.path('/');
    }
]);
