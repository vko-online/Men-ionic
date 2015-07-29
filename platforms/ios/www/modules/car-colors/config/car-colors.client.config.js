'use strict';

// Configuring the Articles module
angular.module('car-colors').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Car colors', 'car-colors', 'dropdown', '/car-colors(/create)?', true, ['admin']);
		Menus.addSubMenuItem('topbar', 'car-colors', 'List Car colors', 'car-colors');
		Menus.addSubMenuItem('topbar', 'car-colors', 'New Car color', 'car-colors/create', undefined, true, ['admin']);
	}
]);