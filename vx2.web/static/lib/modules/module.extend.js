(function (window, vx, undefined) {
	'use strict';
	var mod = vx.module('ui.libraries');
	var directive = {};
	directive.uiMenu2 = ['$compile', '$parse',
		function ($compile, $parse) {
			var defaults = {};
			return {
				restrict: 'A',
				scope: true,
				link: function ($scope, elem, attrs, ctrl) {
					// 获得参数
					var menuSource = attrs.uiMenu2 || "menu", template;
					var fn= $parse(attrs.itemSelect, null, true);
					template = $('<ul class="menuBox"></ul>');
					$scope.$watch(function () {
						return $scope.$eval(menuSource);
					}, function (newValue, oldValue) {
						if (newValue) {
							createMenu(newValue);
						}
					});
					$scope.goto = function (url, event) {
						$scope.$root.goto(url);
						$(event.target).parents("dl").hide();
					};
					function createMenu(menus) {
						var firstNode = $("<li class='home'><span>首页</span></li>");
						firstNode.data('$item', {ActionId: "Home", ActionName: "首页", Level: "1"});
						template.append(firstNode);
						vx.forEach(menus, function (temp_level1, index) {
							var wraper = $("<li><span>" + temp_level1.ActionName + "</span></li>");
							var childrenList = temp_level1.MenuList;
							if (childrenList && childrenList.length > 0) {
								var child_dl = $("<dl></dl>"), head_t;
								var wraper_head = $("<dt></dt>"),
									wraper_body;
								child_dl.append(wraper_head);
								vx.forEach(childrenList, function (temp_level2, index2) {
									if (temp_level2.ActionId) {
										head_t = $("<a class='level2'>" + temp_level2.ActionName + "</a>");
										head_t.data('$item', temp_level2);
									} else {
										head_t = $("<a>" + temp_level2.ActionName + "</a>");
									}

									wraper_body = $("<dd></dd>");
									wraper_head.append(head_t);
									var children = temp_level2.MenuList;
									if (children && children.length > 0) {
										vx.forEach(children, function (temp_level3) {
											var temp_p;
											if (temp_level3.ActionId) {
												temp_p = $("<p class='level3'>" + temp_level3.ActionName + "</p>");
												temp_p.data('$item', temp_level3);
											} else {
												temp_p = "<p>" + temp_level3.ActionName + "</p>"
											}
											wraper_body.append(temp_p);
										});
									}
									child_dl.append(wraper_body);
								});
								wraper.append(child_dl);
							}
							template.append(wraper);
						});
						bindEvent(template);
						$compile(template)($scope);
						elem.replaceWith(template);
					}

					function bindEvent(element) {
						element.find("li").bind("mouseover", function () {
							$(this).addClass("on").children("dl").show();
						});
						element.find("li").bind("mouseout", function () {
							$(this).removeClass("on").children("dl").hide();
						});
						template.delegate(".level3,.level2,.home", "click", function (event) {
							var $item = $(this).data('$item');
							var callback = function () {
								fn($scope, {$item: $item});
							};
							$scope.$apply(callback);
							$(template).find("dl").hide();
						});
					}

				}
			};
		}];
	mod.directive(directive);
})(window, window.vx);