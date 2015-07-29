'use strict';

// Configuring the Articles module
angular.module('friend-requests').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('topbar', 'Friend requests', 'friend-requests', 'dropdown', '/friend-requests(/create)?');
		//Menus.addSubMenuItem('topbar', 'friend-requests', 'List Friend requests', 'friend-requests');
		//Menus.addSubMenuItem('topbar', 'friend-requests', 'New Friend request', 'friend-requests/create');
	}
]);
