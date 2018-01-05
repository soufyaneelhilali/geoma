(function ()
{
    'use strict';

    angular
        .module('app.editor.MapEditor')
        .controller('MapEditorController', MapEditorController);

    /** @ngInject */
    function MapEditorController($document,$state,$window,$mdSidenav,leafletData,$controller,$mdDialog,api,sessionService,$resource,$scope,$stateParams,$http,notifyService)
    {

        var vm = this;

        $scope.id_map = sessionService.get('Map_id');
        console.log($scope.id_map)
        vm.legend = [];
      //get active map data
        api.maps.getById.get({id:$scope.id_map},function(result){
            vm.map = result;

           angular.forEach(vm.map.layers,function(layer,key){
            var legend = {layername:layer.name,
                          legendurl:api.GeoserverUrl+layer.workspace+'/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER='+layer.store+':'+layer.table_name+''};
            vm.legend.push(legend);
          });

            leafletData.getMap().then(function(map) {
                $scope.map = map;

                angular.forEach(vm.map.layers,function(layer,key){
                  var wmsLayer = L.tileLayer.wms(api.GeoserverUrl+layer.workspace+'/wms?', {
                      layers: layer.store+':'+layer.table_name,
                      format: 'image/png',
                      transparent: true
                  }).addTo(map)
                  wmsLayer.setZIndex(key);
                  layer.wms =  wmsLayer;
                  layer.visible = true;
                  console.log(wmsLayer,'layer');
                });


            });
        });

        angular.extend($scope, {

          map : {},

          center : {
          lat: 33.573110,
          lng: -7.589843,
          zoom: 9
          },

          controls: {
              scale: true,
              fullscreen: {
                    position: 'topleft'
              }
          },

          layers :  {
            baselayers: {
                xyz: {
                    name: 'OpenStreetMap (XYZ)',
                    url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                    type: 'xyz'
                }
            }
          }
        });

                   // Wait for center to be stablished
           leafletData.getMap().then(function() {
               angular.extend($scope.controls, {
                   minimap: {
                       type: 'minimap',
                       layer: {
                           name: 'OpenStreetMap',
                           url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                           type: 'xyz'
                       },
                       toggleDisplay: true
                   }
               });

           });

        vm.completed = [];
        vm.colors = ['blue', 'blue-grey', 'orange', 'pink', 'purple'];

        vm.selectedProject = 'creapond';

        // Tasks will be filtered against these models
        vm.taskFilters = {
            search   : '',
            tags     : [],
            completed: '',
            deleted  : false,
            important: '',
            starred  : '',
            startDate: '',
            dueDate  : ''
        };

        vm.taskFiltersDefaults = angular.copy(vm.taskFilters);
        vm.showAllTasks = true;

        vm.taskOrder = '';
        vm.taskOrderDescending = false;

        vm.sortableOptions = {
            handle        : '.handle',
            forceFallback : true,
            ghostClass    : 'todo-item-placeholder',
            fallbackClass : 'todo-item-ghost',
            fallbackOnBody: true,
            sort          : true,
            onEnd: function (/**Event*/evt) {
		              evt.oldIndex;  // element's old index within parent
		              evt.newIndex;  // element's new index within parent
                  angular.forEach(vm.map.layers,function(layer){
                      if(layer.wms.options.zIndex === evt.newIndex)
                      {
                        layer.wms.setZIndex(evt.oldIndex);
                        return evt.model.wms.setZIndex(evt.newIndex);
                      }
                  })

                }

        }
        vm.msScrollOptions = {
            suppressScrollX: true
        };

        //toggle sidenave
        vm.toggleSidenav = function(sidenavId)
        {
            $mdSidenav(sidenavId).toggle();
        }

        //Open taskdialog
        function openTaskDialog(ev, task)
        {
            $mdDialog.show({
                controller         : 'TaskDialogController',
                controllerAs       : 'vm',
                templateUrl        : 'app/main/apps/todo/dialogs/task/task-dialog.html',
                parent             : angular.element($document.body),
                targetEvent        : ev,
                clickOutsideToClose: true,
                locals             : {
                    Task : task,
                    Tasks: vm.tasks,
                    event: ev
                }
            });
        }
        vm.toggleCompleted = function (layer,evt)
        {
          layer.visible = !layer.visible;
          if(layer.visible)
          {
            return $scope.map.addLayer(layer.wms);
          }
          $scope.map.removeLayer(layer.wms);

        }
        vm.bindOpacity = function(layer,opacity)
        {
          var opacityDecimal = opacity != 0 ? opacity / 100 : 0;
          layer.wms.setOpacity(opacityDecimal);
        }

         vm.createMap = function() {

                  $mdDialog.show({
                  controller: 'newmapController',
                  controllerAs: 'newmapControllerVm',
                  templateUrl: 'app/main/editor/map/views/dialog/newmap.html',
                  parent: angular.element(document.body),
                  clickOutsideToClose : true,
                  fullscreen: $scope.customFullscreen,
                      locals: {
                    themes: api.themes.list.query()
                    }
                    })
                    .then(function(answer) {
                      $scope.status = 'You said the information was "' + answer + '".';
                    }, function() {
                      $scope.status = 'You cancelled the dialog.';
                    });
            };

         vm.add_layers = function() {

                  $mdDialog.show({
                  controller: 'newmapController',
                  controllerAs: 'newmapControllerVm',
                  templateUrl: 'app/main/editor/map/views/dialog/addlayers.html',
                  parent: angular.element(document.body),
                  clickOutsideToClose : true,
                  fullscreen: $scope.customFullscreen,
                      locals: {
                    themes: api.themes.list.query()
                    }
                    })
                    .then(function(answer) {
                      $scope.status = 'You said the information was "' + answer + '".';
                    }, function() {
                      $scope.status = 'You cancelled the dialog.';
                    });
            };

           vm.deletelayer = function(ev,layers) {
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
                Operation  : 'supprimer',
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

    }

})();
