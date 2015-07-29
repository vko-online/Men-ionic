'use strict';
//Lobbies service used to communicate Lobbies REST endpoints
angular.module('lobbies').factory('Lobbies', ['$resource', 'CORE_CONST',
    function($resource, CORE_CONST){
        return $resource(CORE_CONST.REST_URL + 'lobbies/:lobbyId', {
            lobbyId: '@_id'
        }, {
            update: {
                method: 'PUT'
            },
            join_lobby:{
                method: 'POST',
                url: CORE_CONST.REST_URL + 'lobbies/:lobbyId/join_lobby'
            },
            start_game: {
                method: 'POST',
                url: CORE_CONST.REST_URL + 'lobbies/:lobbyId/start_game'
            },
            active_lobbies: {
                method: 'GET',
                url: CORE_CONST.REST_URL + 'lobbies/active',
                isArray: true
            },
            invite_lobby: {
                method: 'POST',
                url: CORE_CONST.REST_URL + 'lobbies/:lobbyId/invite_lobby'
            },
            recommended_users: {
                method: 'GET',
                isArray: true,
                url: 'lobbies/:lobbyId/recommended_users'
            },
            template: {
                method: 'GET',
                url: CORE_CONST.REST_URL + 'lobbies/:lobbyId/template'
            }
        });
    }
]);
