/**
 * @author HQC
 * <input type="text" v-model="prdcode" ui-carousel="PrdList"  incoming-field="des;rate" select-call="select(index)/>
 * v-model:model值，要求与json中字段一致
 * repeat  内部循环List
 * incoming-field 显示的字段,传入时需用;分割开来
 * index 记录当前产品在List位于第几个
 */
(function (window, vx, undefined) {
	'use strict';
	var directive = {};

	var RESPLEVEL = 5;

	directive.uiCarousel3 = [
		'$parse', '$compile',
		function ($parse, $compile) {
			return {
				restrict: 'A',
				link: function (scope, element, attrs) {
					var carouselList = attrs.uiCarousel3;
					var selectCall = attrs.selectCall;
					var incomingField = attrs.incomingField;
					var carouselEl = '' +
						'<div class="zy-Slide stage_area">' +
						'   <ul class=\"container_area\"></ul>' +
						"</div>";
					element.hide();
					carouselEl = $(carouselEl);
					element.after(carouselEl);
					if (incomingField) {
						var fileds = incomingField.split(';');
					}
					scope.$watch(carouselList, function (newLis) {
						if (newLis) {
							createCarousel(newLis);
						}
					});
					function createCarousel(carouselList) {
						// 显示图片
						var htmlPic = '',
							startX,
							startTime,
							endTime,
							moveEndX,
							window_th = $(window).width(),
							viewWidth = window_th * 0.4,
							length = carouselList.length,
							eleStage = carouselEl,
							eleContainer = eleStage.children().first(),
							currentIndex,
							rotate = 360 / length;
						eleContainer.css({
							"margin-left": -viewWidth / 2,
							"width": viewWidth
						});
						for (var i = 0; i < length; i++) {
							var temp = carouselList[i];
							htmlPic = htmlPic +
								'<li id="piece' + i + '" class="piece" style="width:' + viewWidth + 'px"> ' +
								'   <span  class="des">' + temp[fileds[0]] + '</span>' +
								'   <span class="rate">' + Number(temp[fileds[1]] * 100).toFixed(2) + '%</span>' +
								'</li>';
						}
						var transZ = viewWidth / 2 / Math.tan((rotate / 2 / 180) * Math.PI);
						eleContainer.html(htmlPic);
						for (var i = 0; i < length; i++) {
							var piece = $("#piece" + i);
							transform(piece, "rotateY(" + i * rotate + "deg) translateZ(" + (transZ + rotate / 2) + "px)");
							if (i === 0) {
								piece.addClass("active");
								currentIndex = 0;
								attrs.currentRotate = 0;
							}
							piece.data("indexDeg", i * rotate);
						}
						eleContainer.on({
							"touchstart": function (e) {
								var initial = attrs.initial || true;
								startTime = Date.now();
								e.stopPropagation();
								if (initial == 'true') {
									startX = e.originalEvent.touches[0].pageX;
									attrs.initial = false;
								} else {
									startX = e.originalEvent.touches[0].pageX;
								}
								e.preventDefault();
							},
							"touchmove": function (event) {
								if (length > 1) {
									var moveDistince,
										speed,
										offset;//移动后的计算位置
									endTime = Date.now();
									moveEndX = event.originalEvent.changedTouches[0].pageX;
									moveDistince = moveEndX - startX;
									speed = moveDistince / (endTime - startTime) * 1000;
									offset = speed / RESPLEVEL / 10; //RESPLEVEL移动系数，计算移动后的位置
									transform(eleContainer, "rotateY(" + (attrs.currentRotate + offset) + "deg)");
									attrs.currentRotate = attrs.currentRotate + offset;
								}

							},
							"touchend": function (event) {
								if (length > 1) {
									var viewNumbers, posDeg;//刻度尺显示位置到０的格数
									viewNumbers = Math.round(attrs.currentRotate / rotate);
									posDeg = viewNumbers * rotate;
									transform(eleContainer, "rotateY(" + posDeg + "deg)");
									attrs.currentRotate = posDeg;
									selectEl(posDeg);
								}
							}
						});
						function selectEl(containerDeg) {
							var lis = eleContainer.children();
							for (var i = 0, len = lis.length; i < len; i++) {
								var el = $(lis[i]);
								var deg = el.data("indexDeg");
								if ((containerDeg + deg) % 360 === 0) {
									lis.removeClass("active");
									el.addClass("active");
									scope.$apply(function () {
										var index = el.index(), ngModel = attrs.ngModel;
										if (ngModel) {
											scope[ngModel] = carouselList[index];
										}
										scope.$eval(selectCall, {
											index: index
										});
									});
								}
							}
						}
					}

					function transform(el, value, key) {
						key = key || "transform";
						el.css("-webkit-" + key, value);
						return el;
					}
				}
			};

		}];
	vx.module('ibsapp').directive(directive);
})(window, window.vx);
