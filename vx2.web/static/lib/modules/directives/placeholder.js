(function(window, vx, undefined) {'use strict';
	var directive = {};
	directive.placeholder = ["$timeout",
	function($timeout) {
		return {
			restrict : 'A',
			link : function($scope, $element, attrs) {
				if (vx.msie && (vx.msie < 10 || document.documentMode < 10)) {
					var vModel = attrs.vModel;
					$element.wrap("<span class='fakePlaceholderWarp' id='FPW_" + vModel + "'></span>");
					var $span = $element.parent(), $label;
					$span.append("<label style='display:none;' class='fakePlaceholder' id='FP_" + vModel + "'>" + attrs.placeholder + "</label>");
					$element.addClass('placeholderInput');
					$label = $element.siblings('label');
					//延时显示label，因为有的vModel是在vInit中初始化的
					$timeout(function() {
						if (vx.isEmpty($element.scope()[vModel])) {
							$label.show();
						}
					}, 500);

					$label.bind('click', function() {
						$(this).hide();
						$element.focus();
					});

					$element.bind("focus", function() {
						$label.hide();
					});

					$element.bind("blur", function() {
						var txtValue = $element.val();
						if (vx.isEmpty(txtValue)) {
							$label.show();
						}
					});
				}
			}
		};
	}];
	vx.module('ui.libraries').directive(directive);
})(window, window.vx);