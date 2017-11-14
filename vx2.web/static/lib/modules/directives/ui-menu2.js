(function (window, vx, undefined) {
	'use strict';
	var mod = vx.module('ibsapp');
	var directive = {};
	directive.uiMenu2 = ['$compile', '$timeout',
		function ($compile, $timeout) {
			var defaults = {};
			return {
				restrict: 'A',
				scope: true,
				link: function ($scope, elem, attrs, ctrl) {
					// 获得参数
					var menuSource = attrs.uiMenu2 || "menu", template;
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
						var firstNode = "<li v-click=\"goto(\'/Welcome\')\"><span>首页</span></li>";
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
										head_t = $("<a v-click=\"goto(\'/" + temp_level2.ActionId + "\',$event)\">" + temp_level2.ActionName + "</a>");
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
												temp_p = "<p v-click=\"goto(\'/" + temp_level3.ActionId + "\',$event)\">" + temp_level3.ActionName + "</p>"
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
						})
					}

				}
			};
		}];
	mod.directive(directive);
})(window, window.vx);