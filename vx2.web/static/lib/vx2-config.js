/* App Module */
vx.module('ui.libraries', []);//自定义组件模块（指令、服务、过滤器）
vx.module("ui.bootstrap", ["ui.bootstrap.transition", "ui.bootstrap.collapse", "ui.bootstrap.accordion", "ui.bootstrap.alert", "ui.bootstrap.bindHtml", "ui.bootstrap.buttons", "ui.bootstrap.carousel", "ui.bootstrap.dateparser", "ui.bootstrap.position", "ui.bootstrap.datepicker", "ui.bootstrap.dropdown", "ui.bootstrap.modal", "ui.bootstrap.pagination", "ui.bootstrap.tooltip", "ui.bootstrap.popover", "ui.bootstrap.progressbar", "ui.bootstrap.rating", "ui.bootstrap.tabs", "ui.bootstrap.timepicker", "ui.bootstrap.typeahead"]);//bootstrap组件模块

var ibsapp = vx.module('ibsapp', [
	'ui.router',
	'vx.lazyLoad',
	'vStorage',
	'vviewport.vpage',
	//'ngAnimate',	//动画
	//'ngSanitize',//净化html 运用在v-bind-html
	//'mapp.actionsheet',
	'ui.libraries',
	'ui.bootstrap'
]);
/**
 * Example Source Code 配置
 */
