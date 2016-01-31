'use strict';

// Configuring the Articles module
angular.module('drinks').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Drinks', 'drinks', 'dropdown', '/drinks(/create)?');
		Menus.addSubMenuItem('topbar', 'drinks', 'List Drinks', 'drinks');
		Menus.addSubMenuItem('topbar', 'drinks', 'New Drink', 'drinks/create', null, null, ["admin"]);
	}
]);