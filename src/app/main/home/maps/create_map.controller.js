(function ()
{
    'use strict';

    angular
        .module('app.home.maps')
        .controller('CreatemapController', CreatemapController);

    /** @ngInject */
    function CreatemapController($mdDialog,api,$q,$timeout,$document,$mdSidenav,sessionService,$state,$resource,$scope,$stateParams,$http,notifyService)
    { 

        // initializing controller variables & objects
        var vm = this;
        // geting the list of layers 
        vm.load_activated = false;
        vm.newMap = {attributes:[],selectedlayers:[]};
        vm.firstname = sessionService.get('firstname');
        $scope.userid = sessionService.get('id');

        //==Dialog Variables ==//
        $scope.status = '  ';
        $scope.customFullscreen = false;
        

        // populating themes liste 
        vm.themes = api.themes.list.query();
        vm.categories = api.categories.list.query();

      
     
         // i have to create a specific controller for adding layers
        vm.addAttribute = function (newCople) {
            console.log(newCople.key)
          if (newCople.key=="" || newCople.value=="") {

            newCople.key="";
            newCople.value="";
            notifyService.notify("error","entrez des données! ","icon-view-list");

            }else{
              
            vm.newMap.attributes.push(newCople);
            console.log(vm.newMap.attributes);
            vm.attribute = {};

            }

        }
        
        vm.sendForm = function ()
        {
            var layers_ids = [];
            angular.forEach(vm.newMap.selectedlayers,function(layer){
                layers_ids.push(layer.id);
            });
            api.maps.store({
                'name':vm.newMap.name,
                'description':vm.newMap.description,
                'attributs':JSON.stringify(vm.newMap.attributes),
                'theme_id':vm.newMap.theme_id,
                'approve':false,
                'share':false
            }).then(function(result){
                api.maps.affect({
                    'layers':layers_ids
                },result.data.id)
                    .then(function(result){
                        console.log(result)
                        notifyService.notify("success","La carte a été bien crée","icon-check-circle");
                    },function(err){
                      notifyService.notify("error","La carte n'été pas bien crée ("+ err +")","icon-close-circle");
                    })
            },function(err){
                console.log(err);
            })
            /*vm.layerbycat  = [];
            vm.newMap.attributes = [];
            vm.newMap.selectedlayers = [];*/
        }

        vm.removeAttribute = function(index) { 
          //var index = vm.newLayer.attributes.indexOf(item,1);
          console.log(index);
          vm.newMap.attributes.splice(index,1);
          console.log("removed");  
        }

        vm.removelayer = function(index) { 
          //var index = vm.newLayer.attributes.indexOf(item,1);
          console.log(index);
          vm.newMap.selectedlayers.splice(index,1);
          console.log("removed");  
        }

       vm.removelayerfromlist = function(layer) { 
        _.remove(vm.layerbycat, {
            id: layer.id
        });
        }

        $scope.selectlayer = function(layer){
            vm.newMap.selectedlayers.push(layer);
        }

        $scope.getlayerbycat = function(id_cat){
             api.layers.bycategory.query({id:id_cat},function(result){
                
                if( result.length   > 0 )         
                {
                    vm.layerbycat  = result;
                    console.log(vm.layerbycat);
                    $scope.nextpage ++;
                }else{
                    vm.layerbycat  = [];
                  notifyService.notify("error","nous n'avons pas de Couches pour cette catégorie! ","icon-layers","bottom right");
                }
                
                });
        }

        //=====================Dialog Preview Layers ==============

           vm.PreviewLayer = function(ev,layer) {

                  $mdDialog.show({
                  controller: 'PreviewController',
                  controllerAs: 'PreviewControllerVm',
                  templateUrl: 'app/main/home/layers/dialog/PreviewLayer.html',
                  parent: angular.element(document.body),
                  targetEvent: ev,
                  clickOutsideToClose : true,
                  fullscreen: $scope.customFullscreen,// Only for -xs, -sm breakpoints.
                    locals: {
                    Layer: layer,
                    event: ev
                    }
                    })
                    .then(function(answer) {
                      $scope.status = 'You said the information was "' + answer + '".';
                    }, function() {
                      $scope.status = 'You cancelled the dialog.';
                    });
            };


        //===================== End Of Preview Dialog =============


    }




//====== End Of File =======
})();