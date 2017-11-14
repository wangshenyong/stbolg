'use strict';

AccountDetailListQryCtrl.$inject = ['$scope', '$remote', '$filter', '$dateUtil', '$cookieService'];
function AccountDetailListQryCtrl($scope, $remote, $filter, $dateUtil, $cookieService) {
	//对页面进行初始化
	$scope.start = function() {
		$scope.BeginDate = $filter('date')(new Date() - 24 * 3600 * 1000, "yyyy-MM-dd");
		$scope.EndDate = $filter('date')(new Date() - 24 * 3600 * 1000, "yyyy-MM-dd");
		var UserId = $cookieService.getCookie("UserId");
		var pargs = {
			UserId : UserId
		};
		$remote.post("AccountList.do", pargs, function(data) {
			$scope.AccList = data.List;
			$scope.Acc = $scope.AccList[0];
		});
	};

	$scope.AccDetailQry = function() {
		var pargs = {
			AcNo : $scope.Acc.AcNo,
			//"AcNo":"622248765412345678",
			"SubAcNo" : "622248765412345678",
			"BeginDate" : "2016-09-10 12:32:33",
			"EndDate" : "2016-10-09 12:32:33",
			"Amount" : "96.75"
		};
		$remote.post("AccDetailQry.do",pargs,function(data){
			$scope.Order = data;
		});
		
	};

	$scope.selectDate = function(event, type) {
		console.log(type);
		var target = event.target;
		$(target).siblings().removeClass("active");
		$(target).addClass("active");
		$scope.BeginDate = $dateUtil.changeDate(type, new Date() - 24 * 3600 * 1000, "yyyy-MM-dd");
		$scope.EndDate = $filter('date')(new Date() - 24 * 3600 * 1000, "yyyy-MM-dd");
	};
	$scope.doDetail = function(row) {
		/**
		 * setNextScope第一个参数为平铺到下一个Scope的对象，
		 * 默认只能使用一次，如果想使用多次，需设置第二个参数。
		 * 如对象{name:"zhangsan"},平铺到下一个$scope后，可以直接在下一个$scope中使用$scope.name值为"zhangsan"
		 * setNextScope第二个参数为平铺对象不清除的条件
		 * (必须打开vx-config中的设置$contextConfigProvider.setSessionStorageEnable(true);)，
		 * 跳转路由名称与第二个参数模糊匹配，不会清除对象，否则清除。
		 */
		$scope.$context.setNextScope(row, "Account");
		
		
		$scope.goto("app.AccountDetail");
	}
}

