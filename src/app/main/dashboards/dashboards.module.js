(function ()
{
    'use strict';
 
    angular
        .module('app.dashboards',
            [
                'app.dashboards.layer',
                'app.dashboards.maps',
                'app.dashboards.file',
                'app.dashboards.analytics'
            ]
        )
        .config(config);


     
    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        // Navigation
                msNavigationServiceProvider.saveItem('Administration', {
            title : 'Administration',
            group : true,
            weight: 1
        });

        msNavigationServiceProvider.saveItem('Administration.dashboards', {
            title : 'Dashboards',
            icon  : 'icon-tile-four',
            group : false,
            weight: 1
        });

        msNavigationServiceProvider.saveItem('Administration.dashboards.analytics', {
            title: 'analytique',
            icon  : 'icon-camera-timer',
            state: 'app.dashboards_analytics'
        });

        msNavigationServiceProvider.saveItem('Administration.dashboards.maps', {
            title: 'Admin Cartes',
            icon  : 'icon-map',
            state: 'app.dashboards_maps'
        });

        msNavigationServiceProvider.saveItem('Administration.dashboards.layer', {
            title: 'Admin Couches',
            icon  : 'icon-layers',
            state: 'app.dashboards_layer'
        });

        msNavigationServiceProvider.saveItem('Administration.dashboards.file', {
            title: 'Admin Fichiers',
            icon  : 'icon-file',
            state: 'app.dashboards_file'
        });
        
    }

})();