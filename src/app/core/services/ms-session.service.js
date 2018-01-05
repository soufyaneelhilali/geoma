(function() {
	'use strict',
	angular
	.module('app.core')
	.factory('sessionService', sessionService);

	/* ngInject */
	function sessionService($injector,$document,msNavigationService,$window,$state, $timeout, $mdDialog, $stateParams,$resource,$http,notifyService,AllConstant,$filter) {
		var vm = this;
		var service = {
			set : set,
			get : get,
			remove : remove,
			destroy : destroy,
			AccessService: AccessService,
		};

		return service;

		function set(key, value) {
			return  sessionStorage.setItem(key, value);
			console.log(sessionStorage.getItem(key));
		};

		function get(key) {
			return sessionStorage.getItem(key);
		};

		function remove(key) {
			return sessionStorage.removeItem(key);
		}

		function destroy() {				
					remove('id');
	                remove('lastname');
	                remove('token');
	                remove('login');
	                remove('firstname');
	                remove('email');
	                remove('type');
	                remove('password');
	                remove('token');
	                remove('map');
	                set('isloged','no');
/*	            }
	            else
	            {

	            	notifyService.notify('error',response.data.message);	
	            }*/
			setTimeout(function(){ window.open('pages/auth/login-v2', '_self'); }, 1000);

/*			},function(response) {
				notifyService.notify('error',response.data.message);
			});*/
		}	


		function AccessService(arr_role,access,refresh)
		{

		}

		function hide_menu(ret_array)
		{
			//console.log(ret_array);
			if(ret_array.length>0)
			{
				for(var i=0; i<ret_array.length; i++)
				{
					msNavigationService.deleteItem('fuse.'+ret_array[i]);
				}
			}
		}

		function checkRollMenu(role)
		{
			//console.log(role);
		}


		function Module_menu_hide(arr_role,access)
		{
			var role = get('role_slug');
			//console.log(access);
			if(arr_role.indexOf(role) <= -1 && arr_role != 'ALL' && arr_role!='' && (angular.isUndefined(access) || access=="true" )) // PERMISSION ALLOW
            {
                return false;
            }
            else if(arr_role.indexOf(role) >= 0  && arr_role != 'ALL' && arr_role!='' && (angular.isUndefined(access) ||access=="false" )) // PERMISSION NOT ALLOW
            {
                return false;
            }
            else
            {
            	return true;
            }
        }


	}
	
})();