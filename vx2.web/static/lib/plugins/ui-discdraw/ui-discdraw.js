/**
 * 主要作用：圆盘摇奖
 * @author guozhenyao
 *  */

(function(window, vx, undefined) {'use strict';
	var directive = {};
	directive.uiDiscdraw = ['$compile',
	function($compile) {
		return {
			template : '<div id="discdraw">' + '<img class="discbg" src="images/disc-rotate.gif" viewBox="0 0 352 30" />' + '<div class="arrow"></div>' + '<div class="draw-btn">' + '<span></span>' + '</div>' + '<div class="cover"></div><div class="resultTip"><span>aaa</span>' + '<a href="javascript:void(0);"  class="btn btn-info btn-large">确定</a>' + '</div>' + '</div>',
			restrict : 'CA',
			link : function(scope, element, attrs) {
				var $this = $('#discdraw');
				enableStartBtn();

				/**
				 *主体逻辑
				 *  */
				function run() {
					disabledStartBtn();
					$this.find(".discbg").stopRotate();
					var StopInfo = getStopInfo();
					runRotate(StopInfo.angle, StopInfo.resultStr);
				}

				/**
				 *初始化开始按钮的状态
				 *  */
				function enableStartBtn() {
					$this.find(".draw-btn").addClass("hover").bind('click', run);
				}

				function disabledStartBtn() {
					$this.find(".draw-btn").removeClass("hover").unbind();
				}

				/**
				 * 获取一定范围内随机的数字
				 * startIndex:范围的最小值(包括这个值)
				 * endIndex:范围的最大值（包括这个值）
				 *  */
				function getRan(startIndex, endIndex) {
					return parseInt(Math.random() * (endIndex - startIndex + 1) + startIndex,10);
				}

				function getStopInfo() {
					var index = getRan(0, 6);
					// console.log(index);
					var StopInfo = {
						angle : 26,
						resultStr : ""
					};
					StopInfo.angle = 26 + 51 * index;
					switch(index) {
						case 0:
							StopInfo.resultStr = "100G永久免费空间";
							break;
						case 1:
							StopInfo.resultStr = "36M空间";
							break;
						case 2:
							StopInfo.resultStr = "100经验值";
							break;
						case 3:
							StopInfo.resultStr = "360M空间";
							break;
						case 4:
							StopInfo.resultStr = "36经验值";
							break;
						case 5:
							StopInfo.resultStr = "100M空间";
							break;
						case 6:
							StopInfo.resultStr = "360经验值";
							break;
					}
					return StopInfo;
				}

				function showResult(resultStr) {
					$this.find('.resultTip').find('span').html("您获得" + resultStr + "!");
					$this.find('.resultTip').show();
					$this.find('.cover').show();
				}

				/**
				 *运行转动
				 * angle:停止的角度
				 * resultStr:提示的结果信息
				 *  */
				function runRotate(angle, resultStr) {
					$this.find(".discbg").rotate({
						angle : 0,
						animateTo : angle + 1440,
						duration : 10000,
						callback : function() {
							enableStartBtn();
							showResult(resultStr);
						}
					});
				}


				$this.find('.resultTip').find('a').bind('click', function() {
					$this.find('.resultTip').hide();
					$this.find('.cover').hide();
				});
			}
		};
	}];
	vx.module('ibsapp').directive(directive);
})(window, window.vx);
