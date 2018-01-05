(function ()
{
    'use strict';

    angular
        .module('app.pages.auth.register-v2')
        .controller('RegisterV2Controller', RegisterV2Controller);

/** @ngInject */
function RegisterV2Controller(api,sessionService,$state,$resource,$scope,$stateParams,$http,notifyService)
{
        var vm = this;
        // Data
        var $user = vm.user;
        // Methods
           
        //user registration post to server
        if ((sessionService.get("isloged") == 'true')){
                    $state.go('app.sample');
                    console.log('i can see it true did not sent ya');
        }


    $scope.Register = function (vm)
        {
        $scope.user = vm.user;
        
        //I will add a constant provider so we can use variables of notifications 
        //later on ,
          // console.log(vm.user.login);
            if ($scope.user.password == $scope.user.passwordConfirm) {


                $http.post(api.url +'users',$scope.user).success(function(data, status, headers, config) {

                    var data = {"status": "success", "message": "la platforme vous souhaite la bienvenue, S'il vous plaît, attendez ..."}

                        vm.enableprogress = true;
                        notifyService.notify(data.status, data.message);

                        setTimeout(function(){ window.open('pages/auth/login-v2', '_self'); }, 2000);

                        })

                        .error(function(data, status, headers, config) {
                        var data = {"status": "success", "message": "Le login ou email déja pris par un utilisateur, veuillez introduire un nouveau..."}
                        vm.desableprogress = false;
                        notifyService.notify(data.status, data.message);

                        });
             }else{

                    vm.desableprogress = false;
                    var data = {"status": "success", "message": "le champ mot de passe et confirmation doivent etres identique!"}
                    notifyService.notify(data.status, data.message);

                }

        }

}





})();