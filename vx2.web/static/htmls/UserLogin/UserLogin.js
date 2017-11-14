ibsapp.controller("LoginCtrl", ["$scope", "$remote",  '$modalServer', '$cookieService','$window',
	function ($scope, $remote,  $modalServer, $cookieService,$window) {
		//初始化
		$scope.startup = function () {
			$scope.isRemember = $cookieService.getCookie("_isRemember");
			if ($scope.isRemember || $scope.isRemember == "true") {
				$scope.UserId = $cookieService.getCookie("_UserId");
				$scope.GXURL = 'images/ico_01.png';
			}
			$scope.loginInvalidFlag = false;

			// 登录方式切换
			$("#login_box .codeBtn").click(function () {
				$(this).parent().hide().siblings().show();
			});
			$("#login_box2 .PcLogBtn").click(function () {
				$(this).parent().hide().siblings().show();
			});

			var showAlertText = function () {
				$(".alertText").animate({
					width: "320px"
				});
				$(".arrBtn2").hide();
			}
			$("#login_box .ico1").focus(function () {
				showAlertText();
			});

			new Swiper('.swiper-container', {
				direction: 'horizontal',
				loop: false,
				pagination: '.swiper-pagination',
				paginationClickable: true,
				autoplay: 5000
			});
		};
		$scope.doLogin = function () {
			if ($scope.isRemember || $scope.isRemember == "true") {
				$cookieService.addCookice("_UserId", $scope.UserId, 7);
			} else {
				$cookieService.deleteCookie("_UserId");
			}
			var param = {
				"AuthType": "5",
				"Username": $scope.UserId,
				"Password": $scope.Password,
				"PasswordType": "1",
				"OldPassword": ""
			};
			// 登陆按钮失效
			$("#loadimg").show();
			$scope.loginInvalidFlag = true;
			$remote.post("UserLogin.do", param, function (data) {
				if(data.UserId){
					$cookieService.addCookice("UserId", data.UserId);
					$cookieService.addCookice("Name", data.Name);
					$cookieService.addCookice("Username", param.Username);
					location.href = 'index.html';
				}
				// 登陆按钮有效
				$("#loadimg").hide();
				$scope.loginInvalidFlag = false;
			}, function (data) {
				// 登陆按钮有效
				$("#loadimg").hide();
				$scope.loginInvalidFlag = false;
				$("#codeVal").css("display", "block");
				//登录失败，显示验证码
				$scope.errorCount = 1;
				//错误，送1
				//$scope.getImgToken();
			});

		};
		$scope.doRegister = function () {
			$scope.goto("/loginapp/UserRegister");
		};
		$scope.isRememberFn = function () {
			//$scope.isRemember = !$scope.isRemember;
			$cookieService.addCookice("_isRemember", $scope.isRemember, 7);
		};

		$scope.getImgToken = function () {
			$scope.ImgRandom = Math.random();
		};

	}]);
