/* @author:xuxihai
 * 待完善，未处理请求完成后重置倒计时
 * 倒计时按钮指令(支持input和button元素)
 * usage:ui-timebtn='{"time":10,"callback":"sendSMS"}'
 * */
(function (vx, $) {
	'use strict';
	$.fn.timebtn = function (options) {
		var defaults = {
			time: 60,
			disableLabel: "重新获取",
			startCallback: null,
			endCallback: null,
		};

		function TimeButton(element) {
			var that = this;
			this.options = $.extend({}, defaults, options || {});
			if (element.is("input")) {
				this.type = "input";
				this.defaultLabel = element.val();
			} else if (element.is("button")) {
				this.type = "button";
				this.defaultLabel = element.text();
			} else {
				throw Error("element " + element[0].outerHTML + " is not a button!");
			}
			that.el = element;
			that.curr = this.options.time;
			that.el.on("click", function () {
				that.start();
			});
		}

		TimeButton.prototype = {
			labelUpdate: function (curr) {
				if (this.type == "input") {
					this.el.val(this.options.disableLabel + "(" + curr + ")");
				} else {
					this.el.text(this.options.disableLabel + "(" + curr + ")");
				}
			},
			labelReset: function () {
				if (this.type == "input") {
					this.el.val(this.defaultLabel);
				} else {
					this.el.text(this.defaultLabel);
				}
			},
			count: function () {
				var that = this;//计时器会变更执行环境
				that.timer = setInterval(function () { //计时器会变更执行环境
					if (that.curr < 2) {
						that.el.removeAttr("disabled");
						that.labelReset();
						that.curr = that.options.time;
						clearInterval(that.timer);
						var endcall = that.options.endCallback;
						if (endcall && typeof endcall == "function") {
							endcall.apply(that.el);
						}
					} else {
						that.curr--;
						that.labelUpdate(that.curr);
					}
				}, 1000);
			},
			start: function () {
				var startcall = this.options.startCallback;
				if (startcall && typeof startcall == "function") {
					startcall.apply(this.el);
				}
				this.el.attr("disabled", "true");
				this.labelUpdate(this.curr);
				this.count();
			}
		}
		return new TimeButton(this);
	};
	var mod = vx.module("ui.libraries");
	mod.directive("uiTimebtn",
		function () {
			return {
				restrict: 'A',
				link: function (scope, element, attrs) {
					var options = $.extend({
						time: 15
					}, vx.fromJson(attrs.uiTimebtn || {}));
					if (options.callback && scope[options.callback]) {
						options.startCallback = function () {
							scope.$apply(function () {
								scope[options.callback]();
							});
						};
					}
					element.timebtn(options);
				}
			};
		});
})(window.vx, window.$);