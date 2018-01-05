(function ()
{
    'use strict';

    angular
        .module('app.home.inv')
        .controller('invController', invController);

    /** @ngInject */
    function invController($window,$mdDialog,api,$q,$timeout,$document,$mdSidenav,sessionService,$state,$resource,$scope,$stateParams,$http,notifyService)
    { 

        // initializing controller variables & objects
        var vm = this;
        vm.selected_inv = "";
        vm.firstname = sessionService.get('firstname');


        // populating category liste  // replace WWW by the name of endpoint

        //vm.invs = api.WWW.list.query();

        vm.toggleSidenav = function(sidenavId)
            {
                $mdSidenav(sidenavId).toggle();
            }

        vm.showinmap = function(invid)
            {
              //code goes here for showing items on map.
                vm.selected_inv = invid;
            }

    }




//====== End Of File =======
})();