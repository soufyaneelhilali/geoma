(function ()
{
    'use strict';

    angular
        .module('app.home.layers')
        .controller('PreviewController', PreviewController);

    /** @ngInject */
    function PreviewController(File,$controller,event,$mdDialog,api,sessionService,$state,$resource,$scope,$stateParams,$http,notifyService)
    { 
     
    
        var vm = this;
        $scope.file = File;

            $scope.answer = function(answer) {
             console.log('answeransweranswer');
              $mdDialog.hide(answer);
            };


        //===================== End Of Preview Dialog =============

    }




//====== End Of File =======
})();