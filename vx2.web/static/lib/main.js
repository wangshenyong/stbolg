ibsapp.controller("MainCtrl", ["$scope", "$remote", '$cookieService', '$q',
	function ($scope, $remote, $cookieService, $q) {
		$scope.startupMain = function () {

			$scope.selectItem = function (item) {
				$scope.goto('/app/' + item.ActionId);
			};

			$scope.searchWord = undefined;
			$scope.selectCall = function (item) {
				$scope.goto('/app/' + item.PcActionId || item.ActionId);
			};

			// 登录后获取用户信息
			$remote.post('UserInfo.do', {}, function (data) {
				console.log(data);
				if(data.UserId&&data.MenuList){
					$scope.$root.$userinfo = data;
					$scope.$root.$menuList = data.MenuList;
				}else{
					$scope.goto('/loginapp/UserLogin');
				}
			}, function (err) {
				console.log(err);
			});
		};
		$scope.ajaxSearch = function (viewValue) {
			var defer = $q.defer();
			var pargs = {
				"FaRenId": "FAREN00001",
				"IsHuiDu": "0",
				"ChannelId": "pweb_pc",
				"Title": viewValue
			};
			$remote.post("Search.do", pargs, function (data) {
				defer.resolve(data.Apps);
			});
			return defer.promise;
		};
		$scope.logout = function () {
			console.log("logout>>>>>>>>>>>>>>>>>>--");
			$remote.post("logout.do", {}, function (data) {
				$scope.$root.$userinfo = undefined;
				$scope.$root.$menuList = undefined;
				$cookieService.deleteCookie('UserId');
				$cookieService.deleteCookie('Name');
				$cookieService.deleteCookie('Username');
				$scope.goto('/loginapp/UserLogin');
				// location.reload();
			});
		};

		function getActions(Menu) {
			var arraylist = [];
			for (var i = 0; i < Menu.length; i++) {
				var temp_level1 = Menu[i];
				if (temp_level1.ActionId) {
					arraylist.push({
						ActionId: temp_level1.ActionId,
						ActionName: temp_level1.ActionName
					});
				} else {
					if (temp_level1.MenuList && temp_level1.MenuList.length > 0) {
						var arr = getActions(temp_level1.MenuList);
						arraylist = arraylist.concat(arr);
					}
				}
			}
			return arraylist;
		}
	}]);