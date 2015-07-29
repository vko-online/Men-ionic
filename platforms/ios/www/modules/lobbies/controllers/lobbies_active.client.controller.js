'use strict';
// Lobbies controller
angular.module('lobbies').controller('LobbiesActiveController', ['$scope', '$stateParams', '$location', 'Authentication', 'Lobbies', 'SportTypes', 'Socket',
    function($scope, $stateParams, $location, Authentication, Lobbies, SportTypes, Socket){

        Socket.on('new_msg', function(message) {
            console.log('message', message);
        });

        $scope.authentication = Authentication;
        $scope.sport_types = SportTypes.query();
        // Find a list of Lobbies
        $scope.find = function(){
            $scope.lobbies = Lobbies.active_lobbies();
        };
        $scope.join_lobby = function(side_number){
            $scope.lobby.$join_lobby({side: side_number}, function(response){
                console.log(response);
            }, function(error){
                $scope.error = error;
            });
        };
    }
]);
