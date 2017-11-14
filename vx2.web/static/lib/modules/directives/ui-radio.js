/**
 * 使用按钮图片替换默认的单选按钮
 * @auther lss
 */

(function(window, vx, $) {'use strict';
	var mod = vx.module("ui.libraries");
	mod.directive("uiRadio", [
	function() {
		return {
			restrict : 'A',
			compile : function(element, attr, transclude) {
				var type = element.attr("type"), button;
				if (type === "radio") {
					// 创建img图片dom
					button = document.createElement("img");
					button.className = "radiostyle";
					// 把创建的img添加到Dom上
					element.after(button);
					element.hide();
					// 给图片赋上默认的图片
					var $button = vx.element(button);
					$button.attr("src", "css/img/ui-radio/radiooff.png");
				}
				return {
					post : function(scope, element, attr) {
						// 给新添加的imgDom添加click事件
						var $button = vx.element(button);
						$button.bind("click", function() {
							var self = vx.element(this);
							//element.trigger("click");
							scope[attr.ngModel] = attr.value;
							scope.$apply();
						});
						// 监听vModel的变化
						scope.$watch(attr.ngModel, function() {
							// 选中切换成选中的图片，否则反之
							if (element[0].checked) {
								$button.attr("src", "css/img/ui-radio/radioon.png");
								//$button.addClass('radioimg');
							} else {
								$button.attr("src", "css/img/ui-radio/radiooff.png");
								//$button.removeClass('radioimg');
							}
						});
					}
				};
			}
		};
	}]);

})(window, window.vx, window.$);
