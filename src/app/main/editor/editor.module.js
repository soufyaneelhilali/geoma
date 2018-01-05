(function ()
{
    'use strict';
 
    angular
        .module('app.editor',
            [
                'app.editor.MapEditor',
                'app.editor.LayerEditor'
            ]
        )
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        // Navigation
 /*        msNavigationServiceProvider.saveItem('editor', {
                    title : 'editor',
                    group : true,
                    weight: 3
                });

                msNavigationServiceProvider.saveItem('editor.map', {
                    title : 'editor',
                    icon  : 'icon-tile-four',
                    group : false,
                    weight: 1
                });

                msNavigationServiceProvider.saveItem('editor.map.mapeditor', {
                    title: 'mapeditor',
                    icon  : 'icon-lastfm',
                    state: 'app.editor_MapEditor'
                });*/
    }

})();