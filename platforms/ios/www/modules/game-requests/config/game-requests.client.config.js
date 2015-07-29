'use strict';

// Configuring the Articles module
angular.module('game-requests').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('topbar', 'Game requests', 'game-requests', 'dropdown', '/game-requests(/create)?');
		//Menus.addSubMenuItem('topbar', 'game-requests', 'List Game requests', 'game-requests');
		//Menus.addSubMenuItem('topbar', 'game-requests', 'New Game request', 'game-requests/create');
	}
]);
