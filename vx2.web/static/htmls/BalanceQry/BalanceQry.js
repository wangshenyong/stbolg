'use strict';
/**
 * RegisterPreCtrl
 */
ibsapp.controller('BalanceQryCtrl', ['$scope', '$cookieService', '$remote',
	function ($scope, $cookieService, $remote) {
		$scope.startup = function () {
			var UserId = $cookieService.getCookie("UserId");
			var pargs = {
				UserId: UserId
			};
			$remote.post("AccountList.do", pargs, function (data) {
				$scope.AccList = data.List;
				$scope.Acc = $scope.AccList[0];
			});
		};
		$scope.$watch(function () {
			return $scope.Acc && $scope.Acc.AcNo
		}, function (newValue, oldValue) {
			var pargs = {
				"AcNo": newValue
			};
			$remote.post("AccountBalance.do", pargs, function (data) {
				$scope.result = data.List[0];
			});
		});
	}]);