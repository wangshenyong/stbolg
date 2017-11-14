'use strict';
/**
 * 客户管理-客户信息
 */
CustomerListDetailQryCtrl.$inject=['$scope', '$log', '$remote','FileDownloader'];

function CustomerListDetailQryCtrl($scope, $log, $remote, FileDownloader) {
	$scope.startup = function() {
		$scope.BeginTime = $scope.getDate(-31);
		$scope.EndTime = $scope.$now;
	};
	//客户信息明细查询列表
	$scope.toDetail = function() {
		$scope.showDetail = true;
		var params = {
			"BeginTime" : $scope.BeginTime,
			"EndTime" : $scope.EndTime,
			pageSize:3
		};
		$remote.post("TCustomerStatInfoQry.do", params, function(data) {
			$scope.detailLessList = data.resultMap;
		});
	};
	//客户信息明细查询列表导出excel
	$scope.toDetailExcel = function() {
		var params = {
			"BeginTime" : $scope.BeginTime,
			"EndTime" : $scope.EndTime
		};
		var myDownloader=new FileDownloader();
		myDownloader.download("TCustomerStatInfoDownload.do", params);
	};
	//跳转到详情页
	$scope.toPage = function(index) {
		var params=$scope.detailLessList.List[index];
		$scope.goto('app.CustomerListDetailPage/'+params.UserId+'/'+params.MobilePhone+'/'+params.OrderCount+'/'+$scope.BeginTime+'/'+$scope.EndTime);
	};
};
