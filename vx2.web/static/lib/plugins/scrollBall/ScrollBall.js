/**
 * @author RYQ
 * canvas绘制滚动小球
 * */
(function(window, vx, undefined) {'use strict';

	var service = {};
	service.ScrollBall = [
	function() {
		var BallX, BallY;
		//小球在canvas元素中的横坐标与纵坐标
		var AddX, AddY;
		//小球每次移动时的横向移动距离与纵向移动距离
		var width, height;
		//canvas元素的宽度与高度
		var canvas;
		//canvas元素
		var context;
		//canvas元素的图形上下文对象
		var functionId;
		//用来停止动画函数的整型变量
		var BallRadius;
		//小球半径
		var dataStr;	//文本
		var title;		//文本标题
		var strWidth;	//文本的宽度
		var titleWidth;	//文本标题宽度
		var bgImg;		//背景图片
		var ballImg;	//小球图片
		var ratio;		//canvas和css像素比例值，作用：修正文本、图片等模糊问题
		var fontSize; //字体大小
		return {
			Ball : function(dom, data) {

				if(functionId){
					clearTimeout(functionId);
				}//解决：跳页出去以后点击回退按钮回来之后canvas动画失效的问题

				canvas = dom;
				//获取canvas元素
//				width = $(window).get(0).innerWidth;//获取屏幕宽度
				width = canvas.width;
				//获取canvas元素的宽度
				height = canvas.height;

				//获取canvas元素的高度
				context = canvas.getContext('2d');//获取canvas元素的图形上下文对象


				var devicePixelRatio = window.devicePixelRatio || 1;
                var backingStorePixelRatio = context.webkitBackingStorePixelRatio ||
                                             context.mozBackingStorePixelRatio ||
                                             context.msBackingStorePixelRatio ||
                                             context.oBackingStorePixelRatio ||
                                             context.backingStorePixelRatio || 1;

				ratio = devicePixelRatio / backingStorePixelRatio;

				BallRadius = 50;

				canvas.style.width = width + "px";
				canvas.style.height = height + "px";

				canvas.width = width * ratio;
				canvas.height = height * ratio;



				BallX = parseInt(Math.random() * canvas.width);

				//随机设置小球的当前横坐标
				BallY = parseInt(Math.random() * canvas.height);
				//随机设置小球的当前纵坐标
				BallRadius *=  ratio;
				//小球半径

				AddX= -3, AddY = -3;
				AddX *=  ratio;
				//设置小球每次横向移动距离为5
				AddY *=  ratio;
				//设置小球每次纵向移动距离为5

				fontSize = 12;

				dataStr = data.data;//显示的数据
				title = data.title;



				bgImg = new Image();
				bgImg.src = "lib/plugins/scrollBall/img/bgCapital.jpg";
				bgImg.onload = function() {
					context.drawImage(bgImg, 0, 0, width*ratio , height*ratio);
				};

				ballImg = new Image();
				ballImg.src = "lib/plugins/scrollBall/img/bubble.png";

				draw();
				//绘制矩形桌面与小球

				//每0.1秒重绘矩形桌面与小球，改变小球位置以产生动画效果
				functionId = setInterval(function() {
					draw();
				}, 100);
			},
			clearCanvas:function(){
				if(functionId){
					clearInterval(functionId);
				};
			}
		};

		function draw() {
			context.clearRect(0, 0, width*ratio, height*ratio);
			//清除canvas元素中的内容
			context.save();
			//保存当前绘制状态

			context.drawImage(bgImg, 0, 0, width*ratio, height*ratio);
			context.drawImage(ballImg, BallX, BallY, 2*BallRadius , 2*BallRadius );


			context.fillStyle = "#fff";
			context.font = fontSize*ratio +  "px Courier New";
			titleWidth = context.measureText(title).width ;//计算字符串的宽度
			context.fillText(title, BallX + BallRadius - titleWidth / 2, BallY + BallRadius*2/3 );

			strWidth = context.measureText(dataStr).width ;
			context.fillText(dataStr, BallX + BallRadius - strWidth / 2, BallY + BallRadius/3 + BallRadius);
			BallX += AddX;
			//计算小球移动后的下次绘制时的横坐标
			BallY += AddY;
			//计算小球移动后的下次绘制时的纵坐标
			if (BallX < 0){//小球向左移动时位置超过左边框

				BallX = 0;
				//将小球移到桌面内
				AddX = -AddX;
				//改变小球移动方向，使其向右移动
			}else if (BallX > width*ratio - 2*BallRadius){//小球向右移动时位置超过右边框

				BallX = width*ratio - 2*BallRadius;
				//将小球移到桌面内
				AddX = -AddX;
				//改变小球移动方向，使其向左移动
			}
			if (BallY < 0){//小球向上移动时位置超过上边框
				BallY = 0;
				//将小球移到桌面内
				AddY = -AddY;
				//改变小球移动方向，使其向下移动
			} else if (BallY > height*ratio - 2*BallRadius){//小球向下移动时位置超过下边框
				BallY = height*ratio - 2*BallRadius;
				//将小球移到桌面内
				AddY = -AddY;
				//改变小球移动方向，使其向上移动
			}

			context.restore();
			//恢复上次保存的绘制状态
		}

	}];

	vx.module('ibsapp').service(service);

})(window, window.vx);
