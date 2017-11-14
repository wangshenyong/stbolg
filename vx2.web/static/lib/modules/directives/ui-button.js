/*jshint smarttabs:true, eqeqeq:false, eqnull:true, laxbreak:true */
/**
 * @author machao
 */
(function(window, vx, undefined) {'use strict';
	var directive = {};
	directive.uiButton = ['$timeout',
	function($timeout) {
		return {
			restrict : 'A',
			link : function(scope, element, attrs) {
				//获取viewScope yoyo
				var view = element.controller('vViewport');
				var viewScope = view && view.$activeElement.scope();
				//参数
				var params = vx.fromJson(attrs.uiButton || {});
				var c,startText;
				if(element.is("input")){
					startText = element.val();
				}else{
					startText = element.text();
				}
				if (params['time']) {
					element.bind("click", function() {
						if (!$(this).attr("disabled")) {
							$(this).attr("disabled", "disabled");
							if(element.is("input")){
								startText = element.val();
							}else{
								startText = element.text();
							}
							var count = 0;
							var counttemp = 0;
							var pre = "";
							c = setInterval(function() {
								if (params['time'] - counttemp < 10) {
									pre = "0";
								} 
								// else if ((params['time'] - counttemp < 100) && (params['time'] - counttemp >= 10)) {
								// 	pre = "0";
								// }
								var messagePre = vx.isUndefined(params['messagePre']) ? "" : params['messagePre'];
								var messageFoot = vx.isUndefined(params['messageFoot']) ? "" : params['messageFoot'];
								var textString = messagePre + pre + (params['time'] - count++) + messageFoot;
								var text = "";
								if(element.is("input")){
									text = element.val(textString);
								}else{
									text = element.text(textString);
								}				
								counttemp++;
							}, 1000);
						}
						$timeout(function() {
							clearInterval(c);
							$(element).removeAttr("disabled");
							if(element.is("input")){
								element.val(startText);
							}else{
								element.text(startText);
							}
						}, params['time'] * 1000 + 1 * 1000);
					});
				}
				if (params['disable']) {
					element.bind("click", function() {
						var disableTime = parseFloat(vx.isUndefined(params['disTime']) || vx.equals(params['disTime'], "") ? 2 : params['disTime']) * 1000;
						$(this).attr("disabled", "disabled");
						$timeout(function() {
							element.removeAttr("disabled");
						}, disableTime);
					});
				}
				/**判断是单选按钮还是复选按钮**/
				if (vx.equals(params['uiBtnType'], "checkBox")) {
					element.find("button").bind("click", function() {
						if ($(this).hasClass("disabled")) {
							$(this).removeClass("disabled");
						} else {
							$(this).addClass("disabled", "disabled");
						}

					});
				} else if (vx.equals(params['uiBtnType'], "radio")) {
					element.find("button").bind("click", function() {
						if ($(this).siblings().hasClass("disabled")) {
							element.find("button").removeClass("disabled");
						}
						if ($(this).hasClass("disabled")) {
							$(this).removeClass("disabled");
						} else {
							$(this).addClass("disabled", "disabled");
						}

					});
				}
				/**判断是否是下拉**/
				if (vx.equals(params["btnDrop"], true)) {
					element.find('.dropdown-toggle').bind('click', function() {
						if (element.find('.dropdown-menu').hasClass("status")) {
							element.find('.dropdown-menu').removeClass("status");
							element.find('.dropdown-menu').css("display", "none");
						} else {
							element.find('.dropdown-menu').addClass("status");
							element.find('.dropdown-menu').css("display", "block");
						}
					});
					element.find("a").bind("click", function() {
						element.find('.dropdown-menu').removeClass("status");
						element.find('.dropdown-menu').css("display", "none");
					});
				}

			}
		};
	}];
	vx.module('ui.libraries').directive(directive);

})(window, window.vx);
