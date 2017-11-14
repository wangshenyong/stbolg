/**
 * 获取短信验证码按钮倒计时指令，该指令暂时适用于button控件
 * <button class="btn btn-small" v-Sms="getToken()">获取验证码</button>
 */
(function (window, vx, $) {
	'use strict';
	var mod = vx.module("ui.libraries");
	mod.directive("uiSms", ["$timeout", function ($timeout) {
		return {
			restrict: 'A',
			scope: false,
			link: function (scope, element, attrs) {
				var fnName = attrs.uiSms;

				if (fnName.indexOf('(') != -1) {
					fnName = fnName.substring(0, fnName.indexOf('('));
				}
				var SECEND = 10;
				var count = SECEND;
				var timeid;
				var history = 0;
				var text = "";
				//监听页面是否跳转
				var closeId;
				element.bind("click", function () {
					text = element.text();
					element.text(text + "(" + SECEND + ")");
					element.attr("disabled", "disabled");
					decrement();
					scope.$on("$remoteError", function (event, url, error) {
						//if(error.indexOf("动态密码错误") >= 0){
						$timeout.cancel(timeid);
						$timeout.cancel(closeId);
						element.text(text + "(" + count + ")");
						element.text(text);
						count = SECEND;
						element.removeAttr("disabled");
						scope["OTPPassword"] = null;
						scope["OTPSeq"] = null;
						//}
					});
					// history = NativeCall.history.length;
					// closeTimeout();
					scope[fnName]();
				});

				function decrement() {
					timeid = $timeout(function () {
						count = count - 1;
						if (count == 0) {
							$timeout.cancel(timeid);
							element.text(text + "(" + count + ")");
							element.text(text);
							count = SECEND;
							element.removeAttr("disabled");
						} else {
							element.text(text + "(" + count + ")");
							decrement();
						}

					}, 1000);

				}

				/**
				 * 跳转页面时退出计时
				 */
				//
				// function closeTimeout() {
				// 	closeId = $timeout(function () {
				// 		if (history != NativeCall.history.length) {
				// 			$timeout.cancel(timeid);
				// 			$timeout.cancel(closeId);
				// 			element.text(text + "(" + count + ")");
				// 			element.text(text);
				// 			count = SECEND;
				// 			element.removeAttr("disabled");
				// 		} else {
				// 			closeTimeout();
				// 		}
				// 	}, 100);
				// }
			}
		}

	}]);
})(window, window.vx, window.$);

/**
 * 待完善的指令
 */
(function (window, vx, $) {
	'use strict';
	/**
	 * 获取短信验证码按钮倒计时指令，该指令暂时适用于button控件
	 * <button class="btn btn-small" ui-Sms>获取验证码</button>
	 */
	vx.module("ui.libraries").directive("uiSms2",
			["$timeout", '$parse', "$rootScope", function ($timeout, $parse, $rootScope) {
				return {
					restrict: 'A',
					scope: false,
					link: function (scope, element, attrs) {
						var defaults = {
							"tokenType": "",
							"phonenoflag": false,
							"phoneno": "",
							"clock": false,
							"clockId": "clock",
							"showId": "showClock",
							"promptMessId": "promptMessId"
						};
						var options = $.extend({}, defaults, vx.fromJson(attrs.uiSms2 || {}));
						var SECEND = 60;
						var count = SECEND;
						var timeid;
						var history = 0;
						var text = "";
						element.bind("click", function () {
							options = $.extend({}, defaults, vx.fromJson(attrs.uiSms || {}));
							text = element.text();
							if (options.phonenoflag && vx.equals(options.phoneno, "")) {
								scope.toast("手机号码不能为空");
								return false;
							}
							if (options.phonenoflag && !vx.equals(options.phoneno, "")) {
								if (!(/^1[3|4|5|7|8][0-9]\d{8}$/.test(options.phoneno))) {
									scope.toast("手机号码不符合要求格式");
									return false;
								}
							}
							// 有小闹钟倒计时的
							if (options.clock) {
								if ($("#" + options.clockId).hasClass("active")) {
									$("#" + options.clockId).removeClass("active");
								}
								$("#" + options.clockId).text(SECEND);
								$("#" + options.showId).show();
							} else {
								// 没有小闹钟的时候
								element.text(SECEND + "秒后");
							}
							//element.text(text+"("+SECEND+")");
							element.attr("disabled", "disabled");
							if (options.clock) {
								decrement2(options.showId, options.clockId);
							} else {
								// 没有小闹钟的时候
								decrement();
							}

							scope.$on("$remoteError", function (event, url, error) {
								$timeout.cancel(timeid);
								//element.text(text+"("+count+")");
								// 有小闹钟倒计时的
								if (options.clock) {
									if ($("#" + options.clockId).hasClass("active")) {
										$("#" + options.clockId).removeClass("active");
									}
									$("#" + options.clockId).text(SECEND);
									//$("#"+options.showId).hide();
								} else {
									// 没有小闹钟的时候
									element.text(text);
								}
								count = SECEND;
								element.removeAttr("disabled");
								//scope["OTPPassword"] = null;
							});
							//history = NativeCall.history.length;
							/*
							 * @author
							 * button recover when $pageContentLoaded
							 */
							scope.$on("$pageContentLoaded", function (even, viewportId, pageIndex, target) {
								$timeout.cancel(timeid);
								//$("#"+showId).hide();
								if (options.clock) {
									if ($("#" + options.clockId).hasClass("active")) {
										$("#" + options.clockId).removeClass("active");
									}
									$("#" + options.clockId).text(SECEND);
								}
								$("#" + options.promptMessId).text("");
								element.text(text);
								count = SECEND;
								element.removeAttr("disabled");
							});
							// 发送短信验证码
							if (vx.equals(options.phoneno, "")) {
								scope.getTelMess("", options.promptMessId);
							} else {
								scope.getTelMess(options.phoneno, options.promptMessId, options.tokenType);
							}
						});
						// 没有小闹钟时
						function decrement() {
							timeid = $timeout(function () {
								count = count - 1;
								if (count == 0) {
									$timeout.cancel(timeid);
									element.text(count + "秒后");
									element.text(text);
									count = SECEND;
									element.removeAttr("disabled");
								} else {
									element.text(count + "秒后");
									decrement();
								}

							}, 1000);
						};
						// 有小闹钟时
						function decrement2(showId, clockId) {
							timeid = $timeout(function () {
								count = count - 1;
								if (count == 0) {
									$timeout.cancel(timeid);
									$("#" + clockId).text(count);
									//$("#"+showId).hide();
									//element.text(text);
									count = SECEND;
									element.removeAttr("disabled");
								} else {
									if (count.toString().length == 1) {
										$("#" + clockId).addClass("active");
									} else {
										$("#" + clockId).removeClass("active");
									}
									$("#" + clockId).text(count);
									decrement2(showId, clockId);
								}

							}, 1000);
						};
					}
				}

			}]);
})(window, window.vx, window.$);
