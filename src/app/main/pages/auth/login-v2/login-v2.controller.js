(function ()
{
    'use strict';

    angular
        .module('app.pages.auth.login-v2')
        .controller('LoginV2Controller', LoginV2Controller)
        .service('Restangular');
        						
    /** @ngInject */
    function LoginV2Controller(api,$resource,$stateParams,sessionService,notifyService,AllConstant,$scope,$http,$state,$rootScope)
    {

        var vm = this;
        // Data
        var $user = vm.user;


        notifyService.notify("Bienvenue", "Veuillez entrez votres login ou email et votres mot de passe","icon-account-alert");

          $scope.submit = function (vm) {
          	if (sessionService.get('oldLoginId') !== 0) {};
            
            var baseUrl = api.baseUrl;
            var apiUrl  = api.url;
            $scope.user = vm.user;

            $http({
                method: 'POST',
                url: baseUrl + "oauth/token",
                data: {
                    client_id: api.AUTH_ID,
                    client_secret: api.AUTH_SECRET,
                    grant_type:'password',
                    username: $scope.user.email,
                    password: $scope.user.password,
                    scope:null
                } 

		        }).then(function (response) {
		            var token = response.data.access_token;
		            $http.defaults.headers.common.Authorization = 'Bearer '+ token;
		            $http.defaults.headers.common.Accept = 'application/json';

					var loggeduser = $resource(apiUrl+'user',{}, {
					    get: {
					        method: 'GET',
					        headers: {
					        	'Authorization': 'Bearer ' + token,
								'Accept': 'application/json'}
					   		 }
						});

						var result = loggeduser.get(function(result){

	                    sessionService.set('isloged','yes');
	                    sessionService.set('oldEmail','');
	                    sessionService.set('id',result.id);
	                    sessionService.set('lastname',result.lastname);
    		            sessionService.set('token',token);
	                    sessionService.set('login',result.login);
	                    sessionService.set('firstname',result.firstname);
	                    sessionService.set('email',result.email);
	                    sessionService.set('password',result.password);
	                    sessionService.set('type',result.type);
	                    	//remember the session 
	                     if($scope.user.remember)
                    		sessionService.set('remember','yes');
                    	else{
                    		sessionService.set('remember','no');
                    	}

						});

                      notifyService.notify("success","Vous avez été connecté avec succès, veuillez patienter...","icon-cast-connected");
                      setTimeout(function(){
                       window.open('/dashboard-analytics', '_self'); }, 1000);
		   	 });



		}












//===END of loginv2controller  
}

})();