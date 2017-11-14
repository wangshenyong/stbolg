(function (window, vx, undefined) {
	'use strict';
	var directive = {};

	directive.uiChoiceTree = [
		function ($compile) {

			function Choice(name, children) {
				this.name = name;
				this.checked = false;
				this.children = children || [];
			}

			return {
				restrict: 'E',
				replace: true,
				/**树的根节点**/
				templateUrl : "lib/template/ui-choice-tree/ul.html",
				link: function (scope, element, attr) {
					var trees = scope.myTree;
					var el = element;
					/**用递归展示树**/
					var ListChildren = function (trees, el) {
						for (var i = 0; i < trees.length; i++) {

							/**仿照jquery树的样式写的如果有子节点则是一种样式如果没有子节点则是另一种样式**/
							var li = ((trees[i].children.length) > 0) ? vx.element('<li class="collapsable "><div class="hitarea closed-hitarea expandable-hitarea"></div><span class="folder">' + trees[i].name + '</span></li>') : vx.element('<li ><span class="file">' + trees[i].name + '</span></li>');
							var elm = el.append(li);
							/**判断该树是否有子节点**/
							if (trees[i].children.length > 0) {
								/**给子节点添加ul**/
								elm = li.append(vx.element("<ul></ul>"));
								ListChildren(trees[i].children, li.children("ul"));
							}
						}
					};
					ListChildren(trees, el);
					/**隐藏所有的节点**/
					$(element).find("ul").addClass("treeClass");
					/**给图标添加隐藏显示事件**/
					$(element).find("span").prev().bind("click", function () {
						if ($(this).siblings("ul").hasClass("treeClass")) {
							$(this).siblings("ul").removeClass("treeClass");

							$(this).removeClass("hitarea closed-hitarea expandable-hitarea");
							$(this).addClass("hitarea collapsable-hitarea");
						} else {
							$(this).siblings("ul").addClass("treeClass");
							$(this).removeClass("hitarea collapsable-hitarea");
							$(this).addClass("hitarea closed-hitarea expandable-hitarea");

						}
					});
					/**绑定点击事件**/
					$(element).find("span").bind("click", function () {
						if ($(this).next("ul").hasClass("treeClass")) {
							$(this).next().removeClass("treeClass");

							$(this).prev().removeClass("hitarea closed-hitarea expandable-hitarea");
							$(this).prev().addClass("hitarea collapsable-hitarea");
						} else {
							$(this).next().addClass("treeClass");
							/**添加打开关闭图片**/
							$(this).prev().removeClass("hitarea collapsable-hitarea");
							$(this).prev().addClass("hitarea closed-hitarea expandable-hitarea");

						}

					});
				}
			};
		}];
	vx.module("ui.libraries").directive(directive);

})(window, window.vx);