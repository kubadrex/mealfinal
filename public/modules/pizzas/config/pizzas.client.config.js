'use strict';

// Configuring the Articles module
angular.module('pizzas').run(['Menus',
	function(Menus) {
    // Set top bar menu items
		Menus.addMenuItem('topbar', 'Pizzas', 'pizzas', 'dropdown', '/pizzas(/create)?');
		Menus.addSubMenuItem('topbar', 'pizzas', 'List Pizzas', 'pizzas');
    Menus.addSubMenuItem('topbar', 'pizzas', 'New Pizza', 'pizzas/create', null, null, ["admin"]);
	}
]);