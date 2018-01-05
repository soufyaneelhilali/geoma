

(function ()
{

    'use strict';

    angular
        .module('fuse')
        .factory('api', apiService,'$http','$q');

    /** @ngInject */
    function apiService($resource,sessionService,$http,$q,notifyService)
    {


         var api = {};
        //Base Url
        api.baseUrl = 'http://localhost:8080/API/trunk/public/';
        api.url = 'http://localhost:8080/API/trunk/public/api/';
        api.GeoserverUrl = 'http://localhost:8085/geoserver/';
        api.AUTH_ID = 2;
        api.AUTH_SECRET='cFT6fIKPhluSafcVPPUTYCNzMm5sxn8Pl1lOP7D8';
         api.HEADERGET  = {
                          get: {
                              method: 'GET',
                              headers: {
                                'Authorization': 'Bearer ' + sessionService.get('token'),
                            'Accept': 'application/json'}
                             }
            };
          api.HEADERDELETE  = {
                          get: {
                              method: 'DELETE',
                              headers: {
                                'Authorization': 'Bearer ' + sessionService.get('token'),
                                'Accept': 'application/json'}
                             }
            };

          api.HEADERPOST = {
                          get: {
                              method: 'POST',
                              headers: {
                                'Authorization': 'Bearer ' + sessionService.get('token'),
                                'Accept': 'application/json'}
                             }
            };

        // api.sample = $resource(api.baseUrl + 'sample/sample.json');
    /*
   |--------------------------------------------------------------------------
   | map Routes
   |--------------------------------------------------------------------------
   |
   | ici les routes qui concerne une map
   |
   */

         api.maps = {
                            list      : $resource(api.url +'maps',api.HEADERGET),
                            getById  : $resource(api.url +'maps/:id', {id: '@id'},api.HEADERGET),
                            paginate  : $resource(api.url +'maps?paginate=:limit&page=:page&orderby=:orderby&order=:order', {

                              limit:'@limit',
                              page:'@page',
                              id:'@id',
                              orderby:'@orderby',
                              order:'@order'

                            },api.HEADERGET),

                            getbytheme  : $resource(api.url +'maps?paginate=:limit&page=:page&where=theme_id,:id&orderby=:orderby&order=:order', {
                                limit:'@limit',
                                page:'@page',
                                id:'@id',
                                orderby:'@orderby',
                                order:'@order'
                            }),

                            getbyuser  : $resource(api.url +'maps?paginate=:limit&page=:page&where=user_id,:id&orderby=:orderby&order=:order', {
                                limit:'@limit',
                                page:'@page',
                                id:'@id',
                                orderby:'@orderby',
                                order:'@order'
                            }),

                            search  : $resource(api.url +'maps?q=:kw',{kw:'@kw'}),
                            autocomplet  : $resource(api.url +'maps?fields=name,description'),
                            count : $resource(api.url + 'maps?count=true', {get: {method: 'GET',responseType: 'text'}}),
                            countby : $resource(api.url + 'maps?count=true&where=:atr,:val',{atr:'@atr',val:'@val'}),
                            remove : $resource(api.url + 'maps/:id',{id:'@id'},api.HEADERDELETE),
                            share : $resource(api.url + 'maps/share/:id',{id:'@id'},api.HEADERGET),
                            approve : $resource(api.url + 'maps/approve/:id',{id:'@id'},api.HEADERGET),
                            store : function (map) {
                                return $http.post(api.url+'maps', map, {
                                    headers : {
                                        'Authorization': 'Bearer ' + sessionService.get('token'),
                                        'Accept': 'application/json'
                                    }
                                })
                            },
                            affect : function (layers,id) {
                                 return $http.post(api.url+'maps/'+id+'/affect', layers, {
                                  headers : {
                                   'Authorization': 'Bearer ' + sessionService.get('token'),
                                    'Accept': 'application/json'
                                 }
                             })
                            }
                }

    /*    Route::post('/maps/{id}','MapController@update');
   |--------------------------------------------------------------------------
   | layer Routes
   |--------------------------------------------------------------------------
   |
   | ici les routes qui concerne un layer
   |
   */
        function EncodeQueryData(data)
        {  console.log(data,"before");
            var ret = [];
            for (var d in data)
                ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
            return ret.join("&");
        }

         api.layers = {
                           list      : $resource(api.url +'layers'),
                            getById  : $resource(api.url +'layers/:id', {id: '@id'}),
                            getByDate: $resource(api.url +'layers/:date', {id: '@date'}, { get: {
                                     method: 'GET',
                                    isArray:  true,
                                     params: {
                                         getByDate: true
                                     }
                                }
                            }),
                              paginate  : $resource(api.url +'layers?paginate=:limit&page=:page&orderby=:orderby&order=:order', {

                              limit:'@limit',
                              page:'@page',
                              id:'@id',
                              orderby:'@orderby',
                              order:'@order'

                            },api.HEADERGET),

                            getbycategory  : $resource(api.url +'layers?paginate=:limit&page=:page&where=category_id,:id&orderby=:orderby&order=:order', {
                                limit:'@limit',
                                page:'@page',
                                id:'@id',
                                orderby:'@orderby',
                                order:'@order'
                            }),

                            getbyuser  : $resource(api.url +'layers?paginate=:limit&page=:page&where=user_id,:id&orderby=:orderby&order=:order', {
                                limit:'@limit',
                                page:'@page',
                                id:'@id',
                                orderby:'@orderby',
                                order:'@order'
                            }),
                            autocomplet  : $resource(api.url +'layers?fields=name,description'),

                            search  : $resource(api.url +'layers?paginate=:limit&page=:page&q=:kw',{
                              limit:'@limit',
                              page:'@page',
                              kw:'@kw',
                              }),

                            bycategory : $resource(api.url + 'layers?where=category_id,:id',{
                              id:'@id'
                            }),
                            count : $resource(api.url + 'layers?count=true'),
                            countby : $resource(api.url + 'layers?count=true&where=:atr,:val',{atr:'@atr',val:'@val'}),
                            remove : $resource(api.url + 'layers/:id',{id:'@id'},api.HEADERDELETE),
                            share : $resource(api.url + 'layers/share/:id',{id:'@id'},api.HEADERGET),
                            approve : $resource(api.url + 'layers/approve/:id',{id:'@id'},api.HEADERGET),
                            upload : function(layer,file)
                            {
                                var fd = new FormData();
                                fd.append("file", file);
                                var q = $q.defer();
                                $http.post(api.url+'layers', fd, {

                                    withCredentials : false,

                                    headers : {
                                        'Content-Type' : undefined,
                                        'Authorization': 'Bearer ' + sessionService.get('token'),
                                        'Accept': 'application/json'
                                    },
                                    transformRequest : angular.identity,
                                    params:layer

                                })
                                    .success(function(data)
                                    {

                                    notifyService.notify("seccuss","La couches a été bien enregistré","icon-view-list");
                                    console.log(data);
                                    })
                                    .error(function(data)
                                    {
                                      console.log(data);
                                        notifyService.notify("seccuss","La couches n'a été pas bien enregistré (" + data.file+")","icon-view-list");
                                    });


                                return q.promise;
                            }
                }
  /*
   |--------------------------------------------------------------------------
   | user Routes
   |--------------------------------------------------------------------------
   |
   | ici les routes qui concerne un user
   |
   */

         api.users = {
                           list     : $resource(api.url +'users'),
                            getById  : $resource(api.url +'users/:id', {id: '@id'}),
                            getByDate: $resource(api.url +'users/:date', {id: '@date'}, {
                                get: {
                                     method: 'GET',
                                     params: {
                                         getByDate: true
                                     }
                                }
                            })
                }

      /*
        /*
   |--------------------------------------------------------------------------
   | files Routes
   |--------------------------------------------------------------------------
   |
   | ici les routes qui concerne un file
   |
   */

         api.files = {
                            list     : $resource(api.url +'upfiles'),
                            getById  : $resource(api.url +'upfiles/:id', {id: '@id'}),
                            getByDate: $resource(api.url +'upfiles/:date', {id: '@date'}, { get: {
                                     method: 'GET',
                                    isArray:  true,
                                     params: {
                                         getByDate: true
                                     }
                                }
                            }),
                              paginate  : $resource(api.url +'upfiles?paginate=:limit&page=:page&orderby=:orderby&order=:order', {

                              limit:'@limit',
                              page:'@page',
                              id:'@id',
                              orderby:'@orderby',
                              order:'@order'

                            },api.HEADERGET),

                            getbycategory  : $resource(api.url +'upfiles?paginate=:limit&page=:page&where=category_id,:id&orderby=:orderby&order=:order', {
                                limit:'@limit',
                                page:'@page',
                                id:'@id',
                                orderby:'@orderby',
                                order:'@order'
                            }),

                            getbyuser  : $resource(api.url +'upfiles?paginate=:limit&page=:page&where=user_id,:id&orderby=:orderby&order=:order', {
                                limit:'@limit',
                                page:'@page',
                                id:'@id',
                                orderby:'@orderby',
                                order:'@order'
                            }),
                            autocomplet  : $resource(api.url +'upfiles?fields=name,description'),

                            search  : $resource(api.url +'upfiles?paginate=:limit&page=:page&q=:kw',{
                              limit:'@limit',
                              page:'@page',
                              kw:'@kw',
                              }),

                            bycategory : $resource(api.url + 'upfiles?where=category_id,:id',{
                              id:'@id'
                            }),
                            count : $resource(api.url + 'upfiles?count=true'),
                            countby : $resource(api.url + 'upfiles?count=true&where=:atr,:val',{atr:'@atr',val:'@val'}),
                            remove : $resource(api.url + 'upfiles/:id',{id:'@id'},api.HEADERDELETE),
                            share : $resource(api.url + 'upfiles/share/:id',{id:'@id'},api.HEADERGET),
                            approve : $resource(api.url + 'upfiles/approve/:id',{id:'@id'},api.HEADERGET),
                            upload : function(data,file)
                            {
                                var fd = new FormData();
                                fd.append("file", file);
                                var q = $q.defer();
                                $http.post(api.url+'upfiles', fd, {

                                    withCredentials : false,

                                    headers : {
                                        'Content-Type' : undefined,
                                        'Authorization': 'Bearer ' + sessionService.get('token'),
                                        'Accept': 'application/json'
                                    },
                                    transformRequest : angular.identity,
                                    params:data

                                })
                                    .success(function(data)
                                    {

                                    notifyService.notify("seccuss","Le fichier a été bien enregistré","icon-view-list");
                                    console.log(data);
                                    })
                                    .error(function(data)
                                    {
                                      console.log(data);
                                        notifyService.notify("seccuss","Le fichier n'été pas bien enregistré (" + data.file+")","icon-view-list");
                                    });


                                return q.promise;
                            }
                }

      /*
   |--------------------------------------------------------------------------
   |  category routes
   |--------------------------------------------------------------------------
   |
   | ici les routes qui concerne un user
   |
   */

         api.categories = {
                           list     : $resource(api.url +'categories'),
                            getById  : $resource(api.url +'categories/:id', {id: '@id'}),
                            getByDate: $resource(api.url +'categories/:date', {id: '@date'}, {
                                get: {
                                     method: 'GET',
                                     params: {
                                         getByDate: true
                                     }
                                }
                            })
                }

                      /*
   |--------------------------------------------------------------------------
   |  theme routes
   |--------------------------------------------------------------------------
   |
   | ici les routes qui concerne un theme
   |
   */

         api.themes = {
                           list     : $resource(api.url +'themes'),
                            getById  : $resource(api.url +'themes/:id', {id: '@id'}),
                            getByDate: $resource(api.url +'themes/:date', {id: '@date'}, {
                                get: {
                                     method: 'GET',
                                     params: {
                                         getByDate: true
                                     }
                                }
                            })
                }
                   /*
   |--------------------------------------------------------------------------
   |  theme routes
   |--------------------------------------------------------------------------
   |
   | ici les routes qui concerne un theme
   |
   */

         api.realtime = {
                           categories     : $resource(api.url+'realtime-categories',api.HEADERGET),
                           devices     : $resource(api.url+'devices',api.HEADERGET),
                            devicestore : function (device) {
                                return $http.post(api.url+'devices', device, {
                                    headers : {
                                        'Authorization': 'Bearer ' + sessionService.get('token'),
                                        'Accept': 'application/json'
                                    }
                                }).success(function(data)
                                    {
                                      console.log(sessionService.get('token'));
                                    notifyService.notify("seccuss","Le périphérique a été bien enregistré","icon-view-list");
                                    console.log(data);
                                    })
                                    .error(function(data)
                                    {
                                      console.log(data);
                                      console.log(sessionService.get('token'));
                                        notifyService.notify("seccuss","Le périphérique n'a été pas bien enregistré (" + data+")","icon-view-list");
                                    });
                            }

                }



        return api;
      }


})();
