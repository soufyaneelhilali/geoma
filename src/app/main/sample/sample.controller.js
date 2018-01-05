(function ()
{
    'use strict';

    angular
        .module('app.sample')
        .controller('SampleController', SampleController);

    /** @ngInject */
    function SampleController($q,$timeout,api,$scope,$window,$http,sessionService)
    {

        var vm = this;
        var av = "région";
             getAutoCompleteList();
        // Data
         console.log(sessionService.get('isloged'));
/*         $scope.maps = api.sample.getById.get({'id': sessionService.get('mapid')});
         $scope.maps = api.users.getById.get({'id': sessionService.get('id')});*/

        //$scope.maps = vm.maps 
         //console.log($scope.maps);

        //vm.description = SampleData.description;
        //vm.name = SampleData.name;

        // Methods

            // list of `state` value/display objects
    $timeout(function () { vm.states = loadAll(); },2000,false);
    
    vm.selectedItem  = null;
    vm.searchText    = null;
    vm.querySearch   = querySearch;

    // ******************************
    // Internal methods
    // ******************************

    /**
     * Search for maps... use $timeout to simulate
     * remote dataservice call.
     */
    function querySearch (query) {
      var results = query ? vm.states.filter( createFilterFor(query) ) : vm.states;
      var deferred = $q.defer();
      $timeout(function () { deferred.resolve( results ); }, Math.random() * 2000, false);
      return deferred.promise;
    }

    /**
     * Build `maps` list of key/value pairs
     */
    function loadAll() {
      getAutoCompleteList()
      var allStates = av;
      return allStates.split(/, +/g).map( function (state) {
        return {
          value: state.toLowerCase(),
          display: state
        };
      });
    }

    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);

      return function filterFn(state) {
        return (state.value.indexOf(lowercaseQuery) === 0);
      };

    }

         function getAutoCompleteList(){
          console.log('executed getAutoCompleteList')
            api.maps.autocomplet.query(function(result){
                  var ac = [];

                angular.forEach(result, function(value, key){
                  ac.push(value.name);
                  ac.push(value.description);
                  av = av +', '+ value.name +', '+ value.description;
              });
                console.log(ac)
                console.log(av)
            });
        }
        //////////
    }


})();
