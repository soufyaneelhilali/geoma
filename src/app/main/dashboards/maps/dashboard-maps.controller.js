(function ()
{
    'use strict';

    angular
        .module('app.dashboards.maps')
        .controller('DashboardmapsController', DashboardmapsController);

    /** @ngInject */
    function DashboardmapsController($scope,$mdDialog,$state,$interval,$http,api)
    {
        var vm = this;

        vm.maps = api.maps.list.query();
        console.log(vm.maps)
        // get count of non approved
        $http({
        method: 'GET',
        url: api.url+'maps?where=approve,false&count=true'
            }).then(function successCallback(response) {
             vm.napprovedcount = response.data ;
            });
        // get count of non shared
        $http({
        method: 'GET',
        url: api.url+'maps?where=share,false&count=true'
            }).then(function successCallback(response) {
             vm.nsharedcount = response.data ;
            });

        vm.dtInstance = {};
        vm.dtOptions = {
            dom         : 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
            initComplete: function ()
            {
                var api = this.api(),
                    searchBox = angular.element('body').find('#e-commerce-products-search');

                // Bind an external input as a table wide search box
                if ( searchBox.length > 0 )
                {
                    searchBox.on('keyup', function (event)
                    {
                        api.search(event.target.value).draw();
                    });
                }
            },
            pagingType  : 'simple',
            lengthMenu  : [10, 20, 30, 50, 100],
            pageLength  : 20,
            scrollY     : 'auto',
            responsive  : true
        };

        // Methods
            //=====================Dialog Preview maps ==============

       vm.editmap = function(ev,Maps,Oprs) {
              $mdDialog.show({
              controller: 'MapDialogController',
              controllerAs: 'MapDialogControllerVm',
              templateUrl: 'app/main/dashboards/maps/dialog/MapDialog.html',
              parent: angular.element(document.body),
              targetEvent: ev,
              clickOutsideToClose : true,
              fullscreen: $scope.customFullscreen,// Only for -xs, -sm breakpoints.
                locals: {
                Layer: Maps,
                Operation  : Oprs,
                event: ev
                }
                })
                .then(function(answer) {
                  if (answer == "confirme") {
                    //api.maps.remove.delete({id:Maps.id})
                    vm.maps = vm.maps.filter(function(mymap) {
                            return mymap.id !== Maps.id;
                        });
                  }
                });
        };

       vm.putmap = function(ev,Maps,Oprs) {
              $mdDialog.show({
              controller: 'MapEditDialogController',
              controllerAs: 'MapEditDialogControllerVm',
              templateUrl: 'app/main/dashboards/maps/dialog/MapEditDialog.html',
              parent: angular.element(document.body),
              targetEvent: ev,
              clickOutsideToClose : true,
              fullscreen: $scope.customFullscreen,// Only for -xs, -sm breakpoints.
                locals: {
                EMap: Maps,
                Operation  : Oprs,
                event: ev
                }
                })
                .then(function(answer) {
                  if (answer == "confirme") {
                  }
                });
        };

       vm.aprovemap = function(ev,Maps,Opr){
        $mdDialog.show({
        controller: 'LayerDialogController',
        controllerAs: 'LayerDialogControllerVm',
        templateUrl: 'app/main/dashboards/layers/dialog/LayerDialog.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose : true,
        fullscreen: $scope.customFullscreen,// Only for -xs, -sm breakpoints.
          locals: {
          Layer: Maps,
          Operation  : Opr,
          event: ev
          }
          })
          .then(function(answer) {
            if (answer == "confirme") {
              api.maps.approve.get({id:Maps.id});
            }
          });
       }

        vm.sharemap = function(ev,maps,Opr){
        $mdDialog.show({
        controller: 'LayerDialogController',
        controllerAs: 'LayerDialogControllerVm',
        templateUrl: 'app/main/dashboards/layers/dialog/LayerDialog.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose : true,
        fullscreen: $scope.customFullscreen,// Only for -xs, -sm breakpoints.
          locals: {
          Layer: maps,
          Operation  : Opr,
          event: ev
          }
          })
          .then(function(answer) {
            if (answer == "confirme") {
              api.maps.share.get({id:maps.id});
            }
          });
       }

    //===================== End Of Preview Dialog =============
        //////////

    }

})();