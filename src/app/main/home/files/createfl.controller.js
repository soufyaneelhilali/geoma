(function ()
{
    'use strict';

    angular
        .module('app.home.files')
        .controller('CreateflController', CreateflController);

    /** @ngInject */
    function CreateflController($mdDialog,api,$q,$timeout,$document,$mdSidenav,sessionService,$state,$resource,$scope,$stateParams,$http,notifyService)
    { 

        // initializing controller variables & objects
        var vm = this;
        // geting the list of layers 
        vm.load_activated = false;
        vm.newfile = {}; 
        $scope.nextpage = 2;
        vm.firstname = sessionService.get('firstname');
        vm.newLayer = {};
        vm.newLayer.filename = "Aucun fichier n'a été choisi";
        $scope.filesize = "00.00 Mb"
        $scope.userid = sessionService.get('id');
        vm.pb = false;

        //==Dialog Variables ==//
        $scope.status = '  ';
        $scope.customFullscreen = false;

        // populating category liste 
        vm.categories = api.categories.list.query();

        
        //select file for upload
         $scope.upload = function () {

            angular.element(document.querySelector('#fileInput')).click();
          };


        vm.sendForm = function (file)
        {
            vm.pb = true;
            api.files.upload(vm.newfile,file).then(function(result){
          setTimeout(function() {
            $scope.$apply(function() {
              
            })
            vm.pb = false;
          }, 1000);

            });
            //
        }
    


        vm.removeAttribute = function(index) { 
          console.log(index);
          vm.newLayer.attributs.splice(index,1);
          console.log("removed");  
        }


        $scope.handleFileSelect= function(files) {
          console.log(files[0].name);
          setTimeout(function() {
            $scope.$apply(function() {
              vm.newfile.filename = files[0].name;
              $scope.filesize = formatBytes(files[0].size);
              vm.newfile.filesize = $scope.filesize;
            })

          }, 1000);

        };
          // format file size
        function formatBytes(bytes,decimals) {
           if(bytes == 0) return '0 Bytes';
           var k = 1000,
               dm = decimals || 2,
               sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
               i = Math.floor(Math.log(bytes) / Math.log(k));
           return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
        }
   vm.PreviewLayer = function(ev) { 

          $mdDialog.show({
          controller: 'PreviewController',
          controllerAs: 'PreviewControllerVm',
          templateUrl: 'app/main/home/files/dialog/Previewfile.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose : true,
          fullscreen: $scope.customFullscreen,// Only for -xs, -sm breakpoints.
            locals: {
            event: ev
            }
            })
            .then(function(answer) {
              $scope.status = 'You said the information was "' + answer + '".';
            }, function() {
              $scope.status = 'You cancelled the dialog.';
            });
    };

    }





//====== End Of File =======
})();