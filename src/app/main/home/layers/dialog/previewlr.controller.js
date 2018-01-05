(function ()
{
    'use strict';

    angular
        .module('app.home.layers')
        .controller('PreviewlrController', PreviewlrController);

    /** @ngInject */
    function PreviewlrController(leafletData,$controller,Layer,event,$mdDialog,api,sessionService,$state,$resource,$scope,$stateParams,$http,notifyService)
    { 
      
       $scope.center= {
        lat: 33.573110,
        lng: -7.589843,
        zoom: 7
      }

      $scope.map = {};
      
        leafletData.getMap().then(function(map) {
            $scope.map = map;
              var wmsLayer = L.tileLayer.wms(api.GeoserverUrl+Layer.workspace+'/wms?', {
                  layers: Layer.store+':'+Layer.table_name,
                  format: 'image/png',
                  transparent: true
              }).addTo(map)
/*              layer.wms =  wmsLayer;
              layer.visible = true;*/
        });

      $scope.layers =  {
            baselayers: {
                xyz: {
                    name: 'OpenStreetMap (XYZ)',
                    url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                    type: 'xyz'
                }
            }
        };

      function on_load () {
        // initializing controller variables & objects
        //==Dialog Variables ==//
        leafletData.getMap().then(function(map) {
            
            console.log(map);
            setTimeout(function() {
              map.invalidateSize();
            }, 400);
            $scope.map = map;
        });
      }

      on_load();
        
    
        var vm = this;
        $scope.layer = Layer;

        console.log($scope.layername);

        //console.log($scope.layer); ar

        //=====================Dialog Preview Layers ==============

            $scope.answer = function(answer) {
             console.log('answeransweranswer');
              $mdDialog.hide(answer);
            };


        //===================== End Of Preview Dialog =============

    }




//====== End Of File =======
})();