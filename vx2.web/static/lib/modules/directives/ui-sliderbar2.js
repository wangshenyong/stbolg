/**
 * @author wbr
 * <div id="AmountSliderbar" ui-sliderbar='{{SliderbarOptions}}' class="span10"></div>
 * uiSliderbarCtrl.$inject = ['$scope', 'uiSliderbar'];
 * //以下为SliderbarOptions默认值，可根据需求改变某个字段
 * $scope.SliderbarOptions = {
 *      "title" : "贷款金额",       //左上角标题
 *      "min" : 0,              //滑动条最小值
 *      "minTitle" : "最低",      //滑动条最小值标题
 *      "max" : 100,            //滑动条最大值
 *      "maxTitle" : "最高",      //滑动条最大值标题
 *      "step" : 1,             //每次滑动改变量
 *      "value" : 0,            //默认显示值
 *      "setVModel" : "amount"  //绑定的v-model名
 *      "callbackName" : "XXX"  //回调函数名
 *      "operate":false// 是否显示调整额度按钮
 * };
 */
(function(window, vx, $, undefined) {'use strict';
	var directive = {};
	directive.uiSliderbar2 = ['$compile', '$os', '$timeout',
	function($compile, $os, $timeout) {
		return {
			restrict : 'A',
			replate : true,
			templateUrl : "lib/template/sliderbar/sliderbar.html",
			scope : {
				opt : '='
			},
			link : function(scope, element, attr) {
				var defaults = {
					title : "贷款金额",
					min : 0,
					minTitle : "最低",
					max : 100,
					maxTitle : "最高",
					step : 1,
					value : 0,
					setVModel : "amount",
					callbackName : null,
					operate : false
				};
				var sliderBar, options = $.extend(defaults, vx.fromJson(attr.uiSliderbar2 || {}));
				scope.opt = options;
				// 默认赋值
				options.scope = vx.element(element).scope();
				if (options.setVModel) {
					options.scope[options.setVModel] = options.value;
					scope[options.setVModel] = options.value;
				}
				if (!options.scope.$$phase) {
					options.scope.$digest();
				}
				resetSliderbar(options, element);
				//start
				function resetSliderbar(options, element) {
					//start func
					var template = "";
					options.scope = vx.element(element).scope();

					var Slider = function() {
						this.element = vx.element(element);
						this.picker = element.children();
						/*element.hide();*/

						var barWidth = this.element.outerWidth() - 20;
						this.picker.css('width', barWidth);
						this.picker.find('.slider-bar').css('width', barWidth);

						$compile(this.picker)(options.scope);

						this.stylePos = 'left';
						this.mousePos = 'pageX';
						this.sizePos = 'offsetWidth';

						this.min = options.min;
						this.max = options.max;
						this.step = options.step;
						this.value = options.value;
						this.callbackName = options.callbackName;
						this.operate = options.operate;

						this.selectionEl = this.picker.find('.slider-selection');
						this.selectionElStyle = this.selectionEl[0].style;
						this.handleEl = this.picker.find('.slider-handle');
						this.handleElStyle = this.handleEl[0].style;
						this.offset = this.picker.find('.slider-bar').offset();
						this.size = this.picker.find('.slider-bar')[0][this.sizePos];

						this.value = Math.max(this.min, this.value);
						this.diff = this.max - this.min;
						this.percentage = [(this.value - this.min) * 100 / this.diff, this.step * 100 / this.diff];

						this.layout();

						if ($os.ios || $os.android || $os.wphone) {
							this.touchCapable = true;
						}
						if (this.operate) {
							this.picker.find(".slider-delete").on({
								"click" : $.proxy(this.deleteVal, this)
							});
							this.picker.find(".slider-add").on({
								"click" : $.proxy(this.addVal, this)
							});
						}
						if (this.touchCapable) {
							this.picker.find('.slider-bar').on({
								touchstart : $.proxy(this.mousedown, this)
							});
						} else {
							this.picker.find('.slider-bar').on({
								mousedown : $.proxy(this.mousedown, this)
							});
						}

						this.setValueToVModel(this.value);

						return this;
					};
					//slider.prototype start
					Slider.prototype = {
						constructor : Slider,

						layout : function() {
							this.handleElStyle[this.stylePos] = this.percentage[0] + '%';
							this.selectionElStyle.width = Math.abs(this.percentage[0]) + '%';
						},

						mousedown : function(ev) {
							if (this.touchCapable && ev.type === 'touchstart') {
								ev = ev.originalEvent;
							}
							this.percentage[0] = this.getPercentage(ev);
							if (this.touchCapable) {
								vx.element(window.document).on({
									touchmove : $.proxy(this.mousemove, this),
									touchend : $.proxy(this.mouseup, this)
								});
							} else {
								vx.element(window.document).on({
									mousemove : $.proxy(this.mousemove, this),
									mouseup : $.proxy(this.mouseup, this)
								});
							}
							var val = this.calculateValue();
							this.layout();
							this.setValueToVModel(val);
							return false;
						},

						mousemove : function(ev) {
							if (this.touchCapable && ev.type === 'touchmove') {
								ev = ev.originalEvent;
							}
							this.percentage[0] = this.getPercentage(ev);
							var val = this.calculateValue();
							this.layout();
							this.setValueToVModel(val);
							return false;
						},

						mouseup : function() {
							if (this.touchCapable) {
								vx.element(window.document).off({
									touchmove : this.mousemove,
									touchend : this.mouseup
								});
							} else {
								vx.element(window.document).off({
									mousemove : this.mousemove,
									mouseup : this.mouseup
								});
							}
							if (this.callbackName) {
								options.scope[this.callbackName](this);
							}
							return false;
						},

						calculateValue : function() {
							var val;
							val = (this.min + Math.round((this.diff * this.percentage[0] / 100) / this.step) * this.step);
							this.value = val;
							return val;
						},

						getPercentage : function(ev) {
							if (this.touchCapable) {
								ev = ev.touches[0];
							}
							var percentage = (ev[this.mousePos] - this.offset[this.stylePos]) * 100 / this.size;
							percentage = Math.round(percentage / this.percentage[1]) * this.percentage[1];
							return Math.max(0, Math.min(100, percentage));
						},

						setValueToVModel : function(val) {
							if (options.setVModel) {
								options.scope[options.setVModel] = val;
								scope[options.setVModel] = val;
							}
							if (!options.scope.$$phase) {
								options.scope.$digest();
							}
						},
						deleteVal : function() {
							if (this.percentage[0] > 0) {
								var temp = this.percentage[0] - this.percentage[1];
								this.percentage[0] = temp;
							}
							var val = this.calculateValue();
							this.layout();
							this.setValueToVModel(val);
							return false;
						},
						addVal : function() {
							if (this.percentage[0] < 100) {
								var temp = this.percentage[0] + this.percentage[1];
								this.percentage[0] = temp;
							}
							var val = this.calculateValue();
							this.layout();
							this.setValueToVModel(val);
							return false;
						}
					};

					var prev = element.prevAll('.slider');
					if (prev) {
						prev.remove();
					}
					sliderBar = new Slider();

					return sliderBar;
					//end func
				}

				//end
			},
			link2 : function(scope, element, attr) {
				var defaults = {
					title : "贷款金额",
					min : 0,
					minTitle : "最低",
					max : 100,
					maxTitle : "最高",
					step : 1,
					value : 0,
					setVModel : "amount",
					callbackName : null,
					operate : false
				};

				var sliderBar, options = $.extend(defaults, vx.fromJson(attr.uiSliderbar2 || {}));

				resetSliderbar(options, element);
				//start
				function resetSliderbar(options, element) {
					//start func
					var template = "";
					options.scope = vx.element(element).scope();

					if (options.operate) {
						template = vx.element('<div class="slider"><div class="slider-delete">-</div><div class="slider-bar">' + '<div class="slider-selection"></div>' + '<div class="slider-handle"></div></div>' + '<div class="slider-title">' + options.title + '</div>' + '<div class="slider-min">' + options.minTitle + ' ' + options.min + '</div>' + '<div class="slider-input" v-bind="' + options.setVModel + '"></div>' + '<div class="slider-max ">' + options.maxTitle + ' ' + options.max + '</div><div class="slider-add">+</div></div>');
					} else {
						template = vx.element('<div class="slider"><div class="slider-bar">' + '<div class="slider-selection"></div>' + '<div class="slider-handle"></div></div>' + '<div class="slider-title">' + options.title + '</div>' + '<div class="slider-min">' + options.minTitle + ' ' + options.min + '</div>' + '<div class="slider-input" v-bind="' + options.setVModel + '"></div>' + '<div class="slider-max ">' + options.maxTitle + ' ' + options.max + '</div></div>');
					}

					var Slider = function() {
						this.element = vx.element(element);
						this.picker = template.insertBefore(element);
						element.hide();

						var barWidth = this.element.outerWidth() - 20;
						this.picker.css('width', barWidth);
						this.picker.find('.slider-bar').css('width', barWidth);

						$compile(this.picker)(options.scope);

						this.stylePos = 'left';
						this.mousePos = 'pageX';
						this.sizePos = 'offsetWidth';

						this.min = options.min;
						this.max = options.max;
						this.step = options.step;
						this.value = options.value;
						this.callbackName = options.callbackName;
						this.operate = options.operate;

						this.selectionEl = this.picker.find('.slider-selection');
						this.selectionElStyle = this.selectionEl[0].style;
						this.handleEl = this.picker.find('.slider-handle');
						this.handleElStyle = this.handleEl[0].style;
						this.offset = this.picker.find('.slider-bar').offset();
						this.size = this.picker.find('.slider-bar')[0][this.sizePos];

						this.value = Math.max(this.min, this.value);
						this.diff = this.max - this.min;
						this.percentage = [(this.value - this.min) * 100 / this.diff, this.step * 100 / this.diff];

						this.layout();

						if ($os.ios || $os.android || $os.wphone) {
							this.touchCapable = true;
						}
						if (this.operate) {
							this.picker.find(".slider-delete").on({
								"click" : $.proxy(this.deleteVal, this)
							});
							this.picker.find(".slider-add").on({
								"click" : $.proxy(this.addVal, this)
							});
						}
						if (this.touchCapable) {
							this.picker.find('.slider-bar').on({
								touchstart : $.proxy(this.mousedown, this)
							});
						} else {
							this.picker.find('.slider-bar').on({
								mousedown : $.proxy(this.mousedown, this)
							});
						}

						this.setValueToVModel(this.value);

						return this;
					};
					//slider.prototype start
					Slider.prototype = {
						constructor : Slider,

						layout : function() {
							this.handleElStyle[this.stylePos] = this.percentage[0] + '%';
							this.selectionElStyle.width = Math.abs(this.percentage[0]) + '%';
						},

						mousedown : function(ev) {
							if (this.touchCapable && ev.type === 'touchstart') {
								ev = ev.originalEvent;
							}
							this.percentage[0] = this.getPercentage(ev);
							if (this.touchCapable) {
								vx.element(window.document).on({
									touchmove : $.proxy(this.mousemove, this),
									touchend : $.proxy(this.mouseup, this)
								});
							} else {
								vx.element(window.document).on({
									mousemove : $.proxy(this.mousemove, this),
									mouseup : $.proxy(this.mouseup, this)
								});
							}
							var val = this.calculateValue();
							this.layout();
							this.setValueToVModel(val);
							return false;
						},

						mousemove : function(ev) {
							if (this.touchCapable && ev.type === 'touchmove') {
								ev = ev.originalEvent;
							}
							this.percentage[0] = this.getPercentage(ev);
							var val = this.calculateValue();
							this.layout();
							this.setValueToVModel(val);
							return false;
						},

						mouseup : function() {
							if (this.touchCapable) {
								vx.element(window.document).off({
									touchmove : this.mousemove,
									touchend : this.mouseup
								});
							} else {
								vx.element(window.document).off({
									mousemove : this.mousemove,
									mouseup : this.mouseup
								});
							}
							if (this.callbackName) {
								options.scope[this.callbackName](this);
							}
							return false;
						},

						calculateValue : function() {
							var val;
							val = (this.min + Math.round((this.diff * this.percentage[0] / 100) / this.step) * this.step);
							this.value = val;
							return val;
						},

						getPercentage : function(ev) {
							if (this.touchCapable) {
								ev = ev.touches[0];
							}
							var percentage = (ev[this.mousePos] - this.offset[this.stylePos]) * 100 / this.size;
							percentage = Math.round(percentage / this.percentage[1]) * this.percentage[1];
							return Math.max(0, Math.min(100, percentage));
						},

						setValueToVModel : function(val) {
							if (options.setVModel) {
								options.scope[options.setVModel] = val;
								scope[options.setVModel] = val;
							}
							if (!options.scope.$$phase) {
								options.scope.$digest();
							}
						},
						deleteVal : function() {
							if (this.percentage[0] > 0) {
								var temp = this.percentage[0] - this.percentage[1];
								this.percentage[0] = temp;
							}
							var val = this.calculateValue();
							this.layout();
							this.setValueToVModel(val);
							return false;
						},
						addVal : function() {
							if (this.percentage[0] < 100) {
								var temp = this.percentage[0] + this.percentage[1];
								this.percentage[0] = temp;
							}
							var val = this.calculateValue();
							this.layout();
							this.setValueToVModel(val);
							return false;
						}
					};

					var prev = element.prevAll('.slider');
					if (prev) {
						prev.remove();
					}
					sliderBar = new Slider();

					return sliderBar;
					//end func
				}

				//end
			}
		};
	}];

	vx.module('ui.libraries').directive(directive);

})(window, window.vx, jQuery);
