/**
 * @author Yu.j.h 14/8/29 背景垂直滚动
 */
(function (window, vx, undefined) {
	'use strict';
	var directive = {};
	directive.uiBgimgscroller = ["$log",
		function ($log) {
			return {
				restrict: "A",
				replace: false,
				compile: function (element, attrs) {

					var newImg = new Image();
					var pic_real_height = newImg.height;
					var pic_real_width = newImg.width;

					function loadImg() {
						//背景图片的实际width值和实际height值
						pic_real_height = newImg.height;
						pic_real_width = newImg.width;
					};

					if (navigator.userAgent.indexOf("Firefox") != -1) {
						//支持Firefox浏览器
						window.onload = loadImg;
						loadImg = new loadImg();
						newImg.src = $('#backgimg').css("backgroundImage") && $('#backgimg').css("backgroundImage").slice(5, -2);
					} else {
						//支持Chrome浏览器
						newImg.onload = function () {
							//背景图片的实际width值和实际height值f
							pic_real_height = newImg.height;
							pic_real_width = newImg.width;
						}
						newImg.src = $('#backgimg').css("backgroundImage") && $('#backgimg').css("backgroundImage").slice(5, -2);
					}

					//背景图片的初始top值
					var basetop = $('#backgimg').css("background-position") && parseInt($('#backgimg').css("background-position").split(" ")[1]);
					//背景图片实时的top值
					var imgtop = basetop;
					//背景图片在窗口中width值
					var imgwidth = parseInt($('#backgimg').width());
					var imgsign = 0;

					//滚动到顶部（或底部）的时间
					var scrollertime = (attrs.uiBgimgscroller.length === 0 || attrs.uiBgimgscroller === null) ? "50" : attrs.uiBgimgscroller;
					//滚动到顶部（或底部）滞留的时间
					var staytime = 3000;

					function scroller(scrollertime) {

						if (imgsign == 0) {
							var upFlag = window.setInterval(function () {

								if (imgtop > basetop + 150 - Math.floor((pic_real_height / pic_real_width) * imgwidth - 10)) {
									imgtop--;
									$('#backgimg').css({
										"background-position": "0px " + imgtop + "px"
									});
								} else {
									window.clearInterval(upFlag);
									imgsign = 1;
								}
							}, scrollertime);
						}

						if (imgsign == 1) {
							var downFlag = window.setInterval(function () {
								if (imgtop < basetop) {
									imgtop++;
									$('#backgimg').css({
										"background-position": "0px " + imgtop + "px"
									});
								} else {
									window.clearInterval(downFlag);
									imgsign = 0;
								}
							}, scrollertime);
						}

						var Flag = window.setTimeout(function () {
							scroller(scrollertime);
						}, staytime);

					};

					scroller(scrollertime);

					$(window).resize(function () {
						$('#backgimg').css({
							"background-position": "0px " + basetop
						});
						imgtop = basetop;
						imgsign = 0;
						imgwidth = parseInt($('#backgimg').width());
					});
				},
				link: function postLink() {

				}
			};
		}];

	vx.module('ibsapp').directive(directive);
})(window, window.vx);