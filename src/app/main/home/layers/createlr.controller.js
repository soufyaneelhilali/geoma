(function ()
{
    'use strict';

    angular
        .module('app.home.layers')
        .controller('CreatelrController', CreatelrController);

    /** @ngInject */
    function CreatelrController($mdDialog,api,$q,$timeout,$document,$mdSidenav,sessionService,$state,$resource,$scope,$stateParams,$http,notifyService)
    { 

        // initializing controller variables & objects
        var vm = this;
        // geting the list of layers 
        vm.load_activated = false;
        vm.newLayer = {attributs:[]}; 
        $scope.nextpage = 2;
        vm.firstname = sessionService.get('firstname');
        vm.newLayer.filename = "Aucun fichier n'a été choisi";
        $scope.filesize = "00.00 Mb"
        $scope.userid = sessionService.get('id');
        $scope.pb = false;
        //==Dialog Variables ==//
        $scope.status = '  ';
        $scope.customFullscreen = false;

        // populating category liste 
        vm.categories = api.categories.list.query();

        
        //select file for upload
         $scope.upload = function () {
            angular.element(document.querySelector('#fileInput')).click();
          };

     
         // i have to create a specific controller for adding layers
        vm.addAttribute = function (newCople) {
            console.log(newCople.key)
          if (newCople.key=="" || newCople.value=="") {

            newCople.key="";
            newCople.value="";
            notifyService.notify("error","entrez des données! ","icon-view-list");

            }else{
              
            vm.newLayer.attributs.push(newCople);
            vm.attribute = {};

            }

        }
        

        vm.sendForm = function (file)
        {
          vm.newLayer.attributs = JSON.stringify(vm.newLayer.attributs);
          $scope.pb = true;
            api.layers.upload(vm.newLayer,file)
                .then(function(result){
                    console.log(result,'true?');
                              $scope.pb = false;
            })

        }
    
    

        vm.removeAttribute = function(index) { 
          //var index = vm.newLayer.attributes.indexOf(item,1);
          console.log(index);
          vm.newLayer.attributs.splice(index,1);
          console.log("removed");  
        }

            vm.Uploadlayer = function(){

                var importer = $resource('http://localhost:8085/geoserver/rest/imports',{}, {
                        get: {
                            method: 'GET',
                            headers: {
                                'Authorization': "Basic YWRtaW46Z2Vvc2VydmVy",
                                'Accept': 'application/json'}
                             }
                        });

                vm.result = importer.get();

                console.log(vm.result);
        }

        $scope.handleFileSelect= function(files) {

          setTimeout(function() {
            $scope.$apply(function() {
              vm.newLayer.filename = files[0].name;
              $scope.filesize = formatBytes(files[0].size);
              vm.newLayer.filesize = files[0].size;
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


    }




//====== End Of File =======
})();