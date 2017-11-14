(function (window, vx, undefined) {
	var mod = vx.module("ui.libraries");
	/**
	 * $os
	 * @author 
	 * @param {Object} window
	 * @param {Object} vx
	 * 获取终端设备型号及浏览器内核的服务
	 **/
	mod.factory('$os', function() {
		var os = {
			webkit : navigator.userAgent.match(/WebKit\/([\d.]+)/) ? true : false,
			android : navigator.userAgent.match(/(Android)\s+([\d.]+)/) || navigator.userAgent.match(/Silk-Accelerated/) ? true : false,
			androidICS : this.android && navigator.userAgent.match(/(Android)\s4/) ? true : false,
			ipad : navigator.userAgent.match(/(iPad).*OS\s([\d_]+)/) ? true : false,
			iphone : !(navigator.userAgent.match(/(iPad).*OS\s([\d_]+)/) ? true : false) && navigator.userAgent.match(/(iPhone\sOS)\s([\d_]+)/) ? true : false,
			ios : (navigator.userAgent.match(/(iPad).*OS\s([\d_]+)/) ? true : false) || (!(navigator.userAgent.match(/(iPad).*OS\s([\d_]+)/) ? true : false) && navigator.userAgent.match(/(iPhone\sOS)\s([\d_]+)/) ? true : false),
			ios5 : (navigator.userAgent.match(/(iPad).*OS\s([5_]+)/) ? true : false) || (!(navigator.userAgent.match(/(iPad).*OS\s([5_]+)/) ? true : false) && navigator.userAgent.match(/(iPhone\sOS)\s([5_]+)/) ? true : false),
			wphone : navigator.userAgent.match(/Windows Phone/i) ? true : false,
			firefox : navigator.userAgent.match(/Firefox/i) ? true: false
		};
		return os;
	});
})(window, vx);