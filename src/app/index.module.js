(function ()
{
    'use strict';

    /**
     * Main module of the Fuse
     */
    angular
        .module('fuse', [

            // Core
            'app.core',

            // Navigation
            'app.navigation',

            // Toolbar
            'app.toolbar',


            'app.apps',

            // Quick Panel
            'app.quick-panel',

            // Sample
            'app.editor',

            //Login
            'app.pages.auth.login-v2',

            'app.pages.auth.register-v2',          

            'app.dashboards',

            'app.home',
            
            'app.realtime'
            //instead of app.layers app.maps


            /*External Modules & libraries */
            //
            //'Restangular'

        ]);
})();