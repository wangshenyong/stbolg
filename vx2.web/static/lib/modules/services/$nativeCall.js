/*
 * $nativeCall
 * @author yoyo.liu
 * @param {Object} window
 * @param {Object} vx
 * 与客户端交互服务
 *  jsBridge.callHandler('CPAlert', 'ShowHintMsgCustomConfirm', data, responseCallback);
 *  第一个参数:插件类名 第二个参数:插件方法名 第三个参数:传参 第四个参数:插件回调
 */
(function(window, vx, undefined) {
	'use strict';
	var mod = vx.module("ui.libraries");
	/**
	 * call native fn os
	 * @author liuyoucai Interact with native application services
	 */
	mod.factory('$nativeCall', ['$os', '$log', '$rootScope','$location','$timeout','$targets',
		function($os, $log, $rootScope,$location,$timeout,$targets) {
			/*
			 * 调用客户端插件 jsBridge.callHandler(pluginName, methodName, data,
			 * responseCallback); 注册js插件
			 * jsBridge.registerHandler(pluginName, methodName, data,
			 * responseCallback);
			 */
			var callnative = {
				history : [],
				pages : [],
				isHideBackButton : false,
				viewPort : 'content',
				num:0
			};
			// 判断
			callnative.isLogin = function(responseCallback) {
				// 比较ShowHintMsgCustomAlert/ShowHintMsgDefaultAlert
				if(window.CLIENTMODE){
					jsBridge.callHandler('CPLogin', 'isLogin', '', responseCallback);
				}else{

				}

			};
			/** CPAlert 信息提示框插件 */
				// 以dialog的形式弹出提示信息，一个按键。
			callnative.Alert = function(data, responseCallback) {
				// 比较ShowHintMsgCustomAlert/ShowHintMsgDefaultAlert
				if(window.CLIENTMODE){
					jsBridge.callHandler('CPAlert', 'ShowHintMsgCustomAlert', data, responseCallback);
				}else{
					alert(data);
					if(responseCallback){
						responseCallback();
					}
				}

			};
			// 以dialog的形式弹出提示信息，两个按键。
			callnative.Confirm = function(data, responseCallback) {
				// 比较ShowHintMsgCustomConfirm/ShowHintMsgDefaultConfirm
				jsBridge.callHandler('CPAlert', 'ShowHintMsgCustomConfirm', data, responseCallback);
			};
			// 以Toast的形式弹出提示信息
			callnative.Toast = function(data, responseCallback) {
				jsBridge.callHandler('CPAlert', 'ShowHintMsgToast', data, responseCallback);
			};
			/** CPDevice 设备信息插件 */
				// 获取设备信息(包括：应用版本名/设备平台/设备唯一标示/设备型号/设备系统版本)
			callnative.DeviceInfo = function(responseCallback) {
				jsBridge.callHandler('CPDevice', 'DeviceInfo', '', responseCallback);
			};
			// 设备网络信息2g/3g/4g/wifi
			callnative.NetworkMsg = function(responseCallback) {
				jsBridge.callHandler('CPDevice', 'NetworkMsg', '', responseCallback);
			};
			// 设备网络状态
			callnative.NetworkStatus = function(responseCallback) {
				jsBridge.callHandler('CPDevice', 'NetworkStatus', '', responseCallback);
			};
			// NFC扫描银行卡
			callnative.NFCScanBankCard = function(data,responseCallback) {
				jsBridge.callHandler('CPNFC', 'ScanBankCard', data, responseCallback);
			};
			// NFC扫描银行卡
			callnative.ScanTouchId = function(data,responseCallback) {
				jsBridge.callHandler('CPTouchID', 'touchPassWord', data, responseCallback);
			};
			/** CPMask 遮罩层插件 */
				// 隐藏遮罩层
			callnative.HideMask = function(responseCallback) {
				jsBridge.callHandler('CPMask', 'HideMask', '', responseCallback);
			};
			// 显示遮罩层
			callnative.ShowMask = function(responseCallback) {
				jsBridge.callHandler('CPMask', 'ShowMask', '', responseCallback);
			};
			/** CPContacts 通讯录插件 */
				// 调用系统通讯录页面，选择联系人信息并返回
			callnative.SearchBySystem = function(responseCallback) {
				jsBridge.callHandler('CPContacts', 'SearchBySystem', '', responseCallback);
			};
			/** CPContacts 扫卡插件 */
			callnative.scanCard = function(responseCallback) {
				jsBridge.callHandler('CPInterface', 'scanCard', '', responseCallback);
			};
			/** CPApp 应用插件 浏览器返回方法 */
				// 回退
			callnative.GoBack = function(responseCallback) {
				if(window.CLIENTMODE){
					jsBridge.callHandler('CPApp', 'GoBack', '', responseCallback);
				}else{
					if (callnative.pages.length > 0) {
						var targets = callnative.pages.pop();
						$rootScope.$apply(function(){
							$location.path(targets).replace();
						});
						// $rootScope.$apply(function(){
						// 	$targets("content", targets);
						// });


					} else {

					}
					// else if ( typeof callnative.history[callnative.history.length - 1] !== 'function') {
					// 	var vLength = callnative.history.length;
					// 	var vLast = callnative.history[vLength - 1];
					// 	var vPenult = callnative.history[vLength - 2];
					// 	$targets(callnative.viewPort, "#" + ((vPenult - vLast)>0?"+"+(vPenult - vLast):(vPenult - vLast)));

					// } else if ( typeof callnative.history[callnative.history.length - 1] === 'function') {// 回调函数
					// 	var callback = callnative.history.pop();
					// 	callback();

					// }
				}

			};
			// 关闭当前页面
			callnative.Exit = function(responseCallback) {
				jsBridge.callHandler('CPApp', 'Exit', '', responseCallback);
			};
			// 加载新的html页面
			callnative.LoadUrl = function(url, responseCallback) {
				jsBridge.callHandler('CPApp', 'LoadUrl', url, responseCallback);
			};
			// 加载第三方的html页面
			callnative.LoadHTML = function(url, responseCallback) {
				jsBridge.callHandler('CPInterface', 'gotoMarketing', url, responseCallback);
			};
			/** CPWidget 控件插件 */
				// datepicker 日期选择器
			$rootScope.dateNum=0;
			callnative.DatePicker = function(date, responseCallback) {
				$rootScope.dateNum++;
				if($rootScope.dateNum==1){
					$timeout(function(){
						jsBridge.callHandler('CPWidget', 'DatePicker', date, responseCallback);
					},150)
				}
				clearTimeout(ss);
				var ss=setTimeout(function(){
					$rootScope.dateNum=0;
					$rootScope.$apply();
				},500)

			};
			/** CPAction action插件 */
				// 调用action插件 调用原生页面
			callnative.StartNativeAction = function(className, params, responseCallback) {
				var data = {
					'ClassName' : className,
					'Data' : params
				};
				jsBridge.callHandler('CPAction', 'StartNativeAction', data, responseCallback);
			};
			// 利用原生页面显示html webActivity
			callnative.StartWebAction = function(className, params, title, url, productId, responseCallback) {
				var data = {
					'ClassName' : className,
					'Data' : params,
					'Url' : url,
					'Title' : title,
					'Id' : productId
				};
				jsBridge.callHandler('CPAction', 'StartNativeAction', data, responseCallback);
			};
			/** CPLog客户端打印日志 */
			callnative.Debug = function(message, responseCallback) {
				jsBridge.callHandler('CPLog', 'Debug', message, responseCallback);
			};
			/** CPImage图片插件 */
				// 获取图片路径，显示方式   img.src = 'file://'+data;
			callnative.CaptureImage = function(responseCallback) {
				jsBridge.callHandler('CPImage', 'CapturePhoto', '', responseCallback);
			};
			// 获取裁剪图片路径，显示方式   img.src = 'file://'+data;
			callnative.CaptureRoundImage = function(responseCallback) {
				jsBridge.callHandler('CPImage', 'CapturePhotoCrop', '', responseCallback);
			};
			/** CPVxHelper插件 */
				// 功能：获取actionId
			callnative.GetActionId = function(responseCallback) {
				jsBridge.callHandler('CPVxHelper', 'GetActionId', '', responseCallback);
			};
			/** CPNetwork 通讯插件 */
				// 功能：post请求,勿擅自修改
			callnative.sendRequest = function(url, params, requestCallback) {
				var data = {
					'Url' : url,
					'Params' : params
				};
				jsBridge.callHandler('CPNetwork', 'RequestPostForString', data, function(response) {
					if(!$rootScope.$$phase){
						$rootScope.$apply(function(){
							requestCallback(response);
						})
					}else{
						requestCallback(response);
					}


				});
			};
			// 功能：get请求,勿擅自修改
			callnative.sendRequestGet = function(url, params, responseCallback) {
				var data = {
					'Url' : url,
					'Params' : params
				};
				jsBridge.callHandler('CPNetwork', 'RequestGetForString', data, responseCallback);
			};
			// 功能：图片下载 返回值base64
			callnative.RequestImageForDownload = function(url, params, responseCallback) {
				var data = {
					'Url' : url,
					'Params' : params
				};
				jsBridge.callHandler('CPNetwork', 'RequestImageForDownload', data, responseCallback);
			};
			/** CPUIRefresh ui刷新插件 */
				// 功能：隐藏标题栏返回键
			callnative.HideBackButton = function(responseCallback) {
				jsBridge.callHandler('CPUIRefresh', 'HideBackButton', '', responseCallback);
			};
			// 功能：显示标题栏返回键
			callnative.ShowBackButton = function(responseCallback) {
				jsBridge.callHandler('CPUIRefresh', 'ShowBackButton', '', responseCallback);
			};
			// 功能：设置title
			callnative.SetTitle = function(title, responseCallback) {
				jsBridge.callHandler('CPUIRefresh', 'SetTitle', title, responseCallback);
			};

			// 调用插件 统一方式
			callnative.CallHandler = function(pluginName, methodName, data, responseCallback) {
				jsBridge.callHandler(pluginName, methodName, data, responseCallback);
			};

			/*
			 * 注册js插件 统一方式 举例：CALLNATIVE.RegisterHandler('TabMain',
			 * function(data, responseCallback) { responseCallback('回调信息！');
			 * });
			 */
			callnative.RegisterHandler = function(HandlerName, Callback) {
				jsBridge.registerHandler(HandlerName, Callback);
			};
			// VX自身调用
			callnative.LoadTransfer = function(viewport, url) {
				$rootScope.$apply(function(){
					//this.pages.push(url);
					// $targets(viewport, url);
					$location.path(url);
				});
			};
			// set the native app back of button show or hide
			callnative.SetBackButtonVisibility = function(flag) {
				// flag为true,隐藏按钮
				if (flag) {
					if (!this.isHideBackButton) {
						this.isHideBackButton = true;
						this.HideBackButton();
					}
				} else if (this.isHideBackButton) {
					this.ShowBackButton();
					this.isHideBackButton = false;
				} else if (flag === undefined) {
					if (this.history.length <= 1 && this.pages.length <= 0) {
						this.HideBackButton();
					} else {
						this.ShowBackButton();
					}
				}
			};
			// native app call html app goback fn
			// 客户端返回插件
			callnative.RegisterHandler('VXBack', function(data, responseCallback) {
				if ($targets.$viewBack('content')) { //no has vpage history
					var routeStack = $rootScope.$routesStack;
					routeStack.pop();//pop current routeUrl
					if (routeStack.length ==0) {
						responseCallback("true");
					} else {
						$rootScope.$backFlag=true;
						window.history.back(-1);
						responseCallback("false");
					}
				}

			});
			/**
			 * 回退原理:
			 * 1．记录历史：跳转路由和碎片的过程中记录路由历史和碎片历史
			 * 2．使用历史记录数组，回退前一碎片或者路由，回退的过程不记录历史
			 * 3. 存在vpage碎片，先回退碎片历史,不存在则回退路由历史,不存在路由历史关闭当前窗口
			 */
			/**
			 * 监听状态发生变化记录路由历史
			 * @type {Array}
			 */
			$rootScope.$on("$stateChangeStart", function (event,toState, toParams,fromState,fromParams) {
				$rootScope.$routesStack = $rootScope.$routesStack || [];
				if(!$rootScope.$backFlag){ //回退的过程不记录历史
					$rootScope.$routesStack.push(toState.url);
					console.log($rootScope.$routesStack);
				}
				$rootScope.$backFlag = false;

				//清理交易标题$TradeTitle
				delete $rootScope.$TradeTitle;
			});
			/**
			 * 模拟原声回退方法(与VXBack里面的方法基本一样,少了一个回调设置关闭webview标志调用)
			 */
			$rootScope.$goback=function () {
				if ($targets.$viewBack('content')) { //no has vpage history
					var routeStack = $rootScope.$routesStack;
					routeStack.pop();//pop current routeUrl
					if (routeStack.length ==0) {
						console.log("true");
					} else {
						$rootScope.$backFlag=true;
						window.history.back(-1);
						console.log("false");
					}
				}
			};
			/**
			 * 监听碎片页面加载，添加上面的标题
			 */
			$rootScope.$on("$pageContentLoaded", function () {
				var title = arguments[4];
				if(title){
					if(window.CLIENTMODE){
						callnative.SetTitle(title);
					}else{
						$rootScope.$TradeTitle = title;
					}
				}
			});
			$rootScope.$on("$vLazyLoadLoaded",function(event,element,attr){
				var title = attr.title;
				if(title){
					if(window.CLIENTMODE){
						callnative.SetTitle(title);
					}else{
						$rootScope.$TradeTitle = title;
					}
				}
			});
			//完成当前交易，回到上一个路由或者是关闭当前webview(用于交易的结果页面返回调用)
			$rootScope.finishWeb = function () {
				var routeStack = $rootScope.$routesStack;
				routeStack.pop();//pop current routeUrl
				if (routeStack.length == 0) {
					console.log("true:last route!");
					//退出当前webview
					if(window.CLIENTMODE){
						callnative.Exit();
					}
				} else {
					$rootScope.$backFlag = true;
					window.history.back(-1);
					console.log("false:center route");
				}
			};

			window.NativeCall = callnative;
			return callnative;

		}]);

	
})(window, vx);
