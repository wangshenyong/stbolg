/**
 * @author tian
 * filter 模糊账号处理    1234****5678
 */
(function (window, vx) {
	'use strict';

	function dimAcNoFilter() {
		return function (input) {
			if (input !== undefined)
				return input.substring(0, 4) + "****" + input.substring(input.length - 4);
		};
	}


	vx.module('ui.libraries').filter('dimAcNoFilter', dimAcNoFilter);

})(window, window.vx);