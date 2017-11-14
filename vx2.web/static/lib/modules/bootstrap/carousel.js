vx.module('ui.bootstrap.carousel', ['ui.bootstrap.transition'])
	.controller('CarouselController', ['$scope', '$timeout', '$interval', '$transition', function ($scope, $timeout, $interval, $transition) {
		var self = this,
			slides = self.slides = $scope.slides = [],
			currentIndex = -1,
			currentInterval, isPlaying;
		self.currentSlide = null;
		var destroyed = false;
		self.select = $scope.select = function (nextSlide, direction) {
			var nextIndex = slides.indexOf(nextSlide);
			if (direction === undefined) {
				direction = nextIndex > currentIndex ? 'next' : 'prev';
			}
			if (nextSlide && nextSlide !== self.currentSlide) {
				if ($scope.$currentTransition) {
					$scope.$currentTransition.cancel();
					$timeout(goNext);
				} else {
					goNext();
				}
			}
			function goNext() {
				if (destroyed) {
					return;
				}
				if (self.currentSlide && vx.isString(direction) && !$scope.noTransition && nextSlide.$element) {
					nextSlide.$element.addClass(direction);
					var reflow = nextSlide.$element[0].offsetWidth;
					vx.forEach(slides, function (slide) {
						vx.extend(slide, {
							direction: '',
							entering: false,
							leaving: false,
							active: false
						});
					});
					vx.extend(nextSlide, {
						direction: direction,
						active: true,
						entering: true
					});
					vx.extend(self.currentSlide || {}, {
						direction: direction,
						leaving: true
					});
					$scope.$currentTransition = $transition(nextSlide.$element, {});
					(function (next, current) {
						$scope.$currentTransition.then(
							function () {
								transitionDone(next, current);
							},
							function () {
								transitionDone(next, current);
							}
						);
					}(nextSlide, self.currentSlide));
				} else {
					transitionDone(nextSlide, self.currentSlide);
				}
				self.currentSlide = nextSlide;
				currentIndex = nextIndex;
				restartTimer();
			}

			function transitionDone(next, current) {
				vx.extend(next, {
					direction: '',
					active: true,
					leaving: false,
					entering: false
				});
				vx.extend(current || {}, {
					direction: '',
					active: false,
					leaving: false,
					entering: false
				});
				$scope.$currentTransition = null;
			}
		};
		$scope.$on('$destroy', function () {
			destroyed = true;
		});
		/* Allow outside people to call indexOf on slides array */
		self.indexOfSlide = function (slide) {
			return slides.indexOf(slide);
		};
		$scope.next = function () {
			var newIndex = (currentIndex + 1) % slides.length;
			if (!$scope.$currentTransition) {
				return self.select(slides[newIndex], 'next');
			}
		};
		$scope.prev = function () {
			var newIndex = currentIndex - 1 < 0 ? slides.length - 1 : currentIndex - 1;
			if (!$scope.$currentTransition) {
				return self.select(slides[newIndex], 'prev');
			}
		};
		$scope.isActive = function (slide) {
			return self.currentSlide === slide;
		};
		$scope.$watch('interval', restartTimer);
		$scope.$on('$destroy', resetTimer);
		function restartTimer() {
			resetTimer();
			var interval = +$scope.interval;
			if (!isNaN(interval) && interval > 0) {
				currentInterval = $interval(timerFn, interval);
			}
		}

		function resetTimer() {
			if (currentInterval) {
				$interval.cancel(currentInterval);
				currentInterval = null;
			}
		}

		function timerFn() {
			var interval = +$scope.interval;
			if (isPlaying && !isNaN(interval) && interval > 0) {
				$scope.next();
			} else {
				$scope.pause();
			}
		}

		$scope.play = function () {
			if (!isPlaying) {
				isPlaying = true;
				restartTimer();
			}
		};
		$scope.pause = function () {
			if (!$scope.noPause) {
				isPlaying = false;
				resetTimer();
			}
		};
		self.addSlide = function (slide, element) {
			slide.$element = element;
			slides.push(slide);
			if (slides.length === 1 || slide.active) {
				self.select(slides[slides.length - 1]);
				if (slides.length == 1) {
					$scope.play();
				}
			} else {
				slide.active = false;
			}
		};
		self.removeSlide = function (slide) {
			var index = slides.indexOf(slide);
			slides.splice(index, 1);
			if (slides.length > 0 && slide.active) {
				if (index >= slides.length) {
					self.select(slides[index - 1]);
				} else {
					self.select(slides[index]);
				}
			} else if (currentIndex > index) {
				currentIndex--;
			}
		};
	}]).directive('carousel', [function () {
	return {
		restrict: 'EA',
		transclude: true,
		replace: true,
		controller: 'CarouselController',
		require: 'carousel',
		templateUrl: 'lib/template/carousel/carousel.html',
		scope: {
			interval: '=',
			noTransition: '=',
			noPause: '='
		}
	};
}]).directive('slide', function () {
	return {
		require: '^carousel',
		restrict: 'EA',
		transclude: true,
		replace: true,
		templateUrl: 'lib/template/carousel/slide.html',
		scope: {
			active: '=?'
		},
		link: function (scope, element, attrs, carouselCtrl) {
			carouselCtrl.addSlide(scope, element);
			scope.$on('$destroy', function () {
				carouselCtrl.removeSlide(scope);
			});
			scope.$watch('active', function (active) {
				if (active) {
					carouselCtrl.select(scope);
				}
			});
		}
	};
});
