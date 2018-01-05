(function () 
{ 
    'use strict';

    angular
        .module('app.home',
            [
                'app.home.maps',
                'app.home.layers',
                'app.home.files',
                'app.home.inv'
            ]
        )
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        // Navigation

        msNavigationServiceProvider.saveItem('Home', {
            title : 'Home',
            group : true,
            weight: 3
        });

        msNavigationServiceProvider.saveItem('Home.maps', {
            title : 'Cartes',
            weight: 1,
            icon     : 'icon-map'
        });


        msNavigationServiceProvider.saveItem('Home.maps.index', {
            title    : 'Cartes disponibles',
            state    : 'app.maps',
            icon     : 'icon-map'

        });
        
        msNavigationServiceProvider.saveItem('Home.maps.create',{
            title    : 'Créer Carte',
            state    : 'app.map_create',
            icon     : 'icon-map'
        });
        //======================

        msNavigationServiceProvider.saveItem('Home.layers', {
            title : 'Couches',
            weight: 2,
            icon     : 'icon-layers'
        });

        msNavigationServiceProvider.saveItem('Home.layers.index', {
            title    : 'Couches disponibles',
            state    : 'app.layers',
            icon     : 'icon-layers'

        });
        msNavigationServiceProvider.saveItem('Home.layers.create',{
            title    : 'Créer Couche',
            state    : 'app.layers_create',
            icon     : 'icon-layers'
        });

        msNavigationServiceProvider.saveItem('Home.files', {
            title : 'Fichiers',
            weight: 2,
            icon     : 'icon-file'
        });

        msNavigationServiceProvider.saveItem('Home.files.index', {
            title    : 'Fichiers disponibles',
            state    : 'app.files',
            icon     : 'icon-file'

        });
        msNavigationServiceProvider.saveItem('Home.files.create',{
            title    : 'Créer Fichiers',
            state    : 'app.files_create',
            icon     : 'icon-file'
        });

        msNavigationServiceProvider.saveItem('Home.inv', {
            title : 'Enquêtes',
            weight: 2,
            icon     : 'icon-stackoverflow'
        });

        msNavigationServiceProvider.saveItem('Home.inv.index', {
            title    : 'Enquêtes disponibles',
            state    : 'app.inv',
            icon     : 'icon-stackoverflow'

        });
        msNavigationServiceProvider.saveItem('Home.inv.create',{
            title    : 'Créer Enquête',
            state    : 'app.inv_create',
            icon     : 'icon-stackoverflow'
        });

    }

})();