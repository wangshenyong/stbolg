/*jshint smarttabs:true, eqeqeq:false, eqnull:true, laxbreak:true*/
/**
 * slideBox
 */
(function(window, vx) {
	var directive = {};
	directive.uiSlidebox = ["$log",
	function($log) {
		return {
			restrict : 'CA',
			link : function(scope, element, attrs) {
				var options = vx.fromJson(attrs.uiSlidebox || {});
				//var count = 0;
				scope.$watch(function() {
					var liSize = vx.element(element).find(".bigContent .items").children().size();
					return liSize;
				}, function(newVal, oldVal) {
					/*
					 *@author zhengjinguang
					 *@备注  下面注释的代码，可以修复可能出现的在侧滑按钮点击一次出现多次滑动的现象
					 *      一般情況下不会出现上边的情况
					 */
					if (newVal > 0) {
						slideBox(element, options);
					}
				});

				function slideBox(el, options) {
					var defaults = {
						direction : 'left', // left,top
						duration : 0.6, // unit:seconds
						easing : 'swing', // swing,linear
						//delay : 3,// unit:seconds
						startIndex : 0,
						hideClickBar : true,
						clickBarRadius : 5, // unit:px
						hideBottomBar : false,
						autoSize : true,
						order_by : 'ASC' //定义滚动顺序:ASC/DESC
					};
					var settings = $.extend(defaults, options || {});
					var wrapper, ul, lis, firstPic, smallUl, smallConent, li_num, li_height = 0, li_width = 0, scope;
					var init = function() {

						wrapper = $(el), ul = wrapper.find('.bigContent ul.items'), lis = ul.find('>li'), firstPic = lis.first().find('img');
						smallUl = wrapper.find(".tips ul.smallItems");
						smallConent = smallUl.find("li");
						li_num = lis.size(), li_height = 0, li_width = 0;

						//要使用  li_num的值
						scope = vx.element(wrapper).scope();
						if (!wrapper.size())
							return false;
						li_height = lis.first().height();
						li_width = lis.first().width();
						if (settings.autoSize) {
							wrapper.css({
								width : li_width + 'px',
								height : li_height + 'px'
							});
						}
						lis.css({
							width : li_width + 'px',
							height : li_height + 'px'
						});
				    	if (li_num==1) {
							wrapper.find(".bigPicNext").hide();
						}
						
						// //上海银行
						// if (li_num<=4) {
							// wrapper.find(".bigPicNext").hide();
						// }

						if (settings.direction == 'left') {
							ul.css('width', li_num * li_width + 'px');
						} else {
							ul.css('height', li_num * li_height + 'px');
						}
						ul.find('>li:eq(' + settings.startIndex + ')').addClass('actived');

						wrapper.find(".bigPicPrev").addClass("opacity20");

						wrapper.find(".tips .smallPicPrev").bind("click", function() {
							transition(-1);
						});
						wrapper.find(".tips .smallPicNext").bind("click", function() {
							transition(1);
						});
						wrapper.find(".bigPicPrev").bind("click", function(event) {
							transition(-1);
						});
						wrapper.find(".bigPicNext").bind("click", function() {
							for(var i=0;i<ul.find('li').length;i++){
								if(settings.endIndex&&$(ul.find('li')[i]).hasClass("actived")&&i==(ul.find('li').length-settings.endIndex)){
									return;
								}
							}
							transition(1);
						});

						if (!settings.hideBottomBar) {
							smallUl.find('>li:eq(' + settings.startIndex + ')').addClass('actived');
							smallConent.each(function(i, n) {
								$(n).bind("click", function() {
									var callback = function() {
										$(this).addClass('actived').siblings().removeClass('actived');
										ul.find('>li:eq(' + $(this).index() + ')').addClass('actived').siblings().removeClass('actived');
										transition();
									}, that = this;
									var fn = function() {
										if (settings.checkSmallPicCallBack) {
											if (!!scope && vx.isFunction(scope[settings.checkSmallPicCallBack])) {
												scope[settings.checkSmallPicCallBack].call(that, callback);
											}
										} else {
											callback.call(that);
										}
									};
									if (scope.$$phase) {
										fn();
									} else {
										scope.$apply(function() {
											fn();
										});
									}

								});
							});
						}
						if (lis.size() > 1)
							start();
					};

					function cal(index, flag, actived) {
						if (flag < 0) {
							if (index === 0 && actived.prev().size()) {
								index = lis.size() - 1;
							} else if ((index == (lis.size() - 1)) && actived.prev().size()) {
								index -= 1;
							} else {
								if (actived.prev().size()) {
									index -= 1;
								} else {
									index = 0;
								}
							}

						} else if (flag > 0) {
							if (index === 0 && actived.next().size()) {
								index = 1;
							} else if ((index == (lis.size() - 1)) && actived.next().size()) {
								index = 0;
							} else {
								if (actived.next().size()) {

									index += 1;
								} else {
									index = 0;
								}
							}
						}
						return index;
					}

					var start = function(flag) {
						var actived = ul.find('>li.actived');
						var index;
						if (settings.delay) {
							index = actived.index();
						} else {
							index = cal(actived.index(), flag, actived);
						}
						if (settings.direction == 'left') {
							offset = index * li_width * -1;
							param = {
								'left' : offset + 'px'
							};
						} else {
							offset = index * li_height * -1;
							param = {
								'top' : offset + 'px'
							};
						}

						//满足平安银行的需求，如果不需要可以删除
						// pingan start
						if (index === 0) {
							wrapper.find(".bigPicPrev").addClass("opacity20");
						} else {
							wrapper.find(".bigPicPrev").removeClass("opacity20");
						}
						if (index === (li_num - 1) || (li_num==1) ) {
							wrapper.find(".bigPicNext").addClass("opacity20");
						} else {
							wrapper.find(".bigPicNext").removeClass("opacity20");
						}
						if(settings.endIndex&&index==(li_num-settings.endIndex)){
							wrapper.find(".bigPicNext").addClass("opacity20");
						}
						// pingan end

						wrapper.find('.nums').find('li:eq(' + index + ')').addClass('actived').siblings().removeClass('actived');

						ul.stop().animate(param, settings.duration * 1000, settings.easing, function() {
							actived.removeClass('actived');
							if (settings.delay) {
								if (settings.order_by == 'ASC') {
									if (actived.next().size()) {
										actived.next().addClass('actived');
									} else {
										settings.order_by = 'DESC';
										actived.prev().addClass('actived');
									}
								} else if (settings.order_by == 'DESC') {
									if (actived.prev().size()) {
										actived.prev().addClass('actived');
									} else {
										settings.order_by = 'ASC';
										actived.next().addClass('actived');
									}
								}
							} else {
								ul.find('>li:eq(' + index + ')').addClass('actived');

							}
							if(settings.afterAnimateCallback)
							{
								
								if (scope[settings.afterAnimateCallback] && vx.isFunction(scope[settings.afterAnimateCallback])) {
									if (scope.$$phase) {
										scope[settings.afterAnimateCallback].call(actived,index);
									} else {
										scope.$apply(function() {
											scope[settings.afterAnimateCallback].call(actived,index);
										});
									}
									
								}
							}
						});
						if (settings.delay) {
							wrapper.data('timeid', /*settings.delay*1000*/
							window.setTimeout(start, settings.delay * 1000));
						}

					};
					var stop = function() {
						window.clearTimeout(wrapper.data('timeid'));
					};
					var transition = function(startIndex) {
						start(startIndex);

						stop();
					};
					var reload = init;

					//如果配置参数，则binding当前id的click事件，
					if (settings.targetPage) {
						vx.forEach(settings.targetPage, function(value, key) {
							if (!value.el) {
								return $log.debug("targetPage options.id is undefined");
							}
							var oo = {
								transition : transition,
								reload : reload
							};
							vx.forEach(value.eventList, function(vv, k) {
								vx.element(value.el).bind(vv.event, function() {
									oo.el = this;
									oo.ul = ul;
									if (scope[vv.callBack] && vx.isFunction(scope[vv.callBack])) {
										scope[vv.callBack].call(oo);
									}
								});
							});

						});
					}
					if (settings.delay) {
						//鼠标经过事件
						$(el).hover(function() {
							stop();
						}, function() {
							if (settings.delay) {
								//modify:qichan(只有一张图片时)
								if(lis.size()<=1){
									return;
								};
								wrapper.data('timeid', /*settings.delay*1000*/
								window.setTimeout(start, settings.delay * 1000));
							}
						});
					}

					init();
				}

			}
		};
	}];
	vx.module('ui.libraries').directive(directive);
})(window, window.vx);

