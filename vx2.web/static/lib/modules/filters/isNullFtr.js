/*jshint smarttabs:true, eqeqeq:false, eqnull:true, laxbreak:true*/

/**
 * 过滤器命名规范：xxxFtr
 * 判空显示暂无
 */
(function (window, vx) {
	'use strict';

	vx.module("ui.libraries").filter('isNullFtr', function () {
		return function (input) {
			if (input === null || input === undefined) {
				return "暂无";
			}
			return input;
		};
	});

})(window, window.vx);