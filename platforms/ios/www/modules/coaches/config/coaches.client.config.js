'use strict';

// Configuring the Articles module
angular.module('coaches').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Coaches', 'coaches', 'dropdown', '/coaches(/create)?');
		Menus.addSubMenuItem('topbar', 'coaches', 'List Coaches', 'coaches');
	}
]);
