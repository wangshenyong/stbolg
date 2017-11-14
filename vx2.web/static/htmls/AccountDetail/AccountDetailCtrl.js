'use strict';
/**
 * 商户申请controller
 */
ibsapp.controller('AccountDetailCtrl', ['$scope', '$remote', '$filter', '$dateUtil', '$cookieService',
	function ($scope, $remote, $filter, DateUtil, $cookieService) {
		//对页面进行初始化
		$scope.start = function () {
			$scope.BeginDate = $filter('date')(new Date()-24*3600*1000, "yyyy-MM-dd");
			$scope.EndDate = $filter('date')(new Date()-24*3600*1000, "yyyy-MM-dd");
			var UserId = $cookieService.getCookie("UserId");
			var pargs = {
				UserId: UserId
			};
			$remote.post("AccountList.do", pargs, function (data) {
				$scope.AccList = data.List;
				$scope.Acc = $scope.AccList[0];
			});
		};


		$scope.AccDetailQry=function() {
			var pargs = {
				AcNo:$scope.Acc.AcNo,
				//"AcNo":"622248765412345678",
				"SubAcNo":"622248765412345678",
				"BeginDate":"2016-09-10 12:32:33",
				"EndDate":"2016-10-09 12:32:33",
				"Amount":"96.75"
			};
			$remote.post("AccountDetail.do", pargs, function (data) {
				$scope.DetailList = data.List;
			});
		};

		$scope.selectDate = function (event, type) {
			console.log(type);
			var target = event.target;
			$(target).siblings().removeClass("active");
			$(target).addClass("active");
			$scope.BeginDate = $dateUtil.changeDate(type, new Date()-24*3600*1000, "yyyy-MM-dd");
			$scope.EndDate = $filter('date')(new Date()-24*3600*1000, "yyyy-MM-dd");
		};
	}]);

