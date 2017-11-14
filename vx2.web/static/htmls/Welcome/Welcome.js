'use strict';
/**
 * RegisterPreCtrl
 */
ibsapp.controller('WelcomeCtrl', ['$scope', '$cookieService', '$remote', '$timeout',
	function ($scope, $cookieService, $remote, $timeout) {
		$scope.startup = function () {
			new Swiper('.swiper2', {
				pagination: '.pagination2',
				paginationClickable: true,
				centeredSlides: true,
				speed: 300,
				loop: true,
			});
			new Swiper('.swiper3', {
				slidesPerView: 5,
				centeredSlides: true,
				prevButton: '.swpier3-prev',
				nextButton: '.swpier3-next',
				autoplay: true,
				speed: 3000,
				loop: true,
			});
			console.log($scope.$userinfo);
			var UserId = $cookieService.getCookie('UserId');
			var Username = $cookieService.getCookie('Username');
			$scope.Username = Username;
			var pargs = {
				UserId: UserId
			};

			$remote.post("AccountList.do", pargs, function (data) {
				$scope.AccList = data.List;
				$timeout(function () {
					new Swiper('.swiper4', {
						slidesPerView: 1.5,
						paginationClickable: true,
						centeredSlides: true,
						prevButton: '.swpier4-prev',
						nextButton: '.swpier4-next',
						loop: true,
						onSlideNextEnd: function (swiper) {
							var loopLength = $scope.AccList.length;
							$scope.selectCard = $scope.AccList[(swiper.activeIndex - 1) % loopLength];
						}
					});

				});
			});
		};
	}]);