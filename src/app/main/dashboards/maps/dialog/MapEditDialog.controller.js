(function ()
{
    'use strict';

    angular
        .module('app.dashboards.maps')
        .controller('MapEditDialogController',MapEditDialogController);

        /** @ngInject */
    function MapEditDialogController($mdDialog,EMap,api,$q,$timeout,$document,$mdSidenav,sessionService,$state,$resource,$scope,$stateParams,$http,notifyService)
    { 
      
        var vm = this;

        $scope.answer = function(answer) {
            if (answer=="confirme") {
                notifyService.notify("error","Opération effectué avec succès","icon-view-list","top right");
            }
          $mdDialog.hide(answer);
        };

        EMap.attributs =[{"key": "nom", "value": "elhilali"},
        {"key": "prenom", "value": "soufiane"},
        {"key": "fonction", "value": "etudiant"},
        {"key": "fonction", "value": "etudiant"},
        {"key": "fonction", "value": "etudiant"},
        {"key": "fonction", "value": "etudiant"},
        {"key": "fonction", "value": "etudiant"},
        {"key": "fonction", "value": "etudiant"},
        {"key": "fonction", "value": "etudiant"},
        {"key": "fonction", "value": "etudiant"},
        {"key": "fonction", "value": "etudiant"},
        {"key": "fonction", "value": "etudiant"},
        {"key": "fonction", "value": "etudiant"},
        {"key": "fonction", "value": "etudiant"}]

        $scope.maps = EMap;

        console.log($scope.maps.attributs[1].key)
        // geting the list of layers 
        vm.load_activated = false;
        vm.newMap = {attributes:[],selectedlayers:[]};
        vm.firstname = sessionService.get('firstname');
        $scope.userid = sessionService.get('id');

        
        vm.sendForm = function ()
        {
            console.log(vm.newMap);
            vm.layerbycat  = [];
            vm.newMap.attributes = [];
            vm.newMap.selectedlayers = [];
        }

//====== End Of File =======
    }

})();