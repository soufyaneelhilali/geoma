(function ()
{
    'use strict';
    //var _ = require('loadash');
    angular
        .module('app.home.maps')
        .controller('MapsController', MapsController);

    /** @ngInject */
    function MapsController($timeout,$state,$q,$scope,MapList,$mdSidenav,api,$resource,sessionService,notifyService,msNavigationService)
    {
        var vm = this;
        $scope.nextpage = 2;
        $scope.userid = sessionService.get('id');
        vm.load_activated = false;
        vm.allmaps = MapList.data;


        vm.filterbydatevalue = "asc";

        vm.selected_theme=0;
        vm.selected_user=0;
        vm.themes = api.themes.list.query();
        
        vm.autocompletlist = api.maps.autocomplet.query();

        vm.toggleSidenav = function(sidenavId)
            {
                $mdSidenav(sidenavId).toggle();
            }


        vm.clarfilter = function(){
            vm.selected_theme = 0;
            vm.selected_user=0;
            vm.filterbydatevalue = "asc";
            vm.allmaps = MapList.data;
            $scope.nextpage = 2;
            vm.toggleSidenav('filters-sidenav');
        }

        vm.filterbydate = function(order){

            vm.filterbydatevalue = order;
        }

        vm.filterbyuser = function(filter){
            if (filter==0) {
                vm.selected_user = sessionService.get('id');
                vm.getfilterbyuser();
            }else{
                vm.selected_user = 0;
                vm.allmaps = MapList.data;
            }
        }

        //functions for autocomplete
        vm.search = function(query){
            console.log('vm.search')
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

            if (item.name='') {
                vm.searchmaps = api.maps.search.query({kw:item.description});
                console.log(vm.searchmaps);
            }else{
                vm.searchmaps = api.maps.search.query({kw:item.description});
                console.log(vm.searchmaps);
            }

        }

        $scope.load_more = function(){

                if(vm.selected_user==sessionService.get('id')){
                    console.log('vm.selected_user==sessionService.get');
                    vm.loadmorefilterbyuser();
                    return;
                }

                if (vm.selected_theme==0) {
                    console.log('selected_theme == 0')
                vm.load_activated = true;
                api.maps.paginate.get({limit:10,page:$scope.nextpage,orderby:'updated_at',order:vm.filterbydatevalue},function(result){
                        
                        if( result.data.length   > 0 )         
                        {
                            vm.allmaps = _.concat(vm.allmaps,result.data);
                    
                            $scope.nextpage ++;
                        }else{

                          notifyService.notify("error","Toutes les Cartes sont affiché ","icon-view-list");

                        }
               });
                  
                  setTimeout(function() {
                    vm.load_activated = false;
                  }, 1000);

                }else{
                    console.log('no one of these');
                    vm.loadmorefilterbytheme();
                }

             }


        vm.filterbytheme = function(theme_id){
            
             vm.selected_theme = theme_id;
             vm.filtered_nextpage = 1
             vm.load_activated = true;

             api.maps.getbytheme.get({id:theme_id,orderby:'updated_at',order:vm.filterbydatevalue,paginate:10,page:1},function(result){
                
                if( result.data.length   > 0 )         
                {
                    vm.allmaps = result.data;
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

        vm.loadmorefilterbytheme = function(theme_id){
            //console.log('loadmorebyfilter');
            vm.load_activated = true;
            vm.filtered_nextpage++;
            api.maps.getbytheme.get({id:vm.selected_theme,orderby:'updated_at',order:vm.filterbydatevalue,paginate:10,page:vm.filtered_nextpage},function(result){
            
            if( result.data.length   > 0 )         
            {
                vm.allmaps = _.concat(vm.allmaps,result.data);
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

             api.maps.getbyuser.get({id:vm.selected_user,orderby:'updated_at',order:vm.filterbydatevalue,paginate:10,page:1},function(result){
                
                if( result.data.length  > 0 )         
                {
                    vm.allmaps = result.data;
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
            api.maps.getbyuser.get({id:vm.selected_user,orderby:'updated_at',order:vm.filterbydatevalue,paginate:10,page:vm.filtereduser_nextpage},function(result){
            if( result.data.length   > 0 )         
            {
                vm.allmaps = _.concat(vm.allmaps,result.data);
                //console.log(vm.allmaps);
                console.log(result);
            }else{

              notifyService.notify("error","Pas de Cartes a Afficher pour cet utilisateur! ","icon-view-list");
            }
             });
      
             setTimeout(function() {
            vm.load_activated = false;
            }, 1000);
        }

        vm.goeditor = function(map_id){
            
            sessionService.set('Map_id',map_id);
            $state.go('app.editor_MapEditor');

        }




//////////////////////
    }

})();