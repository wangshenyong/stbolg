/*jshint smarttabs:true, eqeqeq:false, eqnull:true, laxbreak:true*/
/**
 * @author	zly
 * @description 倒计时
 */
(function(window, vx, undefined) {'use strict';
	var directive = {};
	directive.uiCountdown = ['$log',
	function($log) {
		return {
			restrict : 'AE',
			scope:{
				"callbackfn":"&"
			},
			//按天计算
			template:'<span class="countdown"><span class="days">00</span>天<span class="hours">00</span>时<span class="minutes">00</span>分<span class="seconds">00</span>秒 </span>',
			//按小时计算
			//template:'<span class="countdown"><span class="hours">00</span>时<span class="minutes">00</span>分<span class="seconds">00</span>秒 </span>',
			link : function postLink(scope, element, attrs) {
				//兼容ios版本中获取时间戳返回NAN的情况，当日期格式由yyyy-MM-dd转换为yyyy/MM/dd
				//var CountDownTime=attrs.uiCountdown.replace(/\-/g, "/");
				//获取当前时间,已换算为北京时间，不需要添加时差
				var nowTime = attrs.uiNowtime||new Date().getTime();
				// var countDownTime = new Date(CountDownTime).getTime();
				// var daysBetweensCountDown = nowTime - countDownTime;
				$(element).downCount({
					date : attrs.uiCountdown,
					nowDate : nowTime
				}, function() {
					if (scope.callbackfn) {
						scope.callbackfn();
					}
				});
			}
		};
	}];
	vx.module('ibsapp').directive(directive);
})(window, window.vx);
