(function ()
{
    'use strict';

    angular
        .module('app.home.maps',
            []
        )
        .config(config);

    /** @ngInject */
    function config($stateProvider,msApiProvider,msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.maps', {
                    resolve  : {
                    MapList: function (apiResolver)
                    {
                        return apiResolver.resolve('maps.paginate@get',{'paginate': 10,'page': 1,'orderby':'updated_at','order':'asc'});
                    }
                },
            url      : '/maps',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/home/maps/maps.html',
                    controller : 'MapsController as vm'
                }
            },

            bodyClass: 'maps'

        }).state('app.map_create',{
                    resolve: {
                    checksession : function (sessionService)
                    {
                        //return sessionService.AccessService();
                    },
                },
                url:'/new-map',
                views:{
                    'content@app': {
                        templateUrl: 'app/main/home/maps/create.maps.html',
                        controller : 'CreatemapController as vm'
                    }
                }

            });

        // Api


        //states 
/*        msNavigationServiceProvider.saveItem('Home', {
            title : 'Home',
            group : true,
            weight: 1
        });

        msNavigationServiceProvider.saveItem('Home.maps', {
            title : 'Cartes',
            weight: 1,
            icon     : 'icon-map'
        });


        msNavigationServiceProvider.saveItem('Home.maps.index', {
            title    : 'Cartes disponibles',
            state    : 'app.maps',

        });
        
        msNavigationServiceProvider.saveItem('Home.maps.create',{
            title    : 'Créer Carte',
            state    : 'app.map_create',
        });*/
    }

})();