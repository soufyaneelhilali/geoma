(function ()
{
    'use strict';

    angular
        .module('app.home.inv')
        .controller('CreateinvController', CreateinvController);

    /** @ngInject */
    function CreateinvController($mdDialog,api,$q,$timeout,$document,$mdSidenav,sessionService,$state,$resource,$scope,$stateParams,$http,notifyService)
    { 

        // initializing controller variables & objects
        var vm = this;
        // geting the list of layers 
        vm.load_activated = false;
        vm.newinv = {attributs:[],users:[]}; 
        vm.firstname = sessionService.get('firstname');
        $scope.userid = sessionService.get('id');

        vm.newuser = "";
        vm.newattr = "";

        vm.sendForm = function (inv)
        {
          console.log(inv)
        }
    

        vm.removeAttribute = function(index) { 
          //var index = vm.newLayer.attributes.indexOf(item,1);
          vm.newinv.attributs.splice(index,1); 
        }

        vm.removeuser = function(index) { 
          //var index = vm.newLayer.attributes.indexOf(item,1);
          console.log(index);
          vm.newLayer.attributs.splice(index,1);
          console.log("removed");  
        }

        vm.addusers = function (user) {
          if (user=="") {
            user="";
            notifyService.notify("error","entrez des données! ","icon-view-list");

            }else{
            vm.newinv.users.push(user);
            vm.newuser = "";
            }

        }

        vm.addattributs = function (attribute) {

          if (attribute=="") {
            attribute="";
            notifyService.notify("error","entrez des données! ","icon-view-list");

            }else{
              console.log(attribute)
            vm.newinv.attributs.push(attribute);
            vm.newattr = "";
            }

        }



    }

})();