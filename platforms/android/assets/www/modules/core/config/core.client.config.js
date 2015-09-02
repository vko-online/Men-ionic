// by bwin on 7/24/15.

'use strict';

angular.module('core').run(['Menus', 'Authentication',
    function(Menus, Authentication) {
        // Set top bar menu items
        Menus.addMenuItem('topbar', 'BecomeDriver', 'become_driver', 'link', '', true, ['client']);
        Menus.addMenuItem('topbar', 'Profile', 'settings/profile', 'link', '', true, ['client']);

        Menus.addMenuItem('topbar', 'DriverProfile', 'become_driver', 'link', '', true, ['driver']);
        Menus.addMenuItem('topbar', 'Profile', 'settings/profile', 'link', '', true, ['driver']);

        Menus.addMenuItem('topbar', 'Share', 'share', 'link', '', true, ['client', 'driver']);
    }
]);