/**
 * @authot
 * filter 加密手机号码    123****5678
 */
(function(window, vx) {
	'use strict';

	function dimPhoneNumFilter() {
		return function(input) {
			if(input !== undefined)
				return input.substring(0, 3) + "****" + input.substring(input.length - 4);
		};
	}

	vx.module('ui.libraries').filter('dimPhoneNumFilter', dimPhoneNumFilter);

})(window, window.vx);