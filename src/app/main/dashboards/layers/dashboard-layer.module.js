(function ()
{
    'use strict';

    angular
        .module('app.dashboards.layer',
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
        $stateProvider.state('app.dashboards_layer', {
            url      : '/dashboard-layer',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/dashboards/layers/dashboard-layer.html',
                    controller : 'DashboardlayerController as vm'
                }
            },
            resolve  : {
                DashboardData: function (msApi)
                {
                    return msApi.resolve('dashboard.layer@get');
                }
            },
            bodyClass: 'dashboard-layer'
        });

        // Api
        msApiProvider.register('dashboard.layer', ['app/data/dashboard/server/data.json']);
    }

})();