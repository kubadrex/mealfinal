'use strict';

// Configuring the Articles module
angular.module('sides').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Sides', 'sides', 'dropdown', '/sides(/create)?');
		Menus.addSubMenuItem('topbar', 'sides', 'List Sides', 'sides');
		Menus.addSubMenuItem('topbar', 'sides', 'New Side', 'sides/create', null, null, ["admin"]);
	}
]);