(function ()
{
    'use strict';

    angular
        .module('app.dashboards.maps')
        .controller('LayerEditDialogController',LayerEditDialogController);

        /** @ngInject */
    function LayerEditDialogController($mdDialog,Elayer,api,$q,$timeout,$document,$mdSidenav,sessionService,$state,$resource,$scope,$stateParams,$http,notifyService)
    { 
      
        var vm = this;

        $scope.answer = function(answer) {
            if (answer=="confirme") {
                notifyService.notify("error","Opération effectué avec succès","icon-view-list","top right");
            }
          $mdDialog.hide(answer);
        };

        Elayer.attributs =[{"key": "nom", "value": "elhilali"},
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

        $scope.layers = Elayer;

        console.log($scope.layers.attributs[1].key)
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