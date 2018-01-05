(function ()
{
    'use strict';

    angular
        .module('app.dashboards.file')
        .controller('fileEditDialogController',fileEditDialogController);

        /** @ngInject */
    function fileEditDialogController($mdDialog,File,api,$q,$timeout,$document,$mdSidenav,sessionService,$state,$resource,$scope,$stateParams,$http,notifyService)
    { 
      
        var vm = this;

        $scope.answer = function(answer) {
            if (answer=="confirme") {
                notifyService.notify("error","Opération effectué avec succès","icon-view-list","top right");
            }
          $mdDialog.hide(answer);
        };

        File.attributs =[{"key": "nom", "value": "elhilali"},
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

        $scope.files = File;

        console.log($scope.files.attributs[1].key)
        // geting the list of files 
        vm.load_activated = false;
        vm.newMap = {attributes:[],selectedfiles:[]};
        vm.firstname = sessionService.get('firstname');
        $scope.userid = sessionService.get('id');

        
        vm.sendForm = function ()
        {
            console.log(vm.newMap);
            vm.filebycat  = [];
            vm.newMap.attributes = [];
            vm.newMap.selectedfiles = [];
        }

//====== End Of File =======
    }

})();