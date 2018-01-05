(function () 
{ 
    'use strict';

    angular
        .module('app.apps',
            [
              'app.apps.scrumboard',
                'app.apps.calendar'
            ]
        )
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        // Navigation

        msNavigationServiceProvider.saveItem('app', {
            title : 'APPLICATIONS',
            group : true,
            weight: 2
        });


        // Navigation
        msNavigationServiceProvider.saveItem('app.calendar', {
            title : 'Calendrier',
            icon  : 'icon-calendar-today',
            state : 'app.calendar',
            weight: 1
        });

        // Navigation
        msNavigationServiceProvider.saveItem('app.scrumboard', {
            title : 'Scrumboard',
            icon  : 'icon-trello',
            state : 'app.scrumboard.boards',
            weight: 2
        });
        
    }
/*        msNavigationServiceProvider.saveItem('Home.maps', {
            title : 'Cartes',
            weight: 1,
            icon     : 'icon-map'
        });*/

})();