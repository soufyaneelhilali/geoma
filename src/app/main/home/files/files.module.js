(function ()
{
    'use strict';

    angular
        .module('app.home.files', []) 
        .config(config);
    angular.module('app.home.files')
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
            .state('app.files', {
                    resolve  : {
                    LayerList: function (apiResolver)
                    {
                        return apiResolver.resolve('files.paginate@get',{'paginate': 5,'page': 1,'orderby':'updated_at','order':'asc'});
                    }
                },
                url    : '/files',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/home/files/files.html',
                        controller : 'FilesController as vm'
                    }
                },
                //
            })
            .state('app.files_create',{
                    resolve: {
                    checksession : function (sessionService)
                    {
                        //return sessionService.AccessService();
                    },
                },
                url:'/new-file',
                views:{
                    'content@app': {
                        templateUrl: 'app/main/home/files/create.files.html',
                        controller : 'CreateflController as vm'
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