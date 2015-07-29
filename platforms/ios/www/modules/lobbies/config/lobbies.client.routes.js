'use strict';
//Setting up route
angular.module('lobbies').config(['$stateProvider',
    function($stateProvider){
        // Lobbies state routing
        $stateProvider.
            state('listLobbies', {
                url: '/lobbies',
                templateUrl: 'modules/lobbies/views/list-lobbies.client.view.html'
            }).
            state('activeLobbies', {
                url: '/active_lobbies',
                templateUrl: 'modules/lobbies/views/active-lobbies.client.view.html'
            }).
            state('createFromLobby', {
                url: '/lobbies/:lobbyId/create',
                templateUrl: 'modules/lobbies/views/create-template-lobby.client.view.html'
            }).
            state('createLobby', {
                url: '/lobbies/create',
                templateUrl: 'modules/lobbies/views/create-lobby.client.view.html'
            }).
            state('viewLobby', {
                url: '/lobbies/:lobbyId',
                templateUrl: 'modules/lobbies/views/view-lobby.client.view.html'
            }).
            state('editLobby', {
                url: '/lobbies/:lobbyId/edit',
                templateUrl: 'modules/lobbies/views/edit-lobby.client.view.html'
            });
    }
]);
