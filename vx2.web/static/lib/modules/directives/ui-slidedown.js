(function (window, vx, undefined) {
	'use strict';
	var directive = {};
	directive.uiSlidedown = [function () {
		return {
			restrict: 'A',
			compile: function (element, attrs) {
				element.find(".accordion-frame>a").on("click", function (event) {
					var next = $(this).next();
					if (next.is(":visible")) {
						$(next).slideUp();
					} else {
						$(next).slideDown();
					}
				});
			}
		}
	}];

	vx.module('ibsapp').directive(directive);

})(window, window.vx);