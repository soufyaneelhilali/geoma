(function ()
{
    'use strict';

    angular
        .module('app.apps.scrumboard')
        .controller('BoardsViewController', BoardsViewController);

    /** @ngInject */
    function BoardsViewController(BoardList)
    {
        var vm = this;

        // Data
        vm.boardList = BoardList.data;

        // Methods

        //////////
    }
})();