'use strict';
/**
 * RegisterPreCtrl
 */
ibsapp.controller('AccountBindCtrl', ['$scope', '$cookieService', '$remote',
	function ($scope, $cookieService, $remote) {
		$scope.startup = function () {
			$scope.innerTransButton = $("#innerTransButton");
			//为第一个button进行样式初始化动画
			$scope.innerTransButton.find("a.button").removeClass("out success");
			$scope.innerTransButton.find("a:eq(0)").addClass("out success");
			//为录入方式等控件设置初值
			$scope.inType = "optionMode";
			$scope.optStyle = "immediate";
			var UserId = $cookieService.getCookie("UserId");
			$scope.UsrId = UserId;
		};

		$scope.submitPre = function () {

			var pargs = {
				"CustNo": $scope.UserId,
				"BindChannelId": $scope.BindChannelId,
				"UsrId": $scope.UsrId,
				"AcctNbr": $scope.AcNo,
				"AcNo": $scope.AcNo,
				"SvrType": "1",
				"AcctTypCd": "A"
			};
			$scope.confirmData = pargs;
			_goTo(2);
		};
		$scope.submit = function (row) {

			var pargs = $scope.confirmData;
			$remote.post("AcNoBind.do", pargs, function (data) {
				$scope.result = pargs;
				_goTo(3);
			});
		};
		var _goTo = function (target) {
			$scope.innerTransButton.find("a.button").removeClass("out success");
			$scope.innerTransButton.find("a:eq(" + (target - 1) + ")").addClass("out success");

			$scope.goto("#" + target + "");
		}
	}]);