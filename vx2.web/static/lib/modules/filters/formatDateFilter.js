/**
 * @author filter template 大写金额转换
 * @author：tian
 */
(function(window, vx) {
	'use strict';

	function formatDateFilter() {
		return function(input) {
			if(input !== undefined)
				return input.substring(0, 10);
		}
	}

	vx.module('ui.libraries').filter('formatDateFilter', formatDateFilter);

})(window, window.vx);