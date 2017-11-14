(function (window, vx, undefined) {
	'use strict';
	var directive = {};
	directive.uiPager2 = ['$log', '$compile', '$rootScope',
		function ($log, $compile, $rootScope) {
			// 设置默认值
			var defaults = {
				pageLimit: 10
				// 最多显示多少页
			};
			return {
				restrict: 'A',
				template: "<div class='pagination'></div>",
				replace: true,
				link: function ($scope, elem, attrs, ctrl) {
					var name = attrs.uiPager2;
					var callback = attrs.callback;
					// 监听pager是否改变
					$scope.$watch(function () {
						return $scope[name];
					}, function (newValue, oldValue) {
						// 获取pager数据源
						if (newValue == undefined) {
							return;
						}
						createPager(newValue);
					});
					function createPager(pager) {
						$(elem).empty();
						// 总页数
						var pageCapacity = Math.ceil(pager.capacity / pager.limit);
						// 当前页码
						var curPage = pager.offset / pager.limit + 1;
						if (pageCapacity <= 1 && pager.offset == 0) {
							// 如果没有数据移除分页栏
							return;
						}
						// 显示多少页
						var pageLimit;
						if (pageCapacity > defaults.pageLimit) {
							pageLimit = defaults.pageLimit;
						} else {
							pageLimit = pageCapacity;
						}
						// 首页偏移量
						var pageOffset = curPage - (defaults.pageLimit / 2);
						if (pageOffset + defaults.pageLimit > pageCapacity) {
							pageOffset = pageCapacity - defaults.pageLimit;
						}
						if (pageOffset < 0) {
							pageOffset = 0;
						}
						var ul = $("<ul></ul>");
						var first;
						if (curPage == 1) {
							first = $("<li ><a class='disable' href='javascript:void(0);'>首页</a></li>");
						} else {
							first = $("<li><a href='javascript:void(0);' v-click='" + callback + "(" + 0 * pager.limit + ", " + pager.limit + ")'>首页</a></li>");
						}
						ul.append(first);
						var prev;
						if (curPage == 1) {
							prev = $("<li ><a class='disable' href='javascript:void(0);'>上一页</a></li>");
						} else {
							prev = $("<li><a href='javascript:void(0);' v-click='" + callback + "(" + (curPage - 2) * pager.limit + ", " + pager.limit + ")'>上一页</a></li>");
						}
						ul.append(prev);
						for (var i = 1; i <= pageLimit; i++) {
							var page;
							if (curPage == (i + pageOffset)) {
								page = "<li class='active'><a href='javascript:void(0);'>" + (i + pageOffset) + "</a></li>";
							} else {
								page = "<li><a href='javascript:void(0);' v-click='" + callback + "(" + (i + pageOffset - 1) * pager.limit + ", " + pager.limit + ")'>" + (i + pageOffset) + "</a></li>";
							}
							ul.append(page);
						}
						var next;
						if (curPage == pageOffset + pageLimit) {
							next = $("<li ><a class='disable' href='javascript:void(0);'>下一页</a></li>");
						} else {
							next = $("<li><a href='javascript:void(0);' v-click='" + callback + "(" + curPage * pager.limit + ", " + pager.limit + ")'>下一页</a></li>");
						}
						var last;
						if (curPage == pageCapacity) {
							last = $("<li ><a class='disable' href='javascript:void(0);'>尾页</a></li>");
						} else {
							last = $("<li><a href='javascript:void(0);' v-click='" + callback + "(" + (pageCapacity-1) * pager.limit + ", " + pager.limit + ")'>尾页</a></li>");
						}
						ul.append(next);
						ul.append(last);
						$(elem).append(ul);
						$compile(elem.contents())($scope);
					}

				}
			};
		}];
	vx.module('ibsapp').directive(directive);
})(window, window.vx);