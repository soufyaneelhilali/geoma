(function ()
{
    'use strict';

    angular
        .module('app.home.layers', []) 
        .config(config);
    angular.module('app.home.layers')
        .directive('fileModel',['$parse',function($parse){
            return {
                restrict : 'A',
                link: function (scope,element,attrs)
                {
                    var model = $parse(attrs.fileModel);
                    var modelSetter = model.assign;
                    element.bind('change',function(){
                        scope.$apply(function(){
                            modelSetter(scope,element[0].files[0])
                        })
                    })
                }
            }
        }])

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider
            .state('app.layers', {
                    resolve  : {
                    LayerList: function (apiResolver)
                    {
                        return apiResolver.resolve('layers.paginate@get',{'paginate': 5,'page': 1,'orderby':'updated_at','order':'asc'});
                    }
                },
                url    : '/layers',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/home/layers/layers.html',
                        controller : 'LayersController as vm'
                    }
                },
                //
            })
            .state('app.layers_create',{
                    resolve: {
                    checksession : function (sessionService)
                    {
                        //return sessionService.AccessService();
                    },
                },
                url:'/new-layer',
                views:{
                    'content@app': {
                        templateUrl: 'app/main/home/layers/create.layers.html',
                        controller : 'CreatelrController as vm'
                    }
                }


            });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/home/layers');

        // Api
        //msApiProvider.register(api.getMapsList);

        // Navigation

/*        msNavigationServiceProvider.saveItem('layers', {
            title : 'Couches',
            weight: 2,
            icon     : 'icon-layers'
        });


        msNavigationServiceProvider.saveItem('layers.index', {
            title    : 'Couches disponibles',
            state    : 'app.layers',

        });
        msNavigationServiceProvider.saveItem('layers.create',{
            title    : 'Créer Couche',
            state    : 'app.layers_create',
        });*/


    }

})();