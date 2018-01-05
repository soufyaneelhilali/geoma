(function ()
{
    'use strict';

    angular
        .module('app.dashboards.maps')
        .controller('LayerDialogController', LayerDialogController);

    /** @ngInject */
    function LayerDialogController(Layer,Operation,event,api,$mdDialog,$scope,notifyService)
    { 
      
        
    
        var vm = this;

        $scope.maps = Layer;
        $scope.ops = Operation;

            $scope.answer = function(answer) {
                if (answer=="confirme") {
                    notifyService.notify("error","Opération effectué avec succès","icon-view-list","top right");
                }
              $mdDialog.hide(answer);
            };


//====== End Of File =======
    }

})();