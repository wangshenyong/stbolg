(function(window, vx, undefined) {
	'use strict';
	var mod = vx.module('ibsapp');
	var directive = {};
	mod.directive("uiYaojiang", [function() {
		return {
			restrict: 'EA',
			templateUrl: 'lib/template/ui-yaoJiang/ui-yaoJiang.html',
			link: function($scope, elem, attrs, ctrl) {
				var resultContent;
				var params;
				var defaults = {
					number: 3,
					func1: "func",
					hode: 0
				};
				(function startup() {
					params = $.extend({}, defaults, vx.fromJson(attrs.uiYaojiang || {}));
					setTimeout(function() {
						yaojiang();
					}, 500);
				})();

				function yaojiang() {
					$("#wallet1Shake,#wallet2Shake, #wallet3Shake, #wallet6Shake,#wallet9Shake,#wallet11Shake").removeClass().addClass("shake");
					$("#wallet4Shake,#wallet5Shake,#wallet7Shake,#wallet8Shake,#wallet10Shake,#wallet12Shake,#wallet13Shake").removeClass().addClass("shake1");
					CommCloseFloatMethod(params.hode);
				}

				function CommCloseFloatMethod(paramData) {
					var sWidth = document.body.scrollWidth;
					var sHeight = document.body.scrollHeight;

					// 创建弹框时的遮罩
					var oMask = document.createElement("div");
					oMask.id = "mask";
					oMask.style.width = sWidth + "px";
					oMask.style.height = sHeight + "px";
					document.body.appendChild(oMask);
					var oFloat = document.getElementById("floatId");

					// 获取页面可视区宽度和高度
					var wWidth = $(window).width();
					var wHeight = $(window).height();
					if(paramData == 1) {
						$(".floatImg").css({
							"background": "url('css/img/ui-yaojiang/win.png') center no-repeat",
							"background-size": "cover"
						});
						resultContent = "恭喜您获得一等奖";
					} else if(paramData == 2) {
						$(".floatImg").css({
							"background": "url('css/img/ui-yaojiang/win.png') center no-repeat",
							"background-size": "cover"
						});
						resultContent = "恭喜您获得二等奖";
					} else if(paramData == 3) {
						$(".floatImg").css({
							"background": "url('css/img/ui-yaojiang/win.png') center no-repeat",
							"background-size": "cover"
						});
						resultContent = "恭喜您获得三等奖";
					} else {
						$(".floatImg").css({
							"background": "url('css/img/ui-yaojiang/notwin.png') center no-repeat",
							"background-size": "cover"
						});
						resultContent = "还差一点，请继续努力";
					}
					// 获取弹出浮层框的宽与高
					var dWidth = $("#floatId").width();
					var dHeight = $("#floatId").height();
					// 设置浮层框的left 和 top定位
					oFloat.style.left = (wWidth - dWidth) / 2 + "px";
					oFloat.style.top = (wHeight - dHeight) / 2 + "px";
					$("#floatId").slideDown(2000);
					$scope.resultContent = resultContent;
					$scope.HaveTimes = params.number;
					$scope.$apply('resultContent');
				}
				$scope.closeFloatImg = function() {
					$("#floatId").slideUp("slow", function() {
						$("#mask").remove();
						$("#floatId").hide();
					});
				};
				$scope.JoinToFriend = function() {
					$scope[params.func1]();
				};
				$scope.$root.$on("$stateChangeSuccess",function(event, preparedState, lastState) {
					$("#mask").remove();
				});
			}
		};
	}]);

})(window, window.vx, window.$);
