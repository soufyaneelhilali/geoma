(function ()
{
    'use strict';

    angular
        .module('app.home.layers')
        .controller('LayersController', LayersController);

    /** @ngInject */
    function LayersController($window,$mdDialog,api,LayerList,$q,$timeout,$document,$mdSidenav,sessionService,$state,$resource,$scope,$stateParams,$http,notifyService)
    { 

        // initializing controller variables & objects
        var vm = this;
        // geting the list of layers 
		    $scope.geoserverUrl = api.GeoserverUrl;
        vm.alllayers = LayerList.data;
        vm.load_activated = false;
        $scope.nextpage = 2;
        vm.firstname = sessionService.get('firstname');

        //==Dialog Variables ==//
        $scope.status = '  ';
        $scope.customFullscreen = false;

        // populating category liste 
        vm.categories = api.categories.list.query();

        vm.filterbydatevalue = "asc";

        vm.selected_category=0;
        vm.selected_user=0;

        vm.autocompletlist = api.layers.autocomplet.query();

        vm.clarfilter = function(){
            vm.selected_category = 0;
            vm.selected_user=0;
            vm.filterbydatevalue = "asc";
            vm.alllayers = LayerList.data;
            $scope.nextpage = 2;
        }
		
        $scope.downloadshp = function(layer) {
          console.log(layer);
          $window.open($scope.geoserverUrl + '/ows?service=WFS&version=1.0.0&request=GetFeature&typeName='+layer.store+':'+layer.table_name+'&outputFormat=SHAPE-ZIP');
        };
        
        $scope.downloadtiff = function(layer) {
          console.log(layer);
          $window.open($scope.geoserverUrl + '/wms/reflect?layers='+layer.store+':'+layer.table_name);
        };

        $scope.downloadpdf = function(layer) {
          console.log(layer);
          $window.open($scope.geoserverUrl +'wcs/reflect?layers='+layer.store+':'+layer.table_name+'&format=image/tiff');

        };
        vm.filterbydate = function(order){

            vm.filterbydatevalue = order;
            if (order=='asc') {
              vm.alllayers = LayerList.data;

            }else{
              console.log(order)
                    api.layers.paginate.get({orderby:'updated_at',order:vm.filterbydatevalue,paginate:5,page:1},function(result){
                    vm.alllayers = result.data;
                    $scope.nextpage = 2;              
                      });
            }
        }

        vm.filterbyuser = function(filter){
            if (filter==0) {
                vm.selected_user = sessionService.get('id');
                vm.getfilterbyuser();
            }else{
                vm.selected_user = 0;
                vm.alllayers = LayerList.data;
            }
        }

        vm.filterbycategory = function(category_id){
            
             vm.selected_category = category_id;
             vm.filtered_nextpage = 1
             vm.load_activated = true;

             api.layers.getbycategory.get({id:category_id,orderby:'updated_at',order:vm.filterbydatevalue,paginate:5,page:1},function(result){
                
                if( result.data.length   > 0 )         
                {
                    vm.alllayers = result.data;
                    //console.log(vm.allmaps);
                    $scope.nextpage ++;
                }else{

                  notifyService.notify("error","Pas de Cartes a Afficher pour ce Thème! ","icon-view-list");

                }
                
                });
          
                  setTimeout(function() {
                    vm.load_activated = false;
                  }, 1000);
        }

        vm.loadmorefilterbycategory = function(category_id){
            //console.log('loadmorebyfilter');
            vm.load_activated = true;
            vm.filtered_nextpage++;
            api.maps.getbycategory.get({id:vm.selected_category,orderby:'updated_at',order:vm.filterbydatevalue,paginate:5,page:vm.filtered_nextpage},function(result){
            
            if( result.data.length   > 0 )         
            {
                vm.alllayers = _.concat(vm.alllayers,result.data);
                //console.log(vm.allmaps);
                //console.log(result);
            }else{

              notifyService.notify("error","Pas de Cartes a Afficher pour ce Thème! ","icon-view-list");

            }
            
             });
      
             setTimeout(function() {
            vm.load_activated = false;
            }, 1000);
        }

       vm.getfilterbyuser = function(){
            
             vm.selected_user = sessionService.get('id');
             vm.filtereduser_nextpage = 1
             vm.load_activated = true;

             api.layers.getbyuser.get({id:vm.selected_user,orderby:'updated_at',order:vm.filterbydatevalue,paginate:5,page:1},function(result){
                
                if( result.data.length  > 0 )         
                {
                    vm.alllayers = result.data;
                }else{

                  notifyService.notify("error","Pas de Cartes a Afficher pour cet utilisateur! ","icon-view-list");

                }
                
                });
          
                  setTimeout(function() {
                    vm.load_activated = false;
                  }, 1000);
        }

        vm.loadmorefilterbyuser = function(){
            vm.load_activated = true;
            vm.filtereduser_nextpage++;
            api.layers.getbyuser.get({id:vm.selected_user,orderby:'updated_at',order:vm.filterbydatevalue,paginate:5,page:vm.filtereduser_nextpage},function(result){
            if( result.data.length   > 0 )         
            {
                vm.alllayers = _.concat(vm.alllayers,result.data);
                //console.log(vm.allmaps);
            }else{

              notifyService.notify("error","Pas de Cartes a Afficher pour cet utilisateur! ","icon-view-list");
            }
             });
      
             setTimeout(function() {
            vm.load_activated = false;
            }, 1000);
        }


        vm.toggleSidenav = function(sidenavId)
            {
                $mdSidenav(sidenavId).toggle();
            }

        vm.search = function(query){
           var filtered = [],
                deferred = $q.defer();

            if ( query )
            {
                filtered = vm.autocompletlist.filter(function (item)
                {
                    if ( angular.lowercase(item.description).search(angular.lowercase(query)) > -1)
                    {
                        return true;
                    }
                });
            }

            // Fake service delay
            $timeout(function ()
            {
                deferred.resolve(filtered);
            }, 1000);

            return deferred.promise;
        }

          vm.searchResultClick = function(item){
            vm.search_next = 2;
            console.log(item.name)   
            console.log(item.description)   
            if (item.name='') {
                api.layers.search.get({paginate:5,page:1,kw:item},function(result){
                      vm.searchlayers = result.data 
                      console.log(vm.searchlayers)              
                });
            }else{

                api.layers.search.get({paginate:5,page:1,kw:item.description},function(result){
                      vm.searchlayers = result.data   
                      console.log(vm.searchlayers)                
                });
            }

        }

          //load more Layers to the page
         $scope.load_more =  function (){

                if(vm.selected_user == sessionService.get('id')){
                    vm.loadmorefilterbyuser();
                    return;
                }

                  vm.load_activated = true;
                  api.layers.paginate.get({orderby:'updated_at',order:vm.filterbydatevalue,paginate:5,page:$scope.nextpage},function(result){
                  
                  if( result.data.length   > 0 )         
                  {
                      vm.alllayers = _.concat(vm.alllayers,result.data)                     
                      $scope.nextpage ++;

                  }else{
                      notifyService.notify("error","Toutes les couches sont affiché ","icon-view-list");
                  }

                  vm.load_activated = false;
                });
         }


         $scope.load_more_search =  function (){
              vm.load_activated = true;
              api.layers.paginate.get({paginate:5,page:vm.search_next,kw:item.description},function(result){
              if( result.data.length   > 0 )         
              {
                  vm.searchlayers = _.concat(vm.searchlayers,result.data)                     
                  vm.search_next ++;

              }else{
                  notifyService.notify("error","Toutes les couches sont affiché ","icon-view-list");
              }

              vm.load_activated = false;
            });
         }
         $scope.search = function(searchtext){
          //vm.alllayers
         }


        function parsedate(list){
          angular.forEach(list, function(value, key){
            value.created_at = new Date(value.created_at);
          });
          return list;
        }


        //=====================Dialog Preview Layers ==============

           vm.PreviewLayer = function(ev,layer) {

                  $mdDialog.show({
                  controller: 'PreviewlrController',
                  controllerAs: 'PreviewlrControllerVm',
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
            function on_load()
            {

            }
            on_load();
           

        //===================== End Of Preview Dialog =============

    }




//====== End Of File =======
})();