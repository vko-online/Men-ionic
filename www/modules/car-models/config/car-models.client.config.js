'use strict';

// Configuring the Articles module
angular.module('car-models').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Car models', 'car-models', 'dropdown', '/car-models(/create)?', true, ['admin']);
		Menus.addSubMenuItem('topbar', 'car-models', 'List Car models', 'car-models');
		Menus.addSubMenuItem('topbar', 'car-models', 'New Car model', 'car-models/create', undefined, true, ['admin']);
	}
]);