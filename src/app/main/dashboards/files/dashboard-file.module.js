(function ()
{
    'use strict';

    angular
        .module('app.dashboards.file',
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
        $stateProvider.state('app.dashboards_file', {
            url      : '/dashboard-file',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/dashboards/files/dashboard-file.html',
                    controller : 'DashboardfileController as vm'
                }
            },
            resolve  : {
                DashboardData: function (msApi)
                {
                    return msApi.resolve('dashboard.layer@get');
                }
            },
            bodyClass: 'dashboard-file'
        });

        // Api
        msApiProvider.register('dashboard.file', ['app/data/dashboard/server/data.json']);
    }

})();