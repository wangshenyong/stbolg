/**
 * 账户格式化，四位一空格
 * @author：tian
 */
(function (window, vx) {
	'use strict';
	var ibsapp = vx.module("ui.libraries");

	function accountNoFilter() {
		return function (input) {
			if (input !== undefined)
				input = input.replace(/(.{4})/g, "$1 ");
			return input;
		};
	}


	ibsapp.filter('accountNoFilter', accountNoFilter);

})(window, window.vx);