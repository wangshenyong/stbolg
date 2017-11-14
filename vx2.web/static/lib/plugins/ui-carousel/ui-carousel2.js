/**
 * @author xuxihai
 *  <div  v-model="selectObj" ui-carousel="PrdList" incoming-field="des;rate" select-call="select(index)></div>
 *  <input  v-model="selectObj" ui-carousel="PrdList" incoming-field="des;rate" select-call="select(index)/>
 * v-model:model值，要求与json中字段一致
 * incoming-field 显示的字段,传入时需用;分割开来
 * index 记录当前产品在List位于第几个
 * select-call 回调函数
 */
(function (window, vx, undefined) {
	'use strict';
	var directive = {};

	var RESPLEVEL = 5; //调节速度....
	var ignoreNotExist = true;
	directive.uiCarousel2 = function () {
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				var repeatExp = attrs.uiCarousel2;
				var selectCall = attrs.selectCall;
				var incomingField = attrs.incomingField;
				var SlideEl = '' +
					'<div  class="zy-Slide">' +
					'   <section class="sl" ></section>' +
					'   <section class="sr" ></section>' +
					'   <ul class=\"carousel\"></ul>' +
					"</div>";
				SlideEl = $(SlideEl);
				var carouselEl = SlideEl.children().last();
				var carouselList;
				element.hide();
				element.after(SlideEl);
				if (incomingField) {
					var fileds = incomingField.split(';');
				}
				scope.$watch(repeatExp, function (newLis) {
					if (newLis) {
						createCarousel(newLis);
					}
				});

				function applyItem(index) {
					if (carouselList[index].ignoreFlag) {
						index = undefined;
						if(ignoreNotExist){
							return false;
						}
					}
					scope.$apply(function () {
						if(attrs.ngModel){
							scope[attrs.ngModel] = carouselList[index];
						}
						scope.$eval(selectCall, {index: index});
					});
				}

				function createCarousel(repeatList) {
					carouselList = repeatList.slice(0);
					carouselEl.height(SlideEl.height());
					// 显示图片
					var htmlPic = '', length = carouselList.length;
					if (length < 3) {
						fillArray(carouselList);
						length = carouselList.length;
					}
					var temp, tempEl;
					for (var i = 0; i < length; i++) {
						temp = carouselList[i];
						if (!temp.ignoreFlag) {
							tempEl = '' +
								'<li id="piece' + i + '" class="carousel_card" >' +
								'   <span  class="des">' + temp[fileds[0]] + '</span>' +
								'   <span class="rate">' + Number(temp[fileds[1]] * 100).toFixed(2) + '%</span>' +
								'</li>';
						} else {
							tempEl = '' +
								'<li id="piece' + i + '" class="carousel_card" >' +
								'   <span class="des" ></span>' +
								'   <span class="rate" >待添加</span>' +
								'</li>';
						}
						htmlPic = htmlPic + tempEl;
					}
					carouselEl.html(htmlPic);
					var lis = carouselEl.children(), lastIndex;
					carouselEl.Cloud9Carousel({
						yOrigin: 0,
						yRadius: 0,
						farScale: 0.8,
						itemClass: "carousel_card",
						buttonLeft: SlideEl.children().first(),
						buttonRight: SlideEl.children().eq(1),
						bringToFront: true,
						onLoaded: function () {
							carouselEl.css('visibility', 'visible');
							carouselEl.css('display', 'none');
							carouselEl.fadeIn(1500);
							applyItem(0);
						},
						onRendered: function (carousel) {
							var index = carousel.nearestIndex();
							lis.removeClass("active");
							lis.eq(index).addClass("active");
						},
						onAnimationFinished: function (carousel) {
							var index = carouselObj.nearestIndex();
							console.log('lastIndex-' + lastIndex + ',index-' + index);
							if (index !== lastIndex) {
								lastIndex = index;
								console.log('true');
								applyItem(index);
							}
						}
					});
					var carouselObj = carouselEl.data('carousel');
					var startTime, endTime, startX, moveEndX;
					SlideEl.on({
						"touchstart": function (e) {
							var initial = attrs.initial || true;
							startTime = Date.now();
							e.stopPropagation();
							if (initial == 'true') {
								startX = e.originalEvent.touches[0].pageX;
								attrs.initial = false;
							} else {
								startX = e.originalEvent.touches[0].pageX;
							}
						},
						"touchend": function (event) {
							var moveDistince,
								speed,
								offset;//移动后的计算位置
							endTime = Date.now();
							moveEndX = event.originalEvent.changedTouches[0].pageX;
							moveDistince = moveEndX - startX;
							speed = moveDistince * 1000 / (endTime - startTime);
							offset = speed / RESPLEVEL / 20;//RESPLEVEL
							if (offset > 0) {
								offset = Math.ceil(offset);
							} else {
								offset = Math.floor(offset);
							}
							offset = -offset; //反向
							carouselObj.go(offset);
						}
					});

				}

				function fillArray(array) {
					var count = 3 - array.length;
					var undefObj;
					for (var i = 0; i < count; i++) {
						undefObj = clearAttr(vx.extend({}, array[0]));
						undefObj.ignoreFlag = true;
						array.push(undefObj);
					}
				}

				function clearAttr(obj) {
					for (var key in obj) {
						if (obj.hasOwnProperty(key)) {
							obj[key] = undefined;
						}
					}
					return obj;
				}

			}
		};

	};
	ibsapp.directive(directive);
})(window, window.vx);

