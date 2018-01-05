(function ()
{
    'use strict';

    angular
        .module('app.dashboards.file')
        .controller('DashboardfileController', DashboardfileController);

    /** @ngInject */
    function DashboardfileController($scope,$state,$mdDialog,$interval,$http,api)
    {
         var vm = this;

        // Data
        vm.layers = api.files.list.query();
        // get count of non approved
        $http({
        method: 'GET',
        url: api.url+'upfiles?where=approve,false&count=true'
            }).then(function successCallback(response) {
             vm.napprovedcount = response.data ;
            });
        // get count of non shared
        $http({
        method: 'GET',
        url: api.url+'upfiles?where=share,false&count=true'
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

       vm.editlayer = function(ev,files,Oprs) {
              $mdDialog.show({
              controller: 'FileDialogController',
              controllerAs: 'FileDialogControllerVm',
              templateUrl: 'app/main/dashboards/files/dialog/fileDialog.html',
              parent: angular.element(document.body),
              targetEvent: ev,
              clickOutsideToClose : true,
              fullscreen: $scope.customFullscreen,// Only for -xs, -sm breakpoints.
                locals: {
                File: files,
                Operation  : Oprs,
                event: ev
                }
                })
                .then(function(answer) {
                  if (answer == "confirme") {
                    api.files.remove.delete({id:files.id})
                    vm.files = vm.files.filter(function(myfile) {
                            return files.id !== myfile.id;
                        });
                  }
                });
        };

       vm.aprovelayer = function(ev,files,Opr){
        $mdDialog.show({
              controller: 'FileDialogController',
              controllerAs: 'FileDialogControllerVm',
              templateUrl: 'app/main/dashboards/files/dialog/fileDialog.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose : true,
        fullscreen: $scope.customFullscreen,// Only for -xs, -sm breakpoints.
          locals: {
          File: files,
          Operation  : Opr,
          event: ev
          }
          })
          .then(function(answer) {
            if (answer == "confirme") {
              api.files.approve.get({id:files.id});
              $state.go('app.dashboards_file');
            }
          });
       }

        vm.sharelayer = function(ev,files,Opr){
        $mdDialog.show({
              controller: 'FileDialogController',
              controllerAs: 'FileDialogControllerVm',
              templateUrl: 'app/main/dashboards/files/dialog/fileDialog.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose : true,
        fullscreen: $scope.customFullscreen,// Only for -xs, -sm breakpoints.
          locals: {
          File: files,
          Operation  : Opr,
          event: ev
          }
          })
          .then(function(answer) {
            if (answer == "confirme") {
              api.files.share.get({id:files.id});
              $state.reload('app.dashboards_layer');
            }
          });
       }

       vm.putlayer = function(ev,files,Oprs) {
              $mdDialog.show({
              controller: 'FileDialogController',
              controllerAs: 'FileDialogControllerVm',
              templateUrl: 'app/main/dashboards/files/dialog/fileEditDialog.html',
              parent: angular.element(document.body),
              targetEvent: ev,
              clickOutsideToClose : true,
              fullscreen: $scope.customFullscreen,// Only for -xs, -sm breakpoints.
                locals: {
                File: files,
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