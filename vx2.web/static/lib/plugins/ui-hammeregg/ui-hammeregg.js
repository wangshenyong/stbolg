/**
 * 主要功能:砸金蛋摇奖
 * @author guozhenyao
 * msg : 1,// 随机分配那个中奖蛋的下标，从1开始
 *prize : "100万大奖",// 中奖信息
 *eggCount : 2//用于抽奖的蛋个数
 *  */
(function(window, vx, undefined) {
	var directive = {};
	directive.uiHammeregg = [
	function() {
		var defaults = {
			msg : 1,
			prize : "100万大奖",
			eggCount : 2
		};
		return {
			restrict : 'CA',
			template : "<div class='hammerEgg'><div class='hammer'></div><ul class='eggList'><li class='egg'><span>1</span><div class='brokenFlower'></div></li><li class='egg'><span>2</span><div class='brokenFlower'></div></li><li class='egg'><span>3</span><div class='brokenFlower'></div></li></ul>" + "<div class='cover'></div><div class='resultTip'>" + "<div class='resultContent'></div>" + "<a href='index.html#/example/hammeregg' class='btn btn-info btn-large'>去领奖</a>" + "</div>" + "</div>",
			link : function(scope, element, attrs, controller) {
				var options = vx.extend({}, defaults, vx.fromJson(attrs.uiHammeregg || {}));
				var $this = $('.hammerEgg');
				if (options.eggCount == 2) {
					$this.find('.eggList').find('li').eq(2).remove();
					$this.css('width', '800px');
				}
				$this.find('.eggList').find('li').hover(function() {
					var posL = $(this).position().left + $(this).width();
					$this.find('.hammer').css('left', posL - 115);
					$this.find('.hammer').css('top', 65);
				});
				$this.find('.eggList').find('li').click(function() {
					eggClick($(this));
				});
				var hideegg = null;
				function eggClick(obj) {
					var _this = $(obj);
					hideegg = _this;
					// console.log(_this);
					// _this.unbind('click');
					var originLeft = _this.position().left + _this.width() - 115;
					$this.find('.hammer').css({
						top : 80,
						left : originLeft - 30
					});
					$this.find('.hammer').animate({
						top : 65,
						left : originLeft
					}, 100, function() {
						_this.addClass('curr');
						_this.find('.brokenFlower').show();
						//显示碎蛋
						$(this).hide();
						//隐藏斧头
						$this.find('.resultTip').css({
							display : 'block'
						});
						$this.find('.cover').css({
							display : 'block'
						});
						//中奖结果动画
						//options.msg = Math.floor(Math.random() * options.eggCount + 1);
						var currIndex = _this.index('.egg') + 1;
						//产生1-3之间的随机数
						if (options.msg == currIndex) {
							//返回结果
							$this.find(".resultContent").html("恭喜，您中得" + options.prize + "!");
						} else {
							$this.find(".resultContent").html("很遗憾,您没能中奖!");
						}
						$this.find('.resultTip').find('a').html('确定').bind('click',function(){
							playagain();
						});
					});
				}

				function playagain(){
					$this.find('.resultTip').css({
						display : 'none'
					});
					$this.find('.cover').css({
						display : 'none'
					});
					$this.find('.brokenFlower').hide();
					$this.find('.hammer').show();
					hideegg.removeClass('curr');
				}
			}
		};
	}];
	vx.module('ibsapp').directive(directive);
})(window, window.vx);
