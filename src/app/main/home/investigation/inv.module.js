(function ()
{
    'use strict';

    angular
        .module('app.home.inv', []) 
        .config(config);
    angular.module('app.home.inv')
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
            .state('app.inv', {
                    resolve  : {
                    LayerList: function (apiResolver)
                    {
                        //return apiResolver.resolve('inv.paginate@get',{'paginate': 5,'page': 1,'orderby':'updated_at','order':'asc'});
                    }
                },
                url    : '/inv',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/home/investigation/inv.html',
                        controller : 'invController as vm'
                    }
                },
                //
            })
            .state('app.inv_create',{
                    resolve: {
                    checksession : function (sessionService)
                    {
                        //return sessionService.AccessService();
                    },
                },
                url:'/new-inv',
                views:{
                    'content@app': {
                        templateUrl: 'app/main/home/investigation/create.inv.html',
                        controller : 'CreateinvController as vm'
                    }
                }


            });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/home/investigation');

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