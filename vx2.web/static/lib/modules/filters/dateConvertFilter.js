/**
 * @author 日期yyyyMMdd转换成yyyy-MM-dd
 * @author：tian
 */
(function(window, vx) {
	'use strict';

	// accountNo.$inject = ['$locale'];
	function dateConvertFilter() {
		return function(input) {
			if (input !== undefined) {
				if (/^\d{8}$/g.test(input) == true) {
					input = input.substring(0, 4) + '-' + input.substring(4, 6)
							+ '-' + input.substring(6, input.length);
				}

			}
			return input;
		};
	}

	vx.module('ui.libraries').filter('dateConvertFilter', dateConvertFilter);

})(window, window.vx);