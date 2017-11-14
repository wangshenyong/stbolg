'use strict';
/**
 * 商户申请controller
 */
ibsapp.controller('MobileRechargeCtrl', ['$scope', '$remote', '$filter', '$dateUtil', '$cookieService',
	function ($scope, $remote, $filter, $dateUtil, $cookieService) {


		//对页面进行初始化
		$scope.startup = function () {
			$scope.ContactsList = [
				{"name": "阿拉蕾", "phone": "18789567456", region: "北京移动"},
				{"name": "阿拉丁", "phone": "15861390870", region: "北京电信"},
				{"name": "蔡一鸣", "phone": "18609874537", region: "北京联通"},
				{"name": "陈微", "phone": "15861390870", region: "北京电信"},
				{"name": "陈冠希", "phone": "15861390870", region: "北京电信"},
				{"name": "陈铭", "phone": "15861390870", region: "北京联通"},
				{"name": "陈冰", "phone": "15861390870", region: "北京移动"},
				{"name": "陈晓", "phone": "15861390870", region: "北京联通"},
				{"name": "蔡一鸣", "phone": "18609874537", region: "北京电信"},
				{"name": "陈微", "phone": "15861390870", region: "北京联通"},
				{"name": "陈冠希", "phone": "15861390870", region: "北京移动"},
				{"name": "陈铭", "phone": "15861390870", region: "北京电信"},
				{"name": "陈冰", "phone": "15861390870", region: "北京移动"},
				{"name": "陈晓", "phone": "15861390870", region: "北京联通"},
			];
			$scope.contact = $scope.ContactsList[0];


			var pargs = {
				"AppOrgCode": "9999",
				"prodtCd": "100"
			};
			$remote.post("ProdMainInfoQry.do", pargs, function (data) {
				$scope.ProdsList = data.List;
				$scope.selectProd = $scope.ProdsList[0];
			});
			//
			//$scope.FaceAmts = [
			//	{
			//		value: 10,
			//		prodId: "10"
			//	}, {
			//		value: 20,
			//		prodId: "20"
			//	}, {
			//		value: 30,
			//		prodId: "30"
			//	}, {
			//		value: 50,
			//		prodId: "50"
			//	}, {
			//		value: 100,
			//		prodId: "100"
			//	}, {
			//		value: 200,
			//		prodId: "200"
			//	}, {
			//		value: 300,
			//		prodId: "300"
			//	}, {
			//		value: 500,
			//		prodId: "500"
			//	}
			//];


			var UserId = $cookieService.getCookie("UserId");
			var pargs = {
				UserId: UserId
			};
			$remote.post("AccountList.do", pargs, function (data) {
				$scope.AccList = data.List;
				$scope.Acc = $scope.AccList[0];
			});
		};
		$scope.contactDel = function (index) {
			$scope.ContactsList.splice(index, 1);
		};
		$scope.MobileRechargePre = function () {
			if ($scope.inputType) {
				$scope.ProductID = $scope.concatPhone;
				$scope.contactName = $scope.contactName;
			} else {
				$scope.ProductID = $scope.contact.phone;
				$scope.contactName = $scope.contact.name;
			}
			var UserId = $cookieService.getCookie("UserId");
			var Name = $cookieService.getCookie("Name");
			$scope.confirmData = {
				UserId: UserId,
				PayAccount: $scope.Acc.AcNo,
				PayName: $scope.Acc.AcName,
				ProductID: $scope.ProductID,
				contactName: $scope.contactName,
				AccountType: "A",
				ProductType: "01",
				"Operator": "2",
				"RechargeWay": "0",
				"GameArea": "",
				"GameSrv": "",
				"PayMember": "7289137",
				FaceAmt: $scope.selectProd.prodtDsclrTlstPrc,
				SellPrice: $scope.selectProd.prodtDsclrLowPrc,
				isSaveContact: $scope.isSave ? "1" : "0",
				"OperTyp": "1",
				"PfrmSnbr": "10000000",
				"OrdId": "10000",
				"OrdTotAmt": $scope.selectProd.prodtDsclrTlstPrc,
				"OrdTypcd": "P",
				"TrdeTypcd": "T",
				"PulEntFlg": "F",
				"SumrCd": "S",
				"TrdeSumr": "T",
				OrdSubInfoList: [
					{
						"UsrId": Name,
						"SubOrdId": UserId,
						"OrdAmt": $scope.selectProd.prodtDsclrTlstPrc,
						"Crcycd": "CNY",
						"BrlndFlg": "1",
						"RcvblHndlrtFe": "0",
						"RlincmsHndlrtFe": "0",
						"UsrTypcd": "P",
						"OrdAlrdyRetgdsAmt": "0",
						"OrdDnotRetgdsAmt": "0",
						"PdgRuleSeqnbr": "1",
						"FspltgRuleSeqnbr": "1",
						"SetlRuleSeqnbr": "1"
					}
				]
			};
			$scope.goto("#2");
		};

		$scope.MobileRechargeOrder = function () {

			var pargs = $scope.confirmData;

			$remote.post("OrdInfMnt.do", pargs, function (data) {
				$scope.orderInfo = data;
				$scope.goto("#3");
			});
		};
		$scope.MobileRechargePay = function () {
			var pargs = {
				"TransType": "P", //交易类型
				"PfrmSnbr": $scope.orderInfo.PfrmSnbr, //平台流水号
				"ServCd": "1", //服务代码
				"OrdTypCd": "1", //订单类型代码
				"TrdeAmt": $scope.selectProd.prodtDsclrTlstPrc, //交易金额
				"UsrTypCd": "P", //用户类型代码
				"PymtChnlCd": "APP", //支付渠道代码
				"PresTranstFlg": "1", //现转标志
				"ChrgagnstCtlFlg": "", //冲销控制标志
				"RevrsEracctSnbr": "", //冲正错账流水号
				"ChrgagnstTrdeFlg": "", //冲销交易标志
				"ChrgagnstFlg": "", //冲销标志
				"OrdRspscd": "", //订单响应码
				"OrdRespsInfoDesc": "", //订单响应信息描述
				"LqdBrchCd": "", //清算机构代码
				"SntupBatnbr": "", //上送批次号
				"OrgnSntupBatnbr": "", //原上送批次号
				"ServPntIptMthdCd": "", //服务点输入方式代码
				"CrdSeqnbr": "", //卡序号
				"ServPntCodtCd": "", //服务点条件代码
				"AcptncBrchCd": "", //受理机构代码
				"TrdeAuthrzcd": "", //交易授权码
				"RtrvlRefnbr": "", //检索参考号
				"AdtlRespsDataAsciicd": "", //附加响应数据ASCII码
				"ServPntPinGainCd": "", //服务点PIN获取代码
				"SftyCtlInfoEncd": "", //安全控制信息编码
				"IcCrdReqeDataDmnAsciicd": "", //IC卡请求数据域ASCII码
				"IcCrdAnswrDataDmnAsciicd": "", //IC卡应答数据域ASCII码
				"MsgsTypCd": "", //消息类型代码
				"NtwkMgmtInfoEncd": "", //网络管理信息编码
				"TermReadsSprtFlg": "", //终端读取支持标志
				"IcCrdCodtCd": "", //IC卡条件代码
				"ThrdptyIdfct": "", //第三方标识
				"ThrdptySnbr": "", //第三方流水号
				"LmtamtCtlId": "", //限额控制ID
				"ReqList": [{
					"AcctNbr": $scope.Acc.AcNo, //账号
					"FundTypCd": "1", //资金类型代码
					"CrcyCd": "CNY", //币种代码
					"TrdeAmt": $scope.selectProd.prodtDsclrTlstPrc, //交易金额
					"Bldir": "", //借贷方向
					"FundMatrDt": "", //资金到期日期
					"MerchTypCd": "", //商户类型代码
					"CmdyCatCd": "" //商品类目代码
				}]
			};

			$remote.post("AdvalTpup.do", pargs, function (data) {
				$scope.result = $scope.confirmData;
				$scope.result.FlowNo = ("89012"+new Date().getTime()).substr(0,15);
				$scope.goto("#4");
			});
		};
		$scope.clickFace = function (row) {
			$scope.selectProd = row;
		};

		$scope.saveContact = function () {
			if ($scope.isSave && /\d+/.test($scope.concatPhone) && $scope.concatName) {
				var saveFlag = true;
				for (var i = 0; i < $scope.ContactsList.length; i++) {
					if ($scope.ContactsList[i].phone == $scope.concatPhone) {
						saveFlag = false;
						break;
					}
				}
				if (saveFlag) {
					$scope.ContactsList.push({
						name: $scope.concatName,
						phone: $scope.concatPhone,
						region: "北京联通"
					});
				}

			}

		};
	}]);
