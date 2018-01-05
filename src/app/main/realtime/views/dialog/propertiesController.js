(function ()
{
    'use strict';

    angular
        .module('app.editor.MapEditor')
        .controller('propertiesController', newmapController);

    /** @ngInject */
    function newmapController($controller,$mdDialog,api,sessionService,$state,$resource,$scope,$stateParams,$http,notifyService,marker)
    {
 // initializing controller variables & objects
        var vm = this;
         $scope.marker = marker;

    }




//====== End Of File =======
})();