(function (window, vx, $) {
	'use strict';

	// this block is module config, if you want do some module management, please use vx-plugins.js
	// and manage module by following methods:
	// **  module.provider(...) / module.factory(...) / module.service(...) / module.value(...) / module.constant(...)
	// ** module.filter(...)
	// ** module.directive(...)
	// ** module.controller(...)

	// ### Configuration Entry
	var mod = vx.module('ibsapp');

	/************************************************
	 * config service factory function
	 ************************************************/
	//Log
	configLog.$inject = ['$logProvider'];
	function configLog($logProvider) {
		/**
		 * set log level
		 */
		$logProvider.debugEnabled(true);
	}

	// Browser
	configBrowser.$inject = ['$browserProvider'];
	function configBrowser($browserProvider) {

		/**
		 * if E2ETest (end to end test), you should disable browser.debounce function
		 * so setE2ETest(true), debounce used to combind events handle for performance
		 *  default is false
		 */
		// $browserProvider.setE2ETest(false);
		/**
		 * config Low version of the browser returns no refresh,setting iframe history href initial value.
		 * default file name by blank.html
		 */
		// $browserProvider.setBlankPage("empty.html");
	}

	// Remote
	configRemote.$inject = ['$remoteProvider'];
	function configRemote($remoteProvider) {
		/**
		 * 如果返回报文含有setErrorTag里的字段，那么进入setErrorCallback的方法，没有该字段则不会进入setErrorCallback方法
		 * $remote will use this name for scope, for example, scope.$error will get error object, default is '$error'
		 * and you can push function ,for example.
		 * function(data){
		 * 	if(data.data&&data.data.jsonError){
		 * 		return true;
		 * 	}else{
		 * 		return false;
		 * 	}
		 * }
		 */
		//$remoteProvider.setErrorTag("jsonError");
		$remoteProvider.setErrorTag(function (data) {
			//console.debug('filter data with setErrorTag');
			if (data.jsonError) {
				return true;
			} else if (data._RejCode && !/^0+$/.test(data._RejCode)) {
				return true;
			}
		});
		/**
		 * $remote will use this name for service context
		 */
		$remoteProvider.setTrsContext("/local/");
		/**
		 *请求回调
		 */
		$remoteProvider.setSendBeforeFn(function () {
			$('#load_back_drop.httpBackend-backdrop').show();
			//NativeCall.showMask();
		});
		$remoteProvider.setSendAfterFn(function () {
			$('#load_back_drop.httpBackend-backdrop').hide();
			//NativeCall.hideMask();
		});
		/**
		 *请求参数配置
		 */
		$remoteProvider.config = {
			headers: {
				'Content-Type': 'application/json'
			}, //字符串Map，代表HTTP头
			timeout: 30000, //请求超时毫秒数
			//params : 'BankId=9999&LoginType=P&_locale=zh_CN',//字符串或对象Map，用于附加在url的?后，以key1=value1&key2=value2形式体现，如果是对象将变成JSON串.
			//cache : false,//如果true，$http将使用内部cache，缓存所有的GET请求，也可直接传入$cacheFactory产生的Cache对象。
			//urlSuffix:'?BankId=9999&LoginType=P&_locale=zh_CN',//请求后缀如"/mobile/GoodsList.do?BankId=9999&LoginType=M"
			toKeyValue: false //请求数据格式是否为seqId=12&usertype=02
		}
		/**
		 * $remote will use this callback analysis error, for examples
		 *  1.  status not in [200, 300), return 'http error'
		 *  2.  application data include jsonError property will means application error
		 *
		 * NOTE: application should provide this callback
		 */
		$remoteProvider.setErrorCallback(function (data, status, headers, config) {

			// if error return error object, otherwise return null
			var $S = config.$scope, httpRequest = config.url;

			// 写项目上的统一错误控制
			var currentScope = vx.element("div[v-view]>*").scope() || vx.element("body").scope();
			if (data && data.jsonError) {
				//NativeCall.alertView(data.jsonError[0]['_exceptionMessage']);
				currentScope.jsonError = data.jsonError;
			} else {
				currentScope.jsonError = [{
					"_exceptionMessage": "网络异常:" + status
				}];
			}
			if (status == -1) {
				console.error('请求超时!');
			} else {
				if (data._RejCode != "000000") {
					if (data._RejCode == "777777") { //session timeout
						currentScope.goto('/loginapp/UserLogin');
					} else {
						currentScope.$AlertValidate({
							title: "服务器异常",
							content: data._exceptionMessage
						});
					}

				}
			}

		});
	}

	// Http
	configHttp.$inject = ['$httpProvider'];
	function configHttp($httpProvider) {
		//放开注释，进行加密
		//$httpProvider.defaults.headers.common = {'Content-Type': 'application/cryptojson'};

		// var keyHex = CryptoJS.enc.Utf8.parse('csii1234');
		fnReq.$inject = ['$q'];
		function fnReq($q) {
			var interceptor = {
				'request': function (config) {
					// console.log(config);
					// if (config.method == "POST") {
					// 	config.data = vx.extend(config.data || {}, {
					// 		"_locale" : "zh_CN",
					// 		"BankId" : "9999",
					// 		"DeviceType" : "PC",
					// 		"LoginType" : "R"
					// 	});
					//
					// 	if (!config.data.ChannelId) {
					// 		config.data.ChannelId = "web";
					// 	}
					// 	if ($httpProvider.defaults.headers.common['Content-Type'] == 'application/cryptojson') {
					// 		//DES加密
					// 		config.data = CryptoJS.DES.encrypt(vx.toJson(config.data), keyHex, {
					// 			mode : CryptoJS.mode.ECB,
					// 			padding : CryptoJS.pad.Pkcs7
					// 		}).ciphertext.toString(CryptoJS.enc.Base64);
					// 		//DES加密 结束
					// 	}
					// }
					return config;
				},
				'response': function (resp) {
					//DES解密
					// if (resp.config.method == "POST" && resp.config.headers['Content-Type'] == 'application/cryptojson') {
					// 	var decrypt = CryptoJS.DES.decrypt({
					// 		ciphertext : CryptoJS.enc.Base64.parse(resp.data)
					// 	}, keyHex, {
					// 		mode : CryptoJS.mode.ECB,
					// 		padding : CryptoJS.pad.Pkcs7
					// 	});
					// 	resp.data = vx.fromJson(decrypt.toString(CryptoJS.enc.Utf8));
					// }
					//DES解密 结束
					return resp;
					//$q.reject(resp);
				},
				'requestError': function (rejection) {
					return $q.reject(rejection);
				},
				'responseError': function (rejection) {
					return rejection
				}
			}
			return interceptor;
		}


		$httpProvider.interceptors.push(fnReq);
		// $httpProvider.defaults.transformResponse = function transformResponse(response) {
		//  // console.log(response);
		//   //make a copy since the response must be cacheable
		//   var resp = vx.extend({}, response);
		//   if (!response.data) {
		//     console.log(true);
		//     resp.data = response.data;
		//   } else {
		//     console.log(false);
		//     resp.data = vx.transformData(response.data, response.headers, response.status, config.transformResponse);
		//   }
		//   console.log(response.status);
		//   // return (isSuccess(response.status))
		//   //   ? resp
		//   //   : $q.reject(resp);
		// }

		/**
		 * config $http service if use inner cache(not HTTP cache), if use inner cache
		 * all same url GET will just submit server only once
		 * default is false
		 */
		// $httpProvider.useCache(false);
		/**
		 * config $http if use json request type, if not, use form encoding, for examples
		 *  abc=a&aaa=23
		 *  defautl is true
		 */
		// $httpProvider.useJsonRequest(true);

		/**
		 * config $http service defaults, you could:
		 * 1. $httpProvicer.defautls.transformResponse(array) override default json convert or add your function
		 * 2. $httpProvicer.defautls.transformRequest(array) override default json convert or add your function
		 * 3. $httpProvicer.defautls.headers define default HTTP Headers, default is
		 * {
		 *   common : {
		 *     'Accept' : 'application/json, text/plain, *\/*'
		 *   },
		 *   post : {
		 *     'Content-Type' : 'application/json;charset=utf-8'
		 *   },
		 *   put : {
		 *     'Content-Type' : 'application/json;charset=utf-8'
		 *   },
		 *   xsrfCookieName : 'XSRF-TOKEN',
		 *   xsrfHeaderName : 'X-XSRF-TOKEN'
		 * }
		 */
		// $httpProvider.defaults
		/**
		 * config $http service response interceptors, default is empty array
		 *  you could use  $httpProvider.responseInterceptors.push(fn(promise)) for add interceptor
		 *  promise is $q.defer.promise object, use then(success(...), error(...)) for register callback
		 */
		// $httpProvider.responseInterceptors
	}

	// HttpBackend
	configHttpBackend.$inject = ['$httpBackendProvider'];
	function configHttpBackend($httpBackendProvider) {

		/**
		 * config $httpBackend use client communication or ajax
		 */
		//$httpBackendProvider.setClientMode(true);

	}


	configSubmit.$inject = ['$submitConfigProvider'];
	function configSubmit($submitConfigProvider) {
		$submitConfigProvider.setSubmitCompileProcess(function (scope) {
			delete scope.jsonError;
			//currentScope.$apply();
		});
		$submitConfigProvider.setSubmitBeforeProcess(function (scope) {
			//var currentScope=vx.element("div[v-view]:first-child").scope();
			delete scope.jsonError;
		});
		$submitConfigProvider.setSubmitErrProcess(function (ctrlComment, errMessage, scope, ctrl) {
			alert(ctrlComment + errMessage);
			$(ctrl).stop().animate({
				left: "-10px"
			}, 100).animate({
				left: "10px"
			}, 100).animate({
				left: "-10px"
			}, 100).animate({
				left: "10px"
			}, 100).animate({
				left: "0px"
			}, 100);
			scope.jsonError = [{
				"_exceptionMessage": ctrlComment + errMessage
			}];
			
			scope.$apply();
		});
	}

	/**
	 *设置setNextScope是否使用本地缓存sessionStore
	 */
	configContext.$inject = ['$contextConfigProvider'];
	function configContext($contextConfigProvider) {
		$contextConfigProvider.setSessionStorageEnable(true);
	}


	mod.config(configLog);
	mod.config(configBrowser);
	mod.config(configRemote);
	mod.config(configHttp);
	mod.config(configHttpBackend);
	mod.config(configSubmit);
	mod.config(configContext);

	/**
	 * 运行配置
	 * runRootScope
	 */
	runRootScope.$inject = ['$rootScope', '$window', '$timeout', '$locale', '$state', '$stateParams', '$location', '$cookieService', '$filter', '$remote', '$targets', '$modal'];
	function runRootScope($rootScope, $window, $timeout, $locale, $state, $stateParams, $location, $cookieService, $filter, $remote, $targets, $modal) {
		//将服务$nativeCall中的接口默认注入$rootScope，避免controller注入$nativeCall
		//vx.extend($rootScope, $nativeCall);
		//设置交易服务根地址
		$rootScope.$TrsContext = $window.TRSCONTEXT;
		//设置客户端开发模式
		$rootScope.$ClientMode = $window.CLIENTMODE;
		//将上下文服务绑定到$rootScope,用于跨页面传递对象
		//$rootScope.$context = $context;
		//统一路由操作，避免controller注入'$routeParams'、'$location'
		$rootScope.$state = $state;
		//统一路由参数获取
		$rootScope.getRouteParams = function (param) {
			//return $routeParams[param];
			return $stateParams[param];
		};
		//服务器图片绝对路径"http://192.12.35.177:80"王赓武，http://192.111.7.84:80测试环境
		//$rootScope.$serverURL="http://192.111.7.84:80";
		//测试环境服务器路径，发送GenTokenImg交易使用
		//$rootScope.$serverPath="http://192.111.7.92:9080";
		//统一页面跳转1、页面使用<a v-click="goto('/TeamDetail/'+activity.id)">
		//2、controller使用$scope.goto('/TeamDetail/'+var);
		$rootScope.goto = function (url, params, viewportName) {
			if (!url) {
				return;
			}
			if (/[\.]/.test(url)) {
				if ($state.current.name != url) {
					$state.go(url, params);
				} else {
					$state.reload();
				}
			} else if (/^[\/]/.test(url)) {
				window.location.hash = url;
			} else if (/^[#]/.test(url)) {
				$targets(viewportName || "content", url);
			} else if (/\.html/.test(url)) {
				window.location = url;
			}
		};
		$rootScope.$AlertValidate = function (modalMsg) {
			if (!$rootScope.$AlertValidate.isOpen) {
				$rootScope.$AlertValidate.isOpen = true;
				var modalInstance = $modal.open({
					templateUrl: 'htmls/Common/Validate.html',
					controller: ['$scope', '$modalInstance',
						function ($scope, $modalInstance) {
							$scope.modalMsg = modalMsg;
							$scope.ok = function () {
								$modalInstance.close();
								$rootScope.$AlertValidate.isOpen = false;
							};
						}]

				});

			}
		};
		//修改跳转地址栏
		$rootScope.gotoLocation = function (url) {
			window.location = url;
		};

		//回退
		$rootScope.goback = function (param) {
			window.history.back(param || -1);
		};

		//取国际化数据
		$rootScope.$field = function (name) {
			return $locale.FIELDS[name] || name;
		};
		$rootScope.$msg = function (name) {
			return $locale.MESSAGES[name] || name;
		};
		//错误展示
		$rootScope.showError = function (errorMessage, currentScope) {
			if (currentScope) {
				currentScope.$apply(function () {
					currentScope.jsonError = [{
						"_exceptionMessage": errorMessage
					}];
				});
			} else {
				var currentScope = vx.element("div[v-view]>*").scope() || vx.element("body").scope();
				currentScope.jsonError = [{
					"_exceptionMessage": errorMessage
				}];
			}
		};
		$rootScope.showOk = function (successMessage, currentScope) {
			if (currentScope) {
				currentScope.$apply(function () {
					currentScope.jsonError = [{
						"type": "success",
						"_exceptionMessage": successMessage
					}];
				});
			} else {
				var currentScope = vx.element("div[v-view]>*").scope() || vx.element("body").scope();
				currentScope.jsonError = [{
					"type": "success",
					"_exceptionMessage": successMessage
				}];
			}
		};

		//格式化错误信息
		$rootScope.FmtError = function (errorMessage) {
			return [{
				"_exceptionMessage": errorMessage
			}];
		};
		//清理错误信息
		$rootScope.cleanError = function (currentScope) {
			if (currentScope) {
				delete currentScope.jsonError;
			} else {
				var currentScope = vx.element("div[v-view]>*").scope() || vx.element("body").scope();
				delete currentScope.jsonError;
			}
		};
		//设置不需要交易的表单元素
		$rootScope.setValidation = function (el, value) {
			vx.element(el).attr("validate", value);
		};

		$rootScope.$on('$pageContentLoaded', function (event, params, pageUrl) {
			if (/Conf\.html/.test(pageUrl)) {
				$remote.post("GenToken.do", {}, function (data) {
					$rootScope._tokenName = data._tokenName;
				});
			}
		});
		$rootScope.$on('$remoteError', function (event, url, data) {
			if (data && data.jsonError) {
				if (data.jsonError[0]._exceptionMessageCode == "role.invalid_user") {
					if (confirm(data.jsonError[0]._exceptionMessage + ",确定要重新登录吗？")) {
						$rootScope.goto("loginapp.UserLogin");
					}
				}
			}
		});

		/**
		 * @param {Object} param 输入时间间隔，符号-/+表示时间在前/在后
		 */
		$rootScope.getDate = function (param) {
			//获取当前时间
			var nowTime = new Date();
			$rootScope.$now = $filter("date")(nowTime, "yyyy-MM-dd");
			if (vx.isNumber(param)) {
				nowTime.setDate(nowTime.getDate() + param);
				return $filter("date")(nowTime, "yyyy-MM-dd")
			}
		};

		//统一的文件提交网络
		//监听地址栏
		$rootScope.$on('$stateChangeStart', function (event, to, pargs, from) {
			console.log(from.url + '--->' + to.url);
			// if (/^app\./.test(to.name)) { //app.xxxx state
			// 	var UserId = $cookieService.getCookie("UserId");
			// 	if (!UserId) {
			// 		event.preventDefault();
			// 		location.href = "index.html#/loginapp/UserLogin";
			// 	}
			// }
		});

	}

	//启用
	ibsapp.run(runRootScope);
})(window, window.vx, window.jQuery);
