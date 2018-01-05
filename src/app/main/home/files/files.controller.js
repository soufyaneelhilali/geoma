(function ()
{
    'use strict';

    angular
        .module('app.home.files')
        .controller('FilesController', FilesController);

    /** @ngInject */
    function FilesController($window,$mdDialog,api,LayerList,$q,$timeout,$document,$mdSidenav,sessionService,$state,$resource,$scope,$stateParams,$http,notifyService)
    { 

        // initializing controller variables & objects
        var vm = this;
        // geting the list of layers 
		    $scope.geoserverUrl = api.GeoserverUrl;
        vm.allfiles = LayerList.data;
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

        vm.autocompletlist = api.files.autocomplet.query();

        vm.clarfilter = function(){
            vm.selected_category = 0;
            vm.selected_user=0;
            vm.filterbydatevalue = "asc";
            vm.allfiles = LayerList.data;
            $scope.nextpage = 2;
        }

            vm.downloadfile = function(fichier)
        {
            $window.open(fichier.link);
        }

        vm.filterbydate = function(order){

            vm.filterbydatevalue = order;
            if (order=='asc') {
              vm.allfiles = LayerList.data;

            }else{
              console.log(order)
                    api.files.paginate.get({orderby:'updated_at',order:vm.filterbydatevalue,paginate:5,page:1},function(result){
                    vm.allfiles = result.data;
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
                vm.allfiles = LayerList.data;
            }
        }

        vm.filterbycategory = function(category_id){
            
             vm.selected_category = category_id;
             vm.filtered_nextpage = 1
             vm.load_activated = true;

             api.files.getbycategory.get({id:category_id,orderby:'updated_at',order:vm.filterbydatevalue,paginate:5,page:1},function(result){
                
                if( result.data.length   > 0 )         
                {
                    vm.allfiles = result.data;
                    //console.log(vm.allmaps);
                    $scope.nextpage ++;
                }else{

                  notifyService.notify("error","Pas de Fichiers a Afficher pour ce Thème! ","icon-view-list");

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
            api.files.getbycategory.get({id:vm.selected_category,orderby:'updated_at',order:vm.filterbydatevalue,paginate:5,page:vm.filtered_nextpage},function(result){
            
            if( result.data.length   > 0 )         
            {
                vm.allfiles = _.concat(vm.allfiles,result.data);
                //console.log(vm.allmaps);
                //console.log(result);
            }else{

              notifyService.notify("error","Pas de Fichiers a Afficher pour ce Thème! ","icon-view-list");

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

             api.files.getbyuser.get({id:vm.selected_user,orderby:'updated_at',order:vm.filterbydatevalue,paginate:5,page:1},function(result){
                
                if( result.data.length  > 0 )         
                {
                    vm.allfiles = result.data;
                }else{

                  notifyService.notify("error","Pas de Fichiers a Afficher pour cet utilisateur! ","icon-view-list");

                }
                
                });
          
                  setTimeout(function() {
                    vm.load_activated = false;
                  }, 1000);
        }

        vm.loadmorefilterbyuser = function(){
            vm.load_activated = true;
            vm.filtereduser_nextpage++;
            api.files.getbyuser.get({id:vm.selected_user,orderby:'updated_at',order:vm.filterbydatevalue,paginate:5,page:vm.filtereduser_nextpage},function(result){
            if( result.data.length   > 0 )         
            {
                vm.allfiles = _.concat(vm.allfiles,result.data);
                //console.log(vm.allmaps);
            }else{

              notifyService.notify("error","Pas de Fichiers a Afficher pour cet utilisateur! ","icon-view-list");
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
            if (item.name='') {
                api.files.search.get({paginate:5,page:1,kw:item},function(result){
                      vm.searchfiles = result.data 
                      console.log(vm.searchfiles)              
                });
            }else{

                api.files.search.get({paginate:5,page:1,kw:item.description},function(result){
                      vm.searchfiles = result.data   
                      console.log(vm.searchfiles)                
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
                  api.files.paginate.get({orderby:'updated_at',order:vm.filterbydatevalue,paginate:5,page:$scope.nextpage},function(result){
                  
                  if( result.data.length   > 0 )         
                  {
                      vm.allfiles = _.concat(vm.allfiles,result.data)                     
                      $scope.nextpage ++;

                  }else{
                      notifyService.notify("error","Toutes les Fichiers sont affiché ","icon-view-list");
                  }

                  vm.load_activated = false;
                });
         }


         $scope.load_more_search =  function (){
              vm.load_activated = true;
              api.files.paginate.get({paginate:5,page:vm.search_next,kw:item.description},function(result){
              if( result.data.length   > 0 )         
              {
                  vm.searchlayers = _.concat(vm.searchlayers,result.data)                     
                  vm.search_next ++;

              }else{
                  notifyService.notify("error","Toutes les Fichiers sont affiché ","icon-view-list");
              }

              vm.load_activated = false;
            });
         }
         $scope.search = function(searchtext){
          //vm.allfiles
         }


        function parsedate(list){
          angular.forEach(list, function(value, key){
            value.created_at = new Date(value.created_at);
          });
          return list;
        }


        //=====================Dialog Preview Layers ==============

           vm.PreviewLayer = function(ev,file) { 

                  $mdDialog.show({
                  controller: 'PreviewController',
                  controllerAs: 'PreviewControllerVm',
                  templateUrl: 'app/main/home/files/dialog/Previewfile.html',
                  parent: angular.element(document.body),
                  targetEvent: ev,
                  clickOutsideToClose : true,
                  fullscreen: $scope.customFullscreen,// Only for -xs, -sm breakpoints.
                    locals: {
                    File: file,
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