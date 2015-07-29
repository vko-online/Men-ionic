'use strict';

// Configuring the Articles module
angular.module('car-brands').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Car brands', 'car-brands', 'dropdown', '/car-brands(/create)?', true, ['admin']);
		Menus.addSubMenuItem('topbar', 'car-brands', 'List Car brands', 'car-brands');
		Menus.addSubMenuItem('topbar', 'car-brands', 'New Car brand', 'car-brands/create', undefined, true, ['admin']);
	}
]);