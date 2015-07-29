'use strict';
// Games controller
angular.module('games').controller('GamesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Games', 'Socket', '$state',
    function($scope, $stateParams, $location, Authentication, Games, Socket, $state){
        $scope.authentication = Authentication;
        // Find a list of Games
        $scope.find = function(){
            $scope.games = Games.query();
        };
        // Find existing Game
        $scope.findOne = function(){
            $scope.game = Games.get({
                gameId: $stateParams.gameId
            });
        };


        $scope.new_comment_content = '';
        $scope.add_comment = function(){
            var comment = {
                content: $scope.new_comment_content
            };
            $scope.game.$add_comment(comment,function(response){
                $scope.new_comment_content = '';
            }, function(errorResponse){
                $scope.error = errorResponse.data.message;
            });
        };
        $scope.remove_comment = function(comment_id){
            $scope.game.$remove_comment({
                comment_id: comment_id
            });
        };

        $scope.follow = function(){
            $scope.game.$follow_unfollow({
                gameId: $stateParams.gameId
            });
        };
        Socket.on('new_comment', function(game){
            $scope.game.comments =  game.comments;
        });

        Socket.on('game_result', function(){
            if($stateParams.gameId)
                $scope.findOne();
        });
        Socket.on('game_result_confirmed', function(){
            if($stateParams.gameId)
                $scope.findOne();
        });

        Socket.on('game_confirm', function(){
            if($stateParams.gameId)
                $scope.findOne();
        });

        Socket.on('game_cancel', function(){
            if($stateParams.gameId)
                $scope.findOne();
        });
        $scope.cancel_game = function(){
            $scope.game.$cancel_game({
                gameId: $stateParams.gameId
            });
        };
        $scope.player_score = {
            first: 0,
            second: 0
        };
        $scope.game_result = function(){
            $scope.game.$game_result({
                gameId: $stateParams.gameId,
                first_players_score: $scope.player_score.first,
                second_players_score: $scope.player_score.second
            });
        };
        $scope.confirm_result = function(){
            $scope.game.$confirm_result({
                gameId: $stateParams.gameId
            });
        };
    }
]);
