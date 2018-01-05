(function ()
{
    'use strict';

    angular
        .module('app.dashboards.layer')
        .controller('DashboardlayerController', DashboardlayerController);

    /** @ngInject */
    function DashboardlayerController($scope,$state,$mdDialog,$interval,$http,api)
    {
         var vm = this;

        // Data
        vm.layers = api.layers.list.query();
        // get count of non approved
        $http({
        method: 'GET',
        url: api.url+'layers?where=approve,false&count=true'
            }).then(function successCallback(response) {
             vm.napprovedcount = response.data ;
            });
        // get count of non shared
        $http({
        method: 'GET',
        url: api.url+'layers?where=share,false&count=true'
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
            //=====================Dialog ==============

       vm.editlayer = function(ev,layers,Oprs) {
              $mdDialog.show({
              controller: 'LayerDialogController',
              controllerAs: 'LayerDialogControllerVm',
              templateUrl: 'app/main/dashboards/layers/dialog/LayerDialog.html',
              parent: angular.element(document.body),
              targetEvent: ev,
              clickOutsideToClose : true,
              fullscreen: $scope.customFullscreen,// Only for -xs, -sm breakpoints.
                locals: {
                Layer: layers,
                Operation  : Oprs,
                event: ev
                }
                })
                .then(function(answer) {
                  if (answer == "confirme") {
                    api.layers.remove.delete({id:layers.id})
                    vm.layers = vm.layers.filter(function(mylayer) {
                            return layers.id !== mylayer.id;
                        });
                  }
                });
        };

       vm.aprovelayer = function(ev,layers,Opr){
        $mdDialog.show({
        controller: 'LayerDialogController',
        controllerAs: 'LayerDialogControllerVm',
        templateUrl: 'app/main/dashboards/layers/dialog/LayerDialog.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose : true,
        fullscreen: $scope.customFullscreen,// Only for -xs, -sm breakpoints.
          locals: {
          Layer: layers,
          Operation  : Opr,
          event: ev
          }
          })
          .then(function(answer) {
            if (answer == "confirme") {
              api.layers.approve.get({id:layers.id});
              $state.go('app.dashboards_layer');
            }
          });
       }

        vm.sharelayer = function(ev,layers,Opr){
        $mdDialog.show({
        controller: 'LayerDialogController',
        controllerAs: 'LayerDialogControllerVm',
        templateUrl: 'app/main/dashboards/layers/dialog/LayerDialog.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose : true,
        fullscreen: $scope.customFullscreen,// Only for -xs, -sm breakpoints.
          locals: {
          Layer: layers,
          Operation  : Opr,
          event: ev
          }
          })
          .then(function(answer) {
            if (answer == "confirme") {
              api.layers.share.get({id:layers.id});
              $state.reload('app.dashboards_layer');
            }
          });
       }

       vm.putlayer = function(ev,Layers,Oprs) {
              $mdDialog.show({
              controller: 'LayerEditDialogController',
              controllerAs: 'LayerEditDialogControllerVm',
              templateUrl: 'app/main/dashboards/layers/dialog/LayerEditDialog.html',
              parent: angular.element(document.body),
              targetEvent: ev,
              clickOutsideToClose : true,
              fullscreen: $scope.customFullscreen,// Only for -xs, -sm breakpoints.
                locals: {
                Elayer: Layers,
                Operation  : Oprs,
                event: ev
                }
                })
                .then(function(answer) {
                  if (answer == "confirme") {
                    //waiting for end point
                    $state.reload('app.dashboards_layer');
                    console.log('yes remove')
                  }
                });
        };
    //===================== End Of Preview Dialog =============
    }
})();