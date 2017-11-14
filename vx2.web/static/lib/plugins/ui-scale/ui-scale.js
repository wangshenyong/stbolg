/**
 * @author HQC
 * @description 刻度尺
 * <input type="text" v-model="Amount" ui-scale="199000" base-scale="1000" initial-value="8" data-initial='true' main-value="0" class="zhiquts_01 add">
 */
(function(window, vx, undefined) {
	'use strict';
	var directive = {};
	directive.uiScale = [
			'$compile',
			function($compile) {
				return {
					restrict : 'A',
					require : 'ngModel',
					link : function(scope, element, attrs) {
						var totalScale = parseInt(scope.$eval(attrs.uiScale)), scaleList = [], baseScale = parseInt(scope.$eval(attrs.baseScale));
						// 创建刻度尺
						function createScale() {
							var temp = '<div class="uiscale" data-page="profile1" id="scale">'
								+ '<div class="uiscale-main">'

								+ '<label class="label">我要买<span class="number width-num" v-bind="'+attrs.ngModel+'|number:0" v-click="showNumBtn=true;" v-show="!showNumBtn"></span><input type="number" class="number width-num" v-focus="'+attrs.ngModel+'=undefined;" v-blur="changeAmount()" v-model="'+attrs.ngModel+'" v-show="showNumBtn"/><span class="letter">元</span> </label>'
								+ '<div style="width:100%;height: 3rem;z-index:20;position: absolute;" v-show="showNumBtn" v-click="undisCal()"></div>'
								+ '<div class="ruler ruler-height">'
								+ '<div class="main" value="-1">'
								+ '<ul data-initial="true"><span class="strnum">0</span>'
								+ '<li class="keduc" id="keduc" v-repeat="row in scaleList" v-class="$index==0?\'first\':\'\'"><span class="num" v-bind="row.scaleNum"></span></li>'
								+ '</ul>'
								+ '</div>'
								+ '<div class="arrow"></div>'
								+ '</div>' + '</div>';
							var coutemp = $(temp);
							$(element).css("display", "none");
							$(element).after(coutemp);
							$compile(coutemp)(scope);
						};
						// 输入框失去焦点时置下方触摸有效
						scope.undisCal = function(){
							if(scope.showNumBtn){
								scope.showNumBtn=false;
							}
						};
						// 失去焦点时事件
						scope.changeAmount = function(){
							scope.undisCal();
							scope[attrs.ngModel] = scope[attrs.ngModel] ? scope[attrs.ngModel] : 0;
							var amount = parseInt(scope[attrs.ngModel]/(baseScale/10))*(baseScale/10);
							if(amount<0){
								amount=0;
							}else if(amount>totalScale){
								amount = totalScale;
							}
							scope[attrs.ngModel] = amount;
							$('.ruler .main').css({'-webkit-transform' : 'translateX(' + (parseInt(init_x) * mulriple - amount / 10)+ 'px)'});
							attrs.mainValue = (parseInt(init_x)* mulriple - amount / 10);
						};
						createScale();
						for ( var i = 0; i < totalScale; i += baseScale) {
							scaleList.push({
								"scaleNum" : i + baseScale
							});
						}
						scope.scaleList = scaleList;
						var end = -100 * (scaleList.length)
								+ $(document).width() / 2;// 结束偏移坐标范围
						// 不能继续往右边滑动了
						var start = Math.ceil($(document).width() / 2);// 开始偏移坐标范围
						// 不能继续往左边滑动了
						var mulriple = 1;// 1000像素有4个像素的误差 *mulriple 1040
						var init_x = $(document).width() / 2;// 初始位置
						// 刚进入页面刻度尺坐标值
						var uiValue =scope.$eval(attrs.ngModel);
						scope[attrs.ngModel] = scope.$eval(attrs.ngModel);
						var startX, moveEndX;
						// 偏移量
						var minmul =  Math.round(10 - $(document).width() / 2 % 10);
						minmul = minmul == 10 ? 0 : minmul;
						$('.ruler .main').css({'-webkit-transform' : 'translateX('+ (parseInt(init_x)* mulriple - uiValue / 10)+ 'px)'});
						var scaleEle = $(element.next("#scale").find(".ruler"));
						attrs.mainValue = (parseInt(init_x)* mulriple - uiValue / 10);
						scaleEle.bind({"touchstart" : function(e) {
										var initial = attrs.initial || true;
										e.stopPropagation();
										if (initial == 'true') {
											startX = e.originalEvent.touches[0].pageX;
											attrs.initial = false;
										} else {
											startX = e.originalEvent.touches[0].pageX;
										}
										e.preventDefault();
									},
									"touchmove" : function(e) {
										// 鼠标移动事件监听
										var number = parseInt(uiValue);
										// 移动结束X坐标
										moveEndX = e.originalEvent.changedTouches[0].pageX;
										var moveDistince = moveEndX - startX;
										var left = (startX - moveEndX) < 0;
										// 判断往左边滑动还是右边滑动
										if (left) {
											// 刻度尺偏移量
											var a = moveEndX - startX,a_size = parseInt(a/30)==0?1:parseInt(a/30);
											if(a<=30){
												var offset = parseInt((moveEndX - startX)/10) + parseInt(attrs.mainValue);
											}else{
												var offset = parseInt((moveEndX - startX)/10) * parseInt(a_size/2) + parseInt(attrs.mainValue);
											}
											if (offset - start >= 0) {
												scaleEle.find(".main").css({'-webkit-transform' : 'translateX(' + start + 'px)', "-webkit-transition":"-webkit-transform 0.5s ease"});
												attrs.mainValue = start;
												scope[attrs.ngModel] = Math.abs((start - attrs.mainValue) * 100 / 10);
												scope.$apply();
											} else {
												offset = Math.ceil((offset * mulriple / 10)) * 10;
												scaleEle.find(".main").css({'-webkit-transform' : 'translateX('+ (offset * mulriple - minmul)+ 'px)', "-webkit-transition":"-webkit-transform "+0.5+"s ease"});
												attrs.mainValue = offset;
												scope[attrs.ngModel] = Math.abs(Math.ceil((start - offset) /10)) * 100;
												scope.$apply();
											}
										} else {
											if(moveDistince>=-30){
												moveDistince = moveDistince;
											}else{
												moveDistince = Math.abs(parseInt(moveDistince/30))*moveDistince;
											}
											var offset = (parseInt(attrs.mainValue)+moveDistince/10).toFixed(0);
											if (offset - end <= 0) {
												// 移动到最右边 不能再移动
												scope[attrs.ngModel] = Math.abs(Math.floor(start - end) * 1000 / 100);
												scope.$apply();
												scaleEle.find(".main").css({'-webkit-transform' : 'translateX(' + end * mulriple+ 'px)', "-webkit-transition":"-webkit-transform 0.2s ease-in-out"});
												attrs.mainValue = end;
											} else {
												// 没有移动到最右边
												offset = Math.ceil((offset * mulriple / 10)) * 10;
												scaleEle.find(".main").css({'-webkit-transform' : 'translateX('+ (offset * mulriple - minmul)+ 'px)', "-webkit-transition":"-webkit-transform 0.5s ease"});
												attrs.mainValue = offset;
												scope[attrs.ngModel] = Math.abs(Math.ceil((start - offset) /10)) * 100;
												scope.$apply();
											}

										}
									}
								});
					}
				};

			} ];
	vx.module('ibsapp').directive(directive);
})(window, window.vx);
