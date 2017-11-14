/**
 * @author WeiLe
 * @create time 2014.7.31
 */
(function(window, vx, undefined) {
	var directive = {};
	directive.uiStep = [
	function() {
		return {
			restrict : 'CA',
			priority : 200,
			link : function(scope, element, attrs) {
				var options = vx.fromJson(attrs.uiStep || {});
				var steps = ".steps";
				if (options.index) {
					steps += options.index;				//.stepsA
				}
				var lastClick;

				//若页面存在selectSearch
				scope.$watch(function() {
					return $(".steps .searchSelectButton").length;
				}, function(newvalue, oldvalue) {
					if (newvalue != 0) {
						$(".steps .searchSelectButton").bind("click", function() {		//选中下拉框激发事件改变样式
							var ele = $(this);
							while (ele) {
								if (!ele.hasClass(steps.substring(1))) {
									ele = ele.parent();
								} else {
									break;
								}
							}
							$(steps + "." + lastClick + " .pay1 img").attr("src", "css/img/ui-step/zzxx_041.png");
							$(steps + "." + lastClick).removeClass("pay01").addClass("pay02");
							lastClick = "steps" + (ele.index() + 1);
							$(steps + "." + lastClick + " .pay1 img").attr("src", "css/img/ui-step/zzxx_04.png");
							$(steps + "." + lastClick).removeClass("pay02").addClass("pay01");
						});
					};
				});

				$(steps + " input," + steps + " select," + steps + " textarea," + steps + " .switch").bind("click", function() {
					var ele = $(this);
					while (ele) {
						if (!ele.hasClass(steps.substring(1))) {
							ele = ele.parent();
						} else {
							break;
						}
					}
					$(steps + "." + lastClick + " .pay1 img").attr("src", "css/img/ui-step/zzxx_041.png");
					$(steps + "." + lastClick).removeClass("pay01").addClass("pay02");
					lastClick = "steps" + (ele.index() + 1);
					$(steps + "." + lastClick + " .pay1 img").attr("src", "css/img/ui-step/zzxx_04.png");
					$(steps + "." + lastClick).removeClass("pay02").addClass("pay01");
				});

				for (var i = 1; i < $(steps).length + 1; i++) {
				//	$(steps).css("padding", "20px 0 25px 0");
					$(steps + ".steps" + i).prepend("<div class='pay1' style='position:absolute;top:50%;margin-top:-10px;z-index:11;'></div>");

					$(steps + ".steps" + i + " div:first").append("<img src='css/img/ui-step/zzxx_041.png'>");

					if (options.steps) {
						$(steps + ".steps" + i + " div:first").append("<b>" + options.steps["step" + i] + "</b>");
					}
				}

			}
		};
	}];
	vx.module('ui.libraries').directive(directive);
})(window, window.vx);
