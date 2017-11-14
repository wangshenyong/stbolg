'use strict';
/**
 * RegisterPreCtrl
 */
ibsapp.controller('UserRegisterCtrl', ['$scope', '$log', '$remote',
	function ($scope, $log, $remote) {
		$scope.UserRegister = function () {
			if(!$scope.agreeMent){
				alert("请同意用户协议!");
				return;
			}
			var pargs = $scope.confirmData;
			pargs.Password=$scope.password;
			pargs.VerifyCode=$scope.verifyCode;
			$remote.post('UserRegister.do', pargs, function (data) {
				if (data._RejCode == "000000") {
					$scope.result = {
						Username: $scope.Username,
						CtPhoneNo: $scope.CtPhoneNo,
						crtType: $scope.crtType,
						ctNo: $scope.ctNo,
						acType: $scope.acType,
						acNum: $scope.acNum,
						UserId: $scope.UserId,
					};
					$scope.goto('#3');
				}
			});


		};
		$scope.checkPwd=function() {
			if($scope.password!=$scope.password2) {
				return false;
			}
		};
		//      appOrgId:"请输入应用机构代码",
		//		agNo:"请输入签约协议号",
		//		ctNo:"请输入合约编号",
		//		ctType:"请输入签约类型",
		//		channelId:"请输入渠道代码",
		//		ctPrdAcNo:"请输入签约产品账号",
		//		ctCapAcNo:"请输入签约产品账号",
		//		ctPrdId:"请输入签约产品账号",
		//		ctPhoneNo:"请输入签约手机号",
		//		ctBeginDate:"请输入签约生效日期",
		//		ctEndDate:"请输入签约到期日期",
		//		ctDes:"请输入签约内容描述",
		//		ctOrgId:"请输入签约机构",
		//		ctCnt:"请输入签约柜员",
		//		regChannelId:"请输入注册渠道代码",
		//		userManager:"请输入所属客户经理",
		//		hangType:"请输入加挂类型",
		//		acNo:"请输入加挂账户",
		//		bankType:"请输入本他行标识",
		$scope.UserRegisterPre = function () {

			$scope.confirmData = {
				UserId: $scope.UserId,
				Username: $scope.Username,
				CrtType: $scope.crtType,
				AppOrgId: "9999",
				AgNo: "787909898",
				CtNo: "78732131",
				CtType: "R",
				ChannelId: "web",
				CtPrdAcNo: "62783781278332131",
				CtCapAcNo: "62783781278332131",
				CtPrdId: "LC",
				CtPhoneNo: $scope.CtPhoneNo,
				CtBeginDate: "20161028",
				CtEndDate: "20171028",
				CtDes: "测试miaoshu",
				CtOrgId: "9000",
				CtCnt: "9527",
				ImgLink: "http://localhost:8080/web/bank/images/default_564x614.jpg",
				UserType: "",
				DefaultRoleId: "0001",
				RegChannelId: "web",
				UserState: "",
				UserStateDes: "",
				UserManager: "9528",
				HangType: "0",
				AcNo: "62783781278332131",
				BankType: "9898"
			};
			$scope.goto('#2');
		};
	}]);