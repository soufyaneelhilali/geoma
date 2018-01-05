(function ()
{
    'use strict';

    angular
        .module('app.editor.LayerEditor')
        .controller('LayerEditorController', LayerEditorController);

    /** @ngInject */
    function LayerEditorController($document,$state,$window,$mdSidenav,leafletData,$controller,$mdDialog,api,sessionService,$resource,$scope,$stateParams,$http,notifyService)
    {

        var vm = this;

        $scope.id_map = sessionService.get('Layer_id');

      //get active map data
        api.layers.getById.get({id:25},function(result){
            vm.layer= result;
            leafletData.getMap().then(function(map) {
                $scope.map = map;
                  var wmsLayer = L.tileLayer.betterWms(api.GeoserverUrl+vm.layer.workspace+'/wms?', {
                      layers: vm.layer.store+':'+vm.layer.table_name,
                      format: 'image/png',
                      transparent: true
                  }).addTo(map)
                  vm.layer.wms =  wmsLayer;
                  vm.layer.visible = true;
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
            scale: true
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
    }

    L.TileLayer.BetterWMS = L.TileLayer.WMS.extend({
      
      onAdd: function (map) {
        // Triggered when the layer is added to a map.
        //   Register a click listener, then do all the upstream WMS things
        L.TileLayer.WMS.prototype.onAdd.call(this, map);
        map.on('click', this.getFeatureInfo, this);
      },
      
      onRemove: function (map) {
        // Triggered when the layer is removed from a map.
        //   Unregister a click listener, then do all the upstream WMS things
        L.TileLayer.WMS.prototype.onRemove.call(this, map);
        map.off('click', this.getFeatureInfo, this);
      },
      
      getFeatureInfo: function (evt) {
        // Make an AJAX request to the server and hope for the best
        var url = this.getFeatureInfoUrl(evt.latlng),
            showResults = L.Util.bind(this.showGetFeatureInfo, this);
        $.ajax({
          url: url,
          success: function (data, status, xhr) {
            var err = typeof data === 'string' ? null : data;
            showResults(err, evt.latlng, data);
          },
          error: function (xhr, status, error) {
            showResults(error);  
          }
        });
      },
      
      getFeatureInfoUrl: function (latlng) {
        // Construct a GetFeatureInfo request URL given a point
        var point = this._map.latLngToContainerPoint(latlng, this._map.getZoom()),
            size = this._map.getSize(),
            
            params = {
              request: 'GetFeatureInfo',
              service: 'WMS',
              srs: 'EPSG:4326',
              styles: this.wmsParams.styles,
              transparent: this.wmsParams.transparent,
              version: this.wmsParams.version,      
              format: this.wmsParams.format,
              bbox: this._map.getBounds().toBBoxString(),
              height: size.y,
              width: size.x,
              layers: this.wmsParams.layers,
              query_layers: this.wmsParams.layers,
              info_format: 'application/json'
            };
        
        params[params.version === '1.3.0' ? 'i' : 'x'] = point.x;
        params[params.version === '1.3.0' ? 'j' : 'y'] = point.y;
        
        return this._url + L.Util.getParamString(params, this._url, true);
      },
      
      showGetFeatureInfo: function (err, latlng, content) {
        if (err) { console.log(err); return; } // do nothing if there's an error
        $scope.content = content.features;
        // Otherwise show the content in a popup, or something.
        L.popup({ maxWidth: 800})
          .setLatLng(latlng)
          .setContent(content)
          .openOn(this._map);
      }
    });

    L.tileLayer.betterWms = function (url, options) {
      return new L.TileLayer.BetterWMS(url, options);  
    };


})();
