(function ()
{
    'use strict';

    angular
        .module('app.dashboards.file')
        .controller('FileDialogController', FileDialogController);

    /** @ngInject */
    function FileDialogController(File,Operation,event,api,$mdDialog,$scope,notifyService)
    { 
      
        
    
        var vm = this;

        $scope.maps = File;
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