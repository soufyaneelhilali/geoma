(function ()
{
    'use strict';

    angular
        .module('app.editor.MapEditor')
        .controller('newmapController', newmapController);

    /** @ngInject */
    function newmapController($controller,$mdDialog,api,sessionService,$state,$resource,$scope,$stateParams,$http,notifyService)
    { 
 // initializing controller variables & objects
        var vm = this;
        // geting the list of layers 
        vm.load_activated = false;
        $scope.newmap = {attributes:[],selectedlayers:[]};
        vm.firstname = sessionService.get('firstname');
        $scope.userid = sessionService.get('id');
        $scope.layers = api.layers.list.query();
        //==Dialog Variables ==//

        $scope.status = '  ';
        $scope.customFullscreen = false;
        

        // populating themes liste 
        $scope.themes = api.themes.list.query();
        $scope.categories = api.categories.list.query();


        
        $scope.sendForm = function (newmap)
        {
            api.maps.store({
                'name':$scope.newmap.name,
                'description':$scope.newmap.description,
                'attributs':JSON.stringify({}),
                'theme_id':$scope.newmap.theme_id,
                'approve':false,
                'share':false
            }).then(function(result){
                        goeditor(result.data.id);
                        notifyService.notify("success","La carte a été bien crée","icon-check-circle");
                    },function(err){
                      notifyService.notify("error","La carte n'été pas bien crée ("+ err +")","icon-close-circle");
            })
        }

         function goeditor(map_id){
            sessionService.set('Map_id',map_id);
            console.log(sessionService.get('Map_id'))
            $state.reload('app.editor_MapEditor');
            $mdDialog.hide();
        }

        $scope.selectlayer = function(layer){
            vm.newMap.selectedlayers.push(layer);
        }

        $scope.addlayertomap = function(ev,layer){

          var layers_ids = [];
                layers_ids.push(layer.id);
            api.maps.affect({
                    'layers':layers_ids
                },sessionService.get('Map_id')).then(function(result){
                        goeditor(result.data.id);
                        notifyService.notify("success","La couche a été bien ajuoté a la carte","icon-check-circle");
                    },function(err){
                      notifyService.notify("error","La couche n'été pas bien ajouté ("+ err +")","icon-close-circle");
            })
            console.log(layer);
            $mdDialog.hide();
        }

        $scope.getlayerbycat = function(id_cat){
             api.layers.bycategory.query({id:1},function(result){
                
                if( result.length   > 0 )         
                {
                    $scope.layersbycat  = result;
                    $scope.nextpage ++;
                }else{
                    $scope.layersbycat  = [];
                  notifyService.notify("error","nous n'avons pas de Couches pour cette catégorie! ","icon-layers","bottom right");
                }
                
                });
        }

        $scope.dtlayersoption = {
            dtOptions: {
                dom       : '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
                pagingType: 'simple',
                pageLength: 2,
                lengthMenu: [2,4],
                autoWidth : false,
                responsive: true,
                columnDefs: [
                    {
                        width  : '15%',
                        targets: [0, 1, 2, 3, 4]
                    }
                ]
            }
        };

    }




//====== End Of File =======
})();