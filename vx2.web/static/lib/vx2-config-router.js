/*jshint smarttabs:true, eqeqeq:false, eqnull:true, laxbreak:true*/
(function(window, vx, undefined) {'use strict';
	var ibsapp = vx.module("ibsapp");
	/**
	 * 路由配置
	 * App Module
	 */
	ibsapp.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$controllerProvider', "$compileProvider", "$filterProvider", "$provide",
	function($stateProvider, $urlRouterProvider, $locationProvider, $controllerProvider, $compileProvider, $filterProvider, $provide) {

		ibsapp.controller = $controllerProvider.register;
		ibsapp.directive = $compileProvider.directive;
		ibsapp.filter = $filterProvider.register;
		ibsapp.factory = $provide.factory;
		ibsapp.service = $provide.service;
		ibsapp.constant = $provide.constant;
		ibsapp.value = $provide.value;

		//是否使用全局controller
		$controllerProvider.allowGlobals();
		// H5模式configure html5 to get links working on jsfiddle
		//$locationProvider.html5Mode(true);

		/******路由配置开始******/
		$stateProvider
		//登录页入口
		// .state('loginapp', {
		// 	abstract : true,
		// 	url : '/loginapp',
		// 	templateUrl : 'htmls/LoginView.html'
		// })
		.state('loginblog', {
			abstract : true,
			url : '/loginblog',
			templateUrl : 'htmls/loginBlog.html'
		})
		//博客登录页
		.state('loginblog.userLogin', {
			url : '/loginblog',
			templateUrl : 'htmls/loginBlog/loginUserBlog.html'
		})
		//登录页
		.state('loginapp.UserLogin', {
			url : '/UserLogin',
			templateUrl : 'htmls/UserLogin/UserLogin.html'
		})

		//用户注册
		.state('loginapp.UserRegister', {
			url : '/UserRegister',
			templateUrl : 'htmls/UserRegister/UserRegister.html',
		})
		/***************登录页配置介绍，主页配置开始**********************/
		.state('app1', {
			abstract : true,
			url : '/app',
			templateUrl : 'htmls/App1.html'
		})
		.state('app', {
			abstract : true,
			url : '/app',
			templateUrl : 'htmls/AppView.html'
		})
		.state('gestes', {
			abstract : true,
			url : '/gestes',
			templateUrl: 'htmls/gestes.html',
		})
		//游客访问body页
		.state('gestes.gestesBody', {
			url : '/gestesBody',
			templateUrl: 'htmls/gestesBody/gestesBody.html',
		})
		// //游客访问的具体内容展示页
		// .state('gestes.gestesContent', {
		// 	url : '/gestesContent',
		// 	templateUrl: 'htmls/gestesContent/gestesContent.html',
		// })
		//欢迎页
		.state('app.Welcome', {
			url : '/Welcome',
			templateUrl : 'htmls/Welcome/Welcome.html',
		})
		//手机充值
		.state('app.MobileRecharge', {
			url : '/MobileRecharge',
			templateUrl : 'htmls/MobileRecharge/MobileRecharge.html',
		})
		//bankinnertransfer
		.state('app.BankInnerTransfer',{
			url:'/BankInnerTransfer',
			templateUrl:'htmls/BankInnerTransfer/BankInnerTransfer.html'
		})
		//账号明细列表查询
		.state('app.AccountDetailListQry', {
			url : '/AccountDetailListQry',
			templateUrl : 'htmls/AccountDetailListQry/AccountDetailListQry.html',
		})
		//账号明细详情
		.state('app.AccountDetail', {
			url : '/AccountDetail',
			templateUrl : 'htmls/AccountDetail/AccountDetail.html',
		})
		//手机充值订单查询
		.state('app.MobileRechargeOrdQry', {
			// 设置了url参数:FlowNo
			url : '/MobileRechargeOrdQry',
			templateUrl : 'htmls/MobileRechargeOrdQry/MobileRechargeOrdQry.html',
		})
		//余额查询
		.state('app.BalanceQry', {
			url : '/BalanceQry',
			templateUrl : 'htmls/BalanceQry/BalanceQry.html',
		})
		//文件上传FileUpload
		.state('app.FileUpload', {
			url : '/FileUpload',
			templateUrl : 'htmls/FileUpload/FileUpload.html',
		})
		//文件下载
		.state('app.FileDownload', {
			url : '/FileDownload',
			templateUrl : 'htmls/FileDownload/CustomerListDetailQry.html',
		})

		//账号绑定
		.state('app.AccountBind', {
			url : '/AccountBind',
			templateUrl : 'htmls/AccountBind/AccountBind.html',
		})
		.state('views', {
			url : '/views',
			templateUrl : 'htmls/views/view.html'
		})
		.state('demo', {
			url : '/demo',
			templateUrl : 'htmls/views/demo.html'
		})
		/******路由配置结束******/

		//默认装置路由
		$urlRouterProvider.otherwise(function($injector) {
			var $state = $injector.get("$state");
			$state.go("loginblog.userLogin");
		});
		// $routeProvider.otherwise({
		// redirectTo : "/UserLogin"
		// });

	}]);

})(window, vx);