/***plugin ****/

/*
 * Cloud 9 Carousel 2.1.0
 *
 * Pseudo-3D carousel plugin for jQuery/Zepto focused on performance.
 *
 * Based on the original CloudCarousel by R. Cecco.
 *
 * See the demo and download the latest version:
 *   http://specious.github.io/cloud9carousel/
 *
 * Copyright (c) 2016 by Ildar Sagdejev ( http://specious.github.io )
 * Copyright (c) 2011 by R. Cecco ( http://www.professorcloud.com )
 *
 * MIT License
 *
 * Please retain this copyright header in all versions of the software
 *
 * Requires:
 *  - jQuery 1.3.0 or later -OR- Zepto 1.1.1 or later
 *
 * Optional (jQuery only):
 *  - Reflection support via reflection.js plugin by Christophe Beyls
 *     http://www.digitalia.be/software/reflectionjs-for-jquery
 *  - Mousewheel support via mousewheel plugin
 *     http://plugins.jquery.com/mousewheel/
 */

;(function($) {
	//
	// Detect CSS transform support
	//
	var transform = (function() {
		var vendors = ['webkit', 'moz', 'ms'];
		var style   = document.createElement( "div" ).style;
		var trans   = 'transform' in style ? 'transform' : undefined;

		for( var i = 0, count = vendors.length; i < count; i++ ) {
			var prop = vendors[i] + 'Transform';
			if( prop in style ) {
				trans = prop;
				break;
			}
		}

		return trans;
	})();

	var Item = function( element, options ) {
		element.item = this;
		this.element = element;

		if( element.tagName === 'IMG' ) {
			this.fullWidth = element.width;
			this.fullHeight = element.height;
		} else {
			element.style.display = "inline-block";
			this.fullWidth = element.offsetWidth;
			this.fullHeight = element.offsetHeight;
		}

		element.style.position = 'absolute';

		if( options.mirror && this.element.tagName === 'IMG' ) {
			// Wrap image in a div together with its generated reflection
			this.reflection = $(element).reflect( options.mirror ).next()[0];

			var $reflection = $(this.reflection);
			this.reflection.fullHeight = $reflection.height();
			$reflection.css( 'margin-top', options.mirror.gap + 'px' );
			$reflection.css( 'width', '100%' );
			element.style.width = "100%";

			// The item element now contains the image and reflection
			this.element = this.element.parentNode;
			this.element.item  = this;
			this.element.alt   = element.alt;
			this.element.title = element.title;
		}

		if( transform && options.transforms )
			this.element.style[transform + "Origin"] = "0 0";

		this.moveTo = function( x, y, scale ) {
			this.width = this.fullWidth * scale;
			this.height = this.fullHeight * scale;
			this.x = x;
			this.y = y;
			this.scale = scale;

			var style = this.element.style;
			style.zIndex = "" + (scale * 100) | 0;

			if( transform && options.transforms ) {
				style[transform] = "translate(" + x + "px, " + y + "px) scale(" + scale + ")";
			} else {
				// Manually resize the gap between the image and its reflection
				if( options.mirror && this.element.tagName === 'IMG' )
					this.reflection.style.marginTop = (options.mirror.gap * scale) + "px";

				style.width = this.width + "px";
				style.left = x + "px";
				style.top = y + "px";
			}
		};
	};

	var time = !window.performance || !window.performance.now ?function() { return +new Date(); } :function() { return performance.now(); };

	//
	// Detect requestAnimationFrame() support
	//
	// Support legacy browsers:
	//   http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
	//
	var cancelFrame = window.cancelAnimationFrame || window.cancelRequestAnimationFrame;
	var requestFrame = window.requestAnimationFrame;

	(function() {
		var vendors = ['webkit', 'moz', 'ms'];

		for( var i = 0, count = vendors.length; i < count && !cancelFrame; i++ ) {
			cancelFrame = window[vendors[i]+'CancelAnimationFrame'] || window[vendors[i]+'CancelRequestAnimationFrame'];
			requestFrame = requestFrame && window[vendors[i]+'RequestAnimationFrame'];
		}
	}());

	var Carousel = function( element, options ) {
		var self = this;
		var $container = $(element);
		this.items = [];
		this.xOrigin = (options.xOrigin === null) ? $container.width()  * 0.5 : options.xOrigin;
		this.yOrigin = (options.yOrigin === null) ? $container.height() * 0.1 : options.yOrigin;
		this.xRadius = (options.xRadius === null) ? $container.width()  / 2.3 : options.xRadius;
		this.yRadius = (options.yRadius === null) ? $container.height() / 6   : options.yRadius;
		this.farScale = options.farScale;
		this.rotation = this.destRotation = Math.PI/2; // start with the first item positioned in front
		this.speed = options.speed;
		this.smooth = options.smooth;
		this.fps = options.fps;
		this.timer = 0;
		this.autoPlayAmount = options.autoPlay;
		this.autoPlayDelay = options.autoPlayDelay;
		this.autoPlayTimer = 0;
		this.onLoaded = options.onLoaded;
		this.onRendered = options.onRendered;
		this.onAnimationFinished = options.onAnimationFinished;

		this.itemOptions = {
			transforms: options.transforms
		};

		if( options.mirror ) {
			this.itemOptions.mirror = $.extend( { gap: 2 }, options.mirror );
		}

		$container.css( { position: 'relative', overflow: 'hidden' } );

		// Rotation:
		//  *      0 : right
		//  *   Pi/2 : front
		//  *   Pi   : left
		//  * 3 Pi/2 : back
		this.renderItem = function( itemIndex, rotation ) {
			var item = this.items[itemIndex];
			var sin = Math.sin(rotation);
			var farScale = this.farScale;
			var scale = farScale + ((1-farScale) * (sin+1) * 0.5);

			item.moveTo(
				this.xOrigin + (scale * ((Math.cos(rotation) * this.xRadius) - (item.fullWidth * 0.5))),
				this.yOrigin + (scale * sin * this.yRadius),
				scale
			);
		};

		this.render = function() {
			var count = this.items.length;
			var spacing = 2 * Math.PI / count;
			var radians = this.rotation;

			for( var i = 0; i < count; i++ ) {
				this.renderItem( i, radians );
				radians += spacing;
			}

			if( typeof this.onRendered === 'function' )
				this.onRendered( this );
		};

		this.playFrame = function() {
			var rem = self.destRotation - self.rotation;
			var now = time();
			var dt = (now - self.lastTime) * 0.002;
			self.lastTime = now;

			if( Math.abs(rem) < 0.003 ) {
				self.rotation = self.destRotation;
				self.pause();

				if( typeof self.onAnimationFinished === 'function' )
					self.onAnimationFinished();
			} else {
				// Asymptotically approach the destination
				self.rotation = self.destRotation - rem / (1 + (self.speed * dt));
				self.scheduleNextFrame();
			}

			self.render();
		};

		this.scheduleNextFrame = function() {
			this.lastTime = time();

			this.timer = this.smooth && cancelFrame ?
				requestFrame( self.playFrame ) :
				setTimeout( self.playFrame, 1000 / this.fps );
		};

		this.itemsRotated = function() {
			return this.items.length * ((Math.PI/2) - this.rotation) / (2*Math.PI);
		};

		this.floatIndex = function() {
			var count = this.items.length;
			var floatIndex = this.itemsRotated() % count;

			// Make sure float-index is positive
			return (floatIndex < 0) ? floatIndex + count : floatIndex;
		}

		this.nearestIndex = function() {
			return Math.round( this.floatIndex() ) % this.items.length;
		}

		this.nearestItem = function() {
			return this.items[this.nearestIndex()];
		}

		this.play = function() {
			if( this.timer === 0 )
				this.scheduleNextFrame();
		}

		this.pause = function() {
			this.smooth && cancelFrame ? cancelFrame( this.timer ) : clearTimeout( this.timer );
			this.timer = 0;
		}

		//
		// Spin the carousel by (+-) count items
		//
		this.go = function( count ) {
			this.destRotation += (2 * Math.PI / this.items.length) * count;
			this.play();
		}

		this.goTo = function( index ) {
			var count = this.items.length;

			// Find the shortest way to rotate item to front
			var diff = index - (this.floatIndex() % count);

			if( 2 * Math.abs(diff) > count )
				diff -= (diff > 0) ? count : -count;

			// Halt any rotation already in progress
			this.destRotation = this.rotation;

			// Spin the opposite way to bring item to front
			this.go( -diff );

			// Return rotational distance (in items) to the target
			return diff;
		}

		this.deactivate = function() {
			this.pause();
			clearInterval( this.autoPlayTimer );
			if( options.buttonLeft ) options.buttonLeft.unbind( 'click' );
			if( options.buttonRight ) options.buttonRight.unbind( 'click' );
			$container.unbind( '.cloud9' );
		}

		this.autoPlay = function() {
			this.autoPlayTimer = setInterval(
				function() { self.go( self.autoPlayAmount ) },
				this.autoPlayDelay
			);
		}

		this.enableAutoPlay = function() {
			// Stop auto-play on mouse over
			$container.bind( 'mouseover.cloud9', function() {
				clearInterval( self.autoPlayTimer );
			} );

			// Resume auto-play when mouse leaves the container
			$container.bind( 'mouseout.cloud9', function() {
				self.autoPlay();
			} );

			this.autoPlay();
		}

		this.bindControls = function() {
			if( options.buttonLeft ) {
				options.buttonLeft.bind( 'click', function() {
					self.go( -1 );
					return false;
				} );
			}

			if( options.buttonRight ) {
				options.buttonRight.bind( 'click', function() {
					self.go( 1 );
					return false;
				} );
			}

			if( options.mouseWheel ) {
				$container.bind( 'mousewheel.cloud9', function( event, delta ) {
					self.go( (delta > 0) ? 1 : -1 );
					return false;
				} );
			}

			if( options.bringToFront ) {
				$container.bind( 'click.cloud9', function( event ) {
					var hits = $(event.target).closest( '.' + options.itemClass );

					if( hits.length !== 0 ) {
						var diff = self.goTo( self.items.indexOf( hits[0].item ) );

						// Suppress default browser action if the item isn't roughly in front
						if( Math.abs(diff) > 0.5 )
							event.preventDefault();
					}
				} );
			}
		}

		var items = $container.find( '.' + options.itemClass );

		this.finishInit = function() {
			//
			// Wait until all images have completely loaded
			//
			for( var i = 0; i < items.length; i++ ) {
				var item = items[i];
				if( (item.tagName === 'IMG') &&
					((item.width === undefined) || ((item.complete !== undefined) && !item.complete)) )
					return;
			}

			clearInterval( this.initTimer );

			// Init items
			for( i = 0; i < items.length; i++ )
				this.items.push( new Item( items[i], this.itemOptions ) );

			// Disable click-dragging of items
			$container.bind( 'mousedown onselectstart', function() { return false } );

			if( this.autoPlayAmount !== 0 ) this.enableAutoPlay();
			this.bindControls();
			this.render();

			if( typeof this.onLoaded === 'function' )
				this.onLoaded( this );
		};

		this.initTimer = setInterval( function() { self.finishInit() }, 50 );
	}

	//
	// The jQuery plugin
	//
	$.fn.Cloud9Carousel = function( options ) {
		return this.each( function() {
			/* For full list of options see the README */
			options = $.extend( {
				xOrigin: null,        // null: calculated automatically
				yOrigin: null,
				xRadius: null,
				yRadius: null,
				farScale: 0.5,        // scale of the farthest item
				transforms: true,     // enable CSS transforms
				smooth: true,         // enable smooth animation via requestAnimationFrame()
				fps: 30,              // fixed frames per second (if smooth animation is off)
				speed: 4,             // positive number
				autoPlay: 0,          // [ 0: off | number of items (integer recommended, positive is clockwise) ]
				autoPlayDelay: 4000,
				bringToFront: false,
				itemClass: 'cloud9-item',
				handle: 'carousel'
			}, options );

			$(this).data( options.handle, new Carousel( this, options ) );
		} );
	}
})( window.jQuery || window.Zepto );
