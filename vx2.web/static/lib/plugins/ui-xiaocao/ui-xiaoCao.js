(function(window, vx, undefined) {
	'use strict';
	var mod = vx.module('ibsapp');
	var directive = {};
	mod.directive("uiXiaocao", [function() {
		return {
			restrict: 'EA',
			templateUrl: 'lib/template/ui-xiaoCao/ui-xiaoCao.html',
			link: function($scope, elem, attrs, ctrl) {
				var gSound = "css/img/ui-xiaocao/1.mp3";
				//当前页面和跳转到页面下标
				var currIndex = 1,
					gotoIndex = 2;
				//页面跳转动画是否进行中
				var isAnimating = false;
				//第二页动画是否点击过了
				var page2Clicked = false;
				//摇一摇动画是否执行过
				var shook = false;
				//记录摇一摇是否绑定
				var SHAKE_BOUND = false;
				//摇一摇相关参数
				var SHAKE_THRESHOLD = 4000;
				var SHAKE_last_update = 0;
				var SHAKE_x = 0,
					SHAKE_y = 0,
					SHAKE_z = 0,
					SHAKE_last_x = 0,
					SHAKE_last_y = 0,
					SHAKE_last_z = 0;
				/**
				 * 摇一摇函数
				 */
				function deviceMotionHandler(eventData) {
					var acceleration = eventData.accelerationIncludingGravity;

					var curTime = new Date().getTime();
					if((curTime - SHAKE_last_update) > 100) {
						var diffTime = curTime - SHAKE_last_update;
						SHAKE_last_update = curTime;

						SHAKE_x = acceleration.x;
						SHAKE_y = acceleration.y;
						SHAKE_z = acceleration.z;

						var speed = Math.abs(SHAKE_x + SHAKE_y + SHAKE_z - SHAKE_last_x - SHAKE_last_y - SHAKE_last_z) / diffTime * 10000;
						if(speed > SHAKE_THRESHOLD) {
							if(!shook) {
								navigator.vibrate(500);
								$("#QianBi").fadeIn(1000);
								shook = true;
							};
						}
						SHAKE_last_x = SHAKE_x;
						SHAKE_last_y = SHAKE_y;
						SHAKE_last_z = SHAKE_z;
					}
				}

				/**
				 * 绑定html的load事件
				 */
				document.onreadystatechange = loading;

				function loading() {
					if(document.readyState == "complete") {
						$("#loading").hide();
						$("#content").show();
						playbksound();
					}
				}

				/**
				 * 文档绑定上滑事件
				 */
				(function() {
					var s = window.innerHeight / 500;
					//计算上下偏移量
					var ss = 250 * (1 - s);

					$('.wrap').css('-webkit-transform', 'scale(' + s + ',' + s + ') translate(0px,-' + ss + 'px)');

					document.addEventListener('touchmove', function(event) {
						event.preventDefault();
					}, false);

					var vibrateSupport = "vibrate" in navigator;
					if(vibrateSupport) { //兼容不同的浏览器
						navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
					}

					$(".page-1").on("swipeUp", function() {
						if(isAnimating)
							return;
						currIndex = 1;
						gotoIndex = 4;
						pageMove("up");
					});
					$(".page-3").on("swipeDown", function() {
						if(isAnimating)
							return;
						if(page2Clicked) {
							currIndex = 3;
							gotoIndex = 2;
						} else {
							currIndex = 3;
							gotoIndex = 4;
						}

						pageMove("down");
					});
					$(".page-4").on("swipeUp", function() {
						if(isAnimating)
							return;
						currIndex = 4;
						gotoIndex = 3;
						pageMove("up");
						if(!SHAKE_BOUND) {
							if(window.DeviceMotionEvent) {
								window.addEventListener('devicemotion', deviceMotionHandler, false);
							} else {
								alert("您的手机不支持摇一摇功能");
							}
							SHAKE_BOUND = true;
						}
					});
					$(".page-4").on("swipeDown", function() {
						if(isAnimating)
							return;
						currIndex = 4;
						gotoIndex = 1;
						pageMove("down");
					});
				})();
				/**
				 * 整页滑动方法
				 */
				function pageMove(direction) {
					var currPage = ".page-" + currIndex,
						gotoPage = ".page-" + gotoIndex;

					switch(direction) {
						case "up":
							var outClass = 'pt-page-moveToTop';
							var inClass = 'pt-page-moveFromBottom';
							break;
						case "down":
							var outClass = 'pt-page-moveToBottom';
							var inClass = 'pt-page-moveFromTop';
							break;
					}
					isAnimating = true;

					$(currPage).addClass(outClass);
					$(gotoPage).removeClass("hide").addClass(inClass);

					setTimeout(function() {
						$(currPage).removeClass('page-current').removeClass(outClass).addClass("hide");

						$(gotoPage).addClass('page-current').removeClass(inClass);

						isAnimating = false;
					}, 600);
				}

				/**
				 * 打开/关闭背景音乐
				 */
				function switchsound() {
					au = document.getElementById('bgsound');
					ai = document.getElementById('sound_image');
					if(au.paused) {
						au.play();
						ai.src = "css/img/ui-xiaocao/music_off.png";
					} else {
						au.pause();
						ai.src = "css/img/ui-xiaocao/music_on.png";
					}
				}

				/**
				 * 生成背景音乐控件
				 */
				function playbksound() {
					var audiocontainer = document.getElementById('audiocontainer');
					if(audiocontainer != undefined) {
						audiocontainer.innerHTML = '<audio id="bgsound" loop="loop" autoplay="autoplay"><source src="' + gSound + '" /></audio>';
					}

					var audio = document.getElementById('bgsound');
					audio.play();
					sound_div = document.createElement("div");
					sound_div.setAttribute("id", "bgmWrapper");
					sound_div.style.cssText = "position:fixed;right:20px;top:20px;z-index:99;visibility:visible;";
					sound_div.onclick = switchsound;
					bg_htm = "<img id='sound_image' width='30px' src='css/img/ui-xiaocao/music_off.png'>";
					sound_div.innerHTML = bg_htm;
					document.body.appendChild(sound_div);
				}

				/**
				 * zepto slideDown方法
				 */
				(function($) {
					$.fn.slideDown = function(duration) {
						var position = this.css('position');

						this.show();

						this.css({
							position: 'absolute',
							visibility: 'hidden'
						});

						var height = this.height();

						this.css({
							position: position,
							visibility: 'visible',
							overflow: 'hidden',
							height: 0
						});

						this.animate({
							height: height
						}, duration);

						return this;
					};
				})(Zepto);

				/**
				 * 第1页绑定事件
				 */
				$("#ShuiHu").one("click", function(e) {
					$(".page-1").off("swipeUp");
					$("#arrow1").hide();
					$(this).removeClass("pt-page-moveCircle");
					$("#Shui").slideDown(300);
					$("#ShuiHuTiShi").hide();
					$("#RuJinTiShi").show();
					setTimeout(function() {
						$("#ZhongZi").fadeOut(500);
						setTimeout(function() {
							$("#ShuYa").show();
						}, 500);
					}, 700);
					setTimeout(function() {
						$("#QianDaiZheZhao").show();
						$("#QianDai").show();
						setTimeout(function() {
							$("#QianDaiZheZhao").hide();
							$("#QianDai").hide();
							$("#arrow1").show();
							$("#arrow2").hide();
							$(".page-1").on("swipeUp", function() {
								if(isAnimating)
									return;
								currIndex = 1;
								gotoIndex = 2;
								pageMove("up");
							}).trigger("swipeUp");
							$(".page-2").on("swipeDown", function() {
								if(isAnimating)
									return;
								currIndex = 2;
								gotoIndex = 1;
								pageMove("down");
							});
						}, 5000);
					}, 3500);

				});
				/**
				 * 第2页绑定事件
				 */
				$("#HuaFeiDai").one("click", function(e) {
					$(this).hide().removeClass("pt-page-moveCircle");
					$("#ShiFeiDai").show();
					$("#FeiLiao").slideDown(300);
					$("#ShiFeiTiShi").hide();
					$("#WeiZhiCun").show();
					$("#WeiDaiBao").show();
					setTimeout(function() {
						$("#ShuMiao").addClass("treeScaleUp");
					}, 500);
					setTimeout(function() {
						$("#ShiFeiDai").hide();
						$("#FeiLiao").hide();
						$("#WeiZhiCun").hide();
						$("#WeiDaiBao").hide();
						$("#ShiFeiDuiHua").hide();
						$("#YangGuangDuiHua").show();
						$("#HuaFeiDai").show();
						$("#YangGuangTiShi").show();
						$("#TaiYang1").show();
					}, 7000);
				});
				$("#TaiYang1").one("click", function(e) {
					page2Clicked = true;
					$(this).hide().removeClass("pt-page-moveCircle");
					$("#YangGuangTiShi").hide();
					$("#TaiYang2").show();
					$("#YangGuang").show();
					$("#WeiLiCai").show();
					$("#ShuMiao").fadeOut(2000);
					setTimeout(function() {
						$("#DaShu").fadeIn(1000);
					}, 2000);
					setTimeout(function() {
						$("#arrow2").show();
						$(".page-2").on("swipeUp", function() {
							if(isAnimating)
								return;
							currIndex = 2;
							gotoIndex = 3;
							pageMove("up");
							if(!SHAKE_BOUND) {
								if(window.DeviceMotionEvent) {
									window.addEventListener('devicemotion', deviceMotionHandler, false);
								} else {
									alert("您的手机不支持摇一摇功能");
								}
								SHAKE_BOUND = true;
							}
						}).trigger("swipeUp");
					}, 7000);
				});
			}
		};
	}]);

})(window, window.vx, window.$);