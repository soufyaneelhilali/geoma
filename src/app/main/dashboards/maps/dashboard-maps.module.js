(function ()
{
    'use strict';

    angular
        .module('app.dashboards.maps',
            [
                // 3rd Party Dependencies
                'nvd3',
                'datatables'
            ]
        )
        .config(config);

    /** @ngInject */
    function config($stateProvider, msApiProvider)
    {
        // State
        $stateProvider.state('app.dashboards_maps', {
            url      : '/dashboard-maps',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/dashboards/maps/dashboard-maps.html',
                    controller : 'DashboardmapsController as vm'
                }
            },
            resolve  : {
                DashboardData: function (msApi)
                {
                    return msApi.resolve('dashboard.maps@get');
                }
            },
            bodyClass: 'dashboard-maps'
        });

        // Api
        msApiProvider.register('dashboard.maps', ['app/data/dashboard/server/data.json']);
    }

})();