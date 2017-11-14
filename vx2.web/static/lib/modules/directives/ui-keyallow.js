var mod = vx.module("ui.libraries");
/**
 *  directive 	key-allow
 *  value 	symbol(default)  允许输入数字、字母、特殊字符
 *  value 	number	允许输入数字
 *  value	word	允许输入数字、字母
 *  value   tel     允许输入数字、-
 *  value   amount  允许输入数字和小数点
 *  usage    key-allow   key-allow="number|word|symbol"
 */

mod.directive("uiKeyallow", function() {
	return {
		require : "^?ngModel",
		link : function(scope, element, attr, ctrl) {
			var keyAllow = attr.uiKeyallow || "symbol";
			ctrl.$render = function() {
				element.val(ctrl.$modelValue);
			}
			element.bind("input", function(event) {
				scope.$apply(function() {
					var value = element.val();
					if (keyAllow === "number") {
						//用来捕获字符串中的子字符串到一个数组中
						value = value.match(/^[0-9]*/);
					} else if (keyAllow === "word") {
						value = value.match(/^[0-9a-zA-Z]*/);
					} else if (keyAllow === "symbol") {
						value = value.match(/^[!-~]*/);
					} else if (keyAllow === "tel") {
						value = value.match(/^[0-9-]*/);
					} else if (keyAllow === "amount") {
						value = value.match(/^[0-9.]*/);
					}
					element.val( value ? value[0] : null);
				});
			});
		}
	}
});
