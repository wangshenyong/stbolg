/*jshint smarttabs:true, eqeqeq:false, eqnull:true, laxbreak:true */
/**
 * @author WangBaoRen
 */
(function(window, vx, undefined) {'use strict';

	var directive = {};
	directive.uiValidatell = ['$log',
	function($log) {
		return {
			restrict : 'A',
			replace : true,
			transclude : true,
			link : function(scope, element, attrs, controller) {
				//获取验证提示框位置属性
				var placement = (attrs.uiValidatell.length === 0 || attrs.uiValidatell === null) ? "right" : attrs.uiValidatell;
				var multiple = (vx.isDefined(attrs.multiple) && attrs.multiple !== "false") ? attrs.multiple : false;
				//添加箭头关联样式类
				element.addClass(placement);
				//获取表单元素
				var formElem;
				//判断是否为checkbox
				if ($(element).prev("div,:input").find(":checkbox").length > 0) {
					formElem = $(element).prev("div");
					var name = formElem.attr('name');
					if (name === null) {
						$log.error("error:name undefine!");
						return;
					}
					//获取最近form元素name属性
					var formName = get_form_obj(name).attr("name");
					//给组元素（checkbox）绑定特点事件
					formElem.bind('mouseenter', function() {
						positionDiv(formElem);
						validateForm();
					});
					formElem.bind('mouseleave', function() {
						element.css('display', 'none');
					});
					//添加监听校验
					scope.$watch(formName + "['" + name + "'].$error.required", function(value) {
						if (!multiple && !element.is(":visible") && scope.$eval(formName + "['" + name + "'].$dirty")) {
							positionDiv(formElem);
						}
						validateForm();
					});
				} else {
					formElem = $(element).prev(":input").length > 0 ? $(element).prev(":input") : $(element).prev("div").find(":input,:text,:password,:radio,:checkbox,:file,:button,:submit,:reset,:image").eq(0);
					name = formElem.attr('name');
					if (!name || name === null) {
						$log.error("error : name attribute of Element undefine!");
						return;
					}
					//获取最近form元素name属性
					var formName = get_form_obj(name).attr("name");
					//表单元素获得焦点事件
					formElem.bind('focus', function() {
						positionDiv(formElem);
						validateForm();
					});
					formElem.bind('keydown', function() {
						validateForm();
					});
					//添加失去焦点事件
					formElem.bind('blur', function() {
						element.css('display', 'none');
					});
					//添加监听校验
					scope.$watch(formElem.attr('v-model'), function(value) {
						if (!multiple && !element.is(":visible") && scope.$eval(formName + "['" + name + "'].$dirty")) {
							positionDiv(formElem);
						}
						validateForm();
					});
				}

				//校验方法
				function validateForm() {
					var liElemArr = $(element).find('li');
					//循环遍历li
					for (var i = 0; i < liElemArr.length; i++) {
						var liElem = $(liElemArr[i]);
						//拼接验证标记在scope中的名字
						var validateName = formName + "['" + name + "'].$error." + liElem.attr('title');
						//从scope中取出验证标记
						var validateFlag = (multiple && scope.$eval(validateName) == null) ? true : scope.$eval(validateName);
						//判定是否展示多项校验
						if (!multiple) {
							if (validateFlag) {
								liElem.show();
								liElem.siblings().hide();
								return;
							} else if (i === liElemArr.length - 1) {
								liElem.hide();
								liElem.siblings().hide();
								element.hide();
								return;
							}
						} else {
							if (validateFlag) {
								liElem.removeClass("correct");
								liElem.addClass("error");
							} else {
								liElem.removeClass("error");
								liElem.addClass("correct");
							}
						}
					}
				}

				//根据li条数改变li在背景图片中的位置
				function paddingCount() {
					var lis, totalLines = 0;
					lis = element.find("li").size();
					if (lis > 4) {
						$log.error("ui-validatell error: ul/ol should have 4 li at most");
					}
					for (var i = 0; i < lis; i++) {
						var liWords, liLength = 0, lineLength = 0;
						liWords = element.find("li").eq(i).text().replace(/(^\s*)|(\s*$)/g, '');
						liLength = liWords.length;
						//根据全角和半角计算每个li的长度
						for (var j = 0; j < liLength; j++) {
							var curr = liWords.charAt(j);
							if (/[^\x00-\xff]/g.test(curr)) {
								//如果全角长度加2
								lineLength += 2;
							} else {
								//如果半角长度加1
								lineLength += 1;
							}
						}
						/*王宝仁：根据每条li的字数估算提示文字能占几行,默认以11个汉子为一行(既长度22)
						 * 这种判断方式比上一版本按字符数要准确一些
						 */
						totalLines += Math.ceil(lineLength / 22);
					}
					if (totalLines > 4) {
						$log.warn("ui-validatell warning: message out of background range. overflow: hidden");
					}
					switch(totalLines) {
						case 3:
							element.find(".new-popover-inner").css("padding-top", "15px");
							break;
						case 2:
							element.find(".new-popover-inner").css("padding-top", "30px");
							break;
						case 1:
							element.find(".new-popover-inner").css("padding-top", "40px");
							break;
						default:
							element.find(".new-popover-inner").css("padding-top", "8px");
					}
				}

				function positionDiv(divElem) {
					paddingCount();
					//王宝仁：input标签上写的style的marginTop和marginLeft
					var styleML = divElem[0].currentStyle ? divElem[0].currentStyle.marginLeft : getComputedStyle(divElem[0], null).marginLeft;
					var styleMT = divElem[0].currentStyle ? divElem[0].currentStyle.marginTop : getComputedStyle(divElem[0], null).marginTop;
					//styleML返回值是带有"px"的字符串，截取并转换类型
					styleML = parseInt(styleML.slice(0, -2), 10);
					styleMT = parseInt(styleMT.slice(0, -2), 10);
					//显示弹出框
					element.css("display", "block");
					//计算表单元素所在的位置
					var inside = "true";
					//当前点中的input的top left width height
					var getPosition = function(inside) {
						return $.extend({}, divElem.position(), {
							width : divElem[0].offsetWidth,
							height : divElem[0].offsetHeight
						});
					};
					var pos = getPosition(inside);

					//计算弹出框所在的位置
					var tp = {};
					switch (placement) {
						//每个top和left后面加减的数字根据背景图片new-popover-bg大小改变
						case 'top':
							tp = {
								top : pos.top + styleMT - 130,
								left : pos.left + pos.width / 2 + styleML - 100
							};
							break;
						case 'bottom':
							tp = {
								top : pos.top + pos.height + styleMT,
								left : pos.left + pos.width / 2 + styleML - 100
							};
							break;
						case 'left':
							tp = {
								top : pos.top + pos.height / 2 + styleMT - 50,
								left : pos.left + styleML - 235
							};
							break;
						case 'right':
							tp = {
								top : pos.top + pos.height / 2 + styleMT - 50,
								left : pos.left + pos.width + styleML
							};
							break;
						case 'leftTop':
							tp = {
								top : pos.top + styleMT - 140,
								left : pos.left + styleML - 175
							};
							break;
						case 'leftBottom':
							tp = {
								top : pos.top + pos.height + styleMT,
								left : pos.left + styleML - 175
							};
							break;
						case 'rightTop':
							tp = {
								top : pos.top + styleMT - 140,
								left : pos.left + pos.width + styleML - 25
							};
							break;
						case 'rightBottom':
							tp = {
								top : pos.top + pos.height + styleMT,
								left : pos.left + pos.width + styleML - 25
							};
							break;
					};
					//定位弹出框
					element.css(tp);

				}

				//找到页面中包含指定对象的form表单
				function get_form_obj(f_obj) {
					var _obj = null;
					$("form").each(function(i) {
						var obj = $(this).find("[name='" + f_obj + "']");
						if (obj.length > 0) {
							_obj = $(this);
						};
					});
					return _obj;
				}

			},
			template : '<div class="new-popover"><div class="new-popover-bg"></div><div class="new-popover-inner" v-transclude></div></div>'
		};
	}];

	vx.module('ui.libraries').directive(directive);

})(window, window.vx);
