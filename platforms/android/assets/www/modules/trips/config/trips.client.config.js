// by bwin on 7/3/15.

'use strict';

// Configuring the Articles module
angular.module('trips').run(['Menus', 'Authentication',
    function(Menus, Authentication) {
        // Set top bar menu items
        Menus.addMenuItem('topbar', 'Trips', 'trips', 'dropdown', '/trips', true, ['client', 'driver', 'admin']);
        Menus.addSubMenuItem('topbar', 'trips', 'List trips', 'trips', undefined, true, ['driver']);

        //delete me
        Menus.addSubMenuItem('topbar', 'trips', 'Create', 'trips/create');

        Menus.addSubMenuItem('topbar', 'trips', 'History trips', 'trips_history', undefined, true, ['client', 'driver']);
        if(Authentication.user && Authentication.user.trip){
            Menus.addSubMenuItem('topbar', 'trips', 'Active trip', 'trips/' + (Authentication.user.trip._id || Authentication.user.trip), undefined, true, ['client']);
        } else {
            Menus.addSubMenuItem('topbar', 'trips', 'Create', 'trips/create', undefined, true, ['client']);
        }
    }
]);