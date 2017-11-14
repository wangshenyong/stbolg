/*jshint smarttabs:true, eqeqeq:false, eqnull:true, laxbreak:true */
/**
 * @author fangpinghui
 */
(function (window, vx, undefined) {
	'use strict';

	var directive = {};

	directive.uiMenupull = [function () {
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				$(element).find("a.dropdown-toggle,.element1").bind("click", function (e) {
					e.preventDefault();
					e.stopPropagation();
					$(this).next("ul").slideToggle('normal', function () {
						$(this).css("overflow", "");
					});
					$(this).parent().siblings().find("ul").slideUp();

				});
				$(element).find(".element-menu a[class!='dropdown-toggle']").bind("click", function (e) {
					e.preventDefault();
					e.stopPropagation();
					//收起菜单dropdown-menu
					if ($(element).find(".pull-menu").is(":hidden")) {
						$(element).find(".element-menu .dropdown-menu").slideUp();
					} else {
						$(element).find(".element-menu").slideUp();
					}
				});
				$("body").bind("click", function () {
					if ($(element).find(".pull-menu").is(":hidden")) {
						$(element).find(".element-menu .dropdown-menu").slideUp();
					} else {
						$(element).find(".element-menu").slideUp();
					}
				});
			}
		}
	}];

	vx.module('ibsapp').directive(directive);

})(window, window.vx);