'use strict';
// Lobbies controller
angular.module('lobbies').controller('LobbiesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Lobbies', 'SportTypes', 'Socket', 'Gyms', '$state',
    function($scope, $stateParams, $location, Authentication, Lobbies, SportTypes, Socket, Gyms, $state){
        Socket.on('new_msg', function(message){
            console.log('message', message);
        });
        $scope.gyms = Gyms.query();
        $scope.authentication = Authentication;
        $scope.sport_types = SportTypes.query();
        // Create new Lobby
        $scope.create = function(){
            // Create new Lobby object
            var lobby = new Lobbies({
                end_date: this.end_date,
                public: this.public,
                ranked: this.ranked,
                price: this.price,
                address: this.address,
                game_date: this.game_date,
                sport_type: this.sport_type._id,
                player_amount: this.sport_type.player_amount
            });
            // Redirect after save
            lobby.$save(function(response){
                $location.path('lobbies/' + response._id);
            }, function(errorResponse){
                $scope.error = errorResponse.data.message;
            });
        };
        // Remove existing Lobby
        $scope.remove = function(lobby){
            if(lobby){
                lobby.$remove();
                for(var i in $scope.lobbies){
                    if($scope.lobbies [i] === lobby){
                        $scope.lobbies.splice(i, 1);
                    }
                }
            } else {
                $scope.lobby.$remove(function(){
                    $location.path('lobbies');
                });
            }
        };
        // Update existing Lobby
        $scope.update = function(){
            var lobby = $scope.lobby;
            lobby.sport_type = lobby.sport_type._id;
            lobby.$update(function(){
                $location.path('lobbies/' + lobby._id);
            }, function(errorResponse){
                $scope.error = errorResponse.data.message;
            });
        };
        // Find a list of Lobbies
        $scope.find = function(){
            $scope.lobbies = Lobbies.query();
        };
        // Find existing Lobby
        $scope.findOne = function(){
            Lobbies.get({
                lobbyId: $stateParams.lobbyId
            }, function(response){
                $scope.lobby = response;
            }, function(error){
                $scope.error = error.statusText;
            });
        };
        $scope.join_lobby = function(side_number){
            $scope.lobby.$join_lobby({side: side_number}, function(response){
                console.log(response);
            }, function(error){
                $scope.error = error;
            });
        };
        $scope.start_game = function(){
            $scope.lobby.$start_game(function(response){
                console.log(response);
            }, function(error){
                $scope.error = error;
            });
        };
        $scope.select = function(){
            var filtered = $scope.sport_types.filter(function(i){
                return i.selected === true;
            }).map(function(o){
                return o._id;
            });
            var filter = {
                my_lobbies: $scope.my_lobbies,
                ranked_lobbies: $scope.ranked_lobbies,
                sport_types: filtered
            };
            $scope.lobbies = Lobbies.query(filter);
        };
        if($stateParams.lobbyId){
            $scope.recommended_users = Lobbies.recommended_users({
                lobbyId: $stateParams.lobbyId
            });
        }
        $scope.template = function(){
            Lobbies.get({
                lobbyId: $stateParams.lobbyId
            }, function(response){
                $scope.template_lobby = response;
            }, function(error){
                $scope.error = error.statusText;
            });
        };
        $scope.create_template = function(){
            // Create new Lobby object
            var lobby = new Lobbies({
                game_date: this.template_lobby.game_date,
                end_date: this.template_lobby.end_date,
                public: this.template_lobby.public,
                ranked: this.template_lobby.ranked,
                price: this.template_lobby.price,
                address: this.template_lobby.address,
                sport_type: this.template_lobby.sport_type._id,
                player_amount: this.template_lobby.sport_type.player_amount
            });
            // Redirect after save
            lobby.$save(function(response){
                $location.path('lobbies/' + response._id);
            }, function(errorResponse){
                $scope.error = errorResponse.data.message;
            });
        };
        Socket.on('start_game', function(){
            if($stateParams.lobbyId)
                $scope.findOne();
        });
        Socket.on('join_lobby', function(){
            if($stateParams.lobbyId)
                $scope.findOne();
        });
    }
]);
