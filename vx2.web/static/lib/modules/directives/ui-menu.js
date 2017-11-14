/**
 * @discription 可滑动一级菜单 联动中间页箭头滑动
 * @param <div ui-menu='{"MainMenu":List in scope,"QuickMenu":List in scope}'></div>
 */
(function(window, vx, undefined) {
	'use strict';

	var mod = vx.module('ibsapp');
	var directive = {};
	mod.directive("uiMenu", [function() {
		return {
			restrict: 'EA',
			templateUrl: 'lib/template/ui-menu/ui-menu.html',
			transclude: true,
			replace: true,
			scope: false,
			link: function($scope, elem, attrs, ctrl) {
				$scope.fn = function(item) {
					//TODO 通过代码找到list中最后一个元素
					if(item.id == '6.2') {
						
						return true;
					}
				};
				$scope.$on('$RepeatFinish', function(e, data) {
					
					vx.element("#twocontent .two").children().each(function(index, element) {

						var $this = vx.element(element);
						if(index != 0) {
							$(this).hide();
						}
						// 默认状态
						var $otherDiv = $this.children().find("ul.showOrHide");
						$otherDiv.hide();
						$this.find("ul.menuA li.twoGroup").hover(function() {

							$(this).addClass("bor");
							$(this).find("ul").show();

						}, function() {
							$(this).removeClass("bor");
							$(this).find("ul").hide();
						});

						//获取三级菜单名字
						$this.children().find("ul.showOrHide li.third").bind("click", function() {
							$rootScope.twoMenu = $rootScope.twoMenu + " > ";
							$rootScope.thirdMenu = " " + $(this).children("a").text();
							$("#twocontent").find("li.third").removeClass("focusT");
							$(this).addClass("focusT");
						});

					});

					function isHidden($ele) {
						var index = $ele.index();
						var start = 0,
							end = 7;
						var slideLeft = $("div.slideMenuDiv").css("left");
						if(slideLeft == 'auto' || slideLeft === '0px') {
							slideLeft = 0;
						} else {
							slideLeft = parseInt(slideLeft.slice(1, -2), 10);
						}
						var movedCount = slideLeft / 89;
						start += movedCount;
						end += movedCount;
						if(index < start) {
							return {
								'times': start - index,
								'direction': 'L'
							};
						} else if(index > end) {
							return {
								'times': index - end,
								'direction': 'R'
							};
						} else {
							return false;
						}
					}
				});

			}
		};
	}]);

})(window, window.vx, window.$);