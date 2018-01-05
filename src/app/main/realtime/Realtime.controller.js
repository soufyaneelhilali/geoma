(function ()
{
    'use strict';

    angular
        .module('app.realtime')
        .controller('RealtimeController', RealtimeController);

    /** @ngInject */
    function RealtimeController($document,$state,$window,$mdSidenav,leafletData,$controller,$mdDialog,api,sessionService,$resource,$scope,$stateParams,$http,notifyService,$firebaseObject,$compile)
    {

        angular.extend($scope, {
        center: {
          lat: 33.573110,
          lng: -7.589843,
          zoom: 7
        },
        events: {
          map: {
              enable: ['zoomstart', 'drag', 'click', 'mousemove'],
              logic: 'emit'
          },
          marker:{
            enable: ['click'],
            logic: 'emit'
          }
        }
        });

        var vm = this;
        $scope.markers = {};
        var ref = firebase.database().ref().child("trackings").on('value', function(tracking) {
            _.map(tracking.val(),function(val){

                if (val)
                {
                    angular.forEach(vm.devices,function(device){
                        console.log(device);
                        if(device.id == val.properties.device_id)
                        {

                            $scope.markers[val.properties.device_id] = {
                                lat: val.geometry.coordinates[1],
                                lng: val.geometry.coordinates[0],
                                message: device.name,
                                icon: {
                                    iconUrl:device.category.icon,
                                    iconSize:[45, 50]
                                },
                                properties:val.properties,
                                device:device
                            };
                            console.log("found");
                            return;
                        }

                    })

                }

            });


        });
        $scope.$on('leafletDirectiveMarker.click', function(event, args){
          console.log(args.model,'model');
          console.log($scope.markers,'marker');
          angular.forEach($scope.markers,function(marker){
            if(marker.device.id === args.model.device.id)
            {
              args.model.properties = marker.properties;
              console.log("TRUE")
            }
          })

          vm.showProperties(args.model);
        });

        vm.realtimecat = api.realtime.categories.query();
        vm.devices = api.realtime.devices.query();
        vm.toggleSidenav = function(sidenavId)
        {
            $mdSidenav(sidenavId).toggle();
        }


         vm.connecter =  function(device){
          device.user_id = sessionService.get('id');
          api.realtime.devicestore(device);
          console.log(device);
        }

         vm.pantodevice =  function(device_id){
          vm.selected_device = device_id;
          console.log(device_id);
        }
        vm.showProperties = function (marker)
        {
          $mdDialog.show({
          controller: 'propertiesController',
          controllerAs: 'propertiesControllerVm',
          templateUrl: 'app/main/realtime/views/dialog/properties.html',
          parent: angular.element(document.body),
          clickOutsideToClose : true,
              locals: {
                "marker": marker
            }
            })
            .then(function(answer) {
              $scope.status = 'You said the information was "' + answer + '".';
            }, function() {
              $scope.status = 'You cancelled the dialog.';
            });
        }



    }

})();
