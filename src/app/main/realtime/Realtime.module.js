(function ()
{
    'use strict';

    angular
        .module('app.realtime', [
                // 3rd Party Dependencies
                'ng-sortable',
                'textAngular'
            ])
        .config(config);
        
    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider
            .state('app.realtime', {
                url    : '/realtime',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/realtime/realtime.html',
                        controller : 'RealtimeController as vm'
                    }
                },
                resolve  : {
                Tasks: function (msApi)
                {
                    return msApi.resolve('todo.tasks@get');
                },
                Tags : function (msApi)
                {
                    return msApi.resolve('todo.tags@get');
                }
            },
                    bodyClass: 'map'
                //
            });



            // Api
        msApiProvider.register('todo.tasks', ['app/data/todo/tasks.json']);
        msApiProvider.register('todo.tags', ['app/data/todo/tags.json']);

        //navigation
        msNavigationServiceProvider.saveItem('realtime', {
            title : 'Données Temps réel',
            group : true,
            weight: 4
        });

        msNavigationServiceProvider.saveItem('realtime.maps', {
            title    : 'Connecter Pérépherique',
            state    : 'app.realtime',
            icon     : 'icon-satellite-variant'

        });
    }
})();