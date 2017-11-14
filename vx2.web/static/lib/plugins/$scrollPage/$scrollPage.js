/*上滑加载 开始*/
/**
 * @author wbr
 * 滑动分页服务
 * 依赖于iScroll.js(v4.2.5)
 * @param create方法:
 * 		  	id:配合页面div的id
 * 			pullUpFn:上拉动画结束后执行的加载更多回调函数,通常应该是remote和数据处理
 * 			pullDownFn:下拉动画结束后执行的回调函数,通常应该是remote和数据处理
 * 		  destroy方法:
 * 		  	scroller:create方法所返回的iScroll对象
 * 		  disable方法:停止上拉分页
 * 		  enable方法:重启上拉分页
 * */
(function(window, vx, undefined) {
	'use strict';

	var service = {};
	service.$scrollPage = [
	function() {
		return {
			create : function(id, pullUpFn, pullDownFn) {
				var myScroll,
				    pullUpEl,
				    pullDownEl,
				    firstScroll = true;

				pullUpEl = document.getElementById('pullUp');

				pullDownEl = document.getElementById('pullDown');

				function pullUpAction() {
					pullUpFn(function(isEnd) {
						//TODO 此处根据后台分页是否结束标志来修改
						if (isEnd) {
							pullUpEl.className = 'nomore';
							pullUpEl.querySelector('.pullUpLabel').innerHTML = '没有更多数据了';
						}
					});
				}

				function pullDownAction() {
					if(pullDownFn){
						pullDownFn();
						pullUpEl.className = '';
						pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
					}
				}

				myScroll = new iScroll(id, {
					topOffset: 40,
					useTransition : true,
					onRefresh : function() {
						if (pullUpEl.className.match('loading')) {
							pullUpEl.className = '';
							pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
						}
						if(pullDownEl.className.match("loading")){
							pullDownEl.className = '';
							pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新...';
						}
					},
					onScrollMove : function() {
						if(firstScroll){
							this.refresh();
							firstScroll = false;
						}
						if (this.y <= (this.maxScrollY - 50) && !pullUpEl.className.match('peak') && !pullUpEl.className.match('nomore')) {
							pullUpEl.className = 'peak';
							pullUpEl.querySelector('.pullUpLabel').innerHTML = '松手刷新...';
						} else if (this.y > (this.maxScrollY - 50) && this.y < (this.maxScrollY + 100) && !pullUpEl.className.match('goon') && !pullUpEl.className.match('nomore')) {
							pullUpEl.className = 'goon';
							pullUpEl.querySelector('.pullUpLabel').innerHTML = '继续上拉...';
						} else if(this.y >= 0) {
							pullDownEl.className = "foot";
							pullDownEl.querySelector('.pullDownLabel').innerHTML = '松手刷新...';
						} else if(this.y < 0 && this.y >= (this.maxScrollY + 100) && !pullDownEl.className.match("goon")){
							pullDownEl.className = "goon";
							pullDownEl.querySelector('.pullDownLabel').innerHTML = '继续下拉...';
						}
					},
					onScrollEnd : function() {
						if(pullDownEl.className.match("foot")){
							pullDownEl.className = "loading";
							pullDownEl.querySelector('.pullDownLabel').innerHTML = '加载中...';
							pullDownAction();
						} else if (pullDownEl.className.match("goon")) {
							pullDownEl.className = "";
							pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新...';
						}
						if (pullUpEl.className.match('peak')) {
							pullUpEl.className = 'loading';
							pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中...';
							pullUpAction();
						} else if (pullUpEl.className.match('goon')) {
							pullUpEl.className = '';
							pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
						}
					}
				});
				return myScroll;
			},
			//停止上拉分页
			disable : function() {
				var pullUpEl = document.getElementById('pullUp');
				//TODO 此处需要重写，对功能暂无影响
				pullUpEl.className = 'nomore';
			},
			//启用上拉分页
			enable : function() {
				var pullUpEl = document.getElementById('pullUp');
				pullUpEl.className = '';
			},
			//销毁iScroll实例，页面会失去滚动效果
			destroy : function(scroller) {
				scroller.destroy();
			}
		};
	}];

	vx.module('ibsapp').service(service);

})(window, window.vx);
/*上滑加载 结束*/
