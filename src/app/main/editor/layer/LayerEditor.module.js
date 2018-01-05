(function ()
{
    'use strict';

    angular
        .module('app.editor.LayerEditor', [
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
            .state('app.editor_LayerEditor', {
                url    : '/layereditor',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/editor/Layer/LayerEditor.html',
                        controller : 'LayerEditorController as vm'
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

    }
})();