'use strict';

// Configuring the Articles module
angular.module('lobbies').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Lobbies', 'lobbies', 'dropdown', '/lobbies(/create)?');
		Menus.addSubMenuItem('topbar', 'lobbies', 'List Lobbies', 'lobbies');
		Menus.addSubMenuItem('topbar', 'lobbies', 'New Lobby', 'lobbies/create');
	}
]);