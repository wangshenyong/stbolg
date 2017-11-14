(function(){
	/*
	 * 调用客户端插件
	 * jsBridge.callHandler(pluginName, methodName, data, responseCallback);
	 * 注册js插件
	 * jsBridge.registerHandler(pluginName, methodName, data, responseCallback);
	 */

	var callnative = {};
	/**CPAlert    信息提示框插件*/
	//以dialog的形式弹出提示信息，一个按键。
	callnative.ShowHintMsgAlert = function(data,responseCallback){
		//比较ShowHintMsgCustomAlert/ShowHintMsgDefaultAlert
		jsBridge.callHandler('CPAlert','ShowHintMsgCustomAlert',data,responseCallback);
	};
	//以dialog的形式弹出提示信息，两个按键。
	callnative.ShowHintMsgConfirm = function(data,responseCallback){
		//比较ShowHintMsgCustomConfirm/ShowHintMsgDefaultConfirm
		jsBridge.callHandler('CPAlert','ShowHintMsgCustomConfirm',data,responseCallback);
	};
	//以Toast的形式弹出提示信息
	callnative.ShowHintMsgToast = function(data,responseCallback){
		jsBridge.callHandler('CPAlert','ShowHintMsgToast',data,responseCallback);
	};
	/**CPDevice	   设备信息插件*/
	//获取设备信息(包括：应用版本名/设备平台/设备唯一标示/设备型号/设备系统版本)
	callnative.DeviceInfo = function(responseCallback){
		jsBridge.callHandler('CPDevice','DeviceInfo','',responseCallback);
	};
	//设备网络信息2g/3g/4g/wifi
	callnative.NetworkMsg = function(responseCallback){
		jsBridge.callHandler('CPDevice','NetworkMsg','',responseCallback);
	};
	//设备网络状态
	callnative.NetworkStatus = function(responseCallback){
		jsBridge.callHandler('CPDevice','NetworkStatus','',responseCallback);
	};
	
	
	/**CPMask    遮罩层插件*/
	//隐藏遮罩层
	callnative.HideMask = function(responseCallback){
		jsBridge.callHandler('CPMask','HideMask','',responseCallback);
	};
	//显示遮罩层
	callnative.ShowMask = function(responseCallback){
		jsBridge.callHandler('CPMask','ShowMask','',responseCallback);
	};
	/**CPContacts   通讯录插件*/
	//调用系统通讯录页面，选择联系人信息并返回
	callnative.SearchBySystem = function(responseCallback){
		jsBridge.callHandler('CPContacts','SearchBySystem','',responseCallback);
	};
	/**CPApp   应用插件*/
	//回退
	callnative.GoBack = function(responseCallback){
		jsBridge.callHandler('CPApp','GoBack','',responseCallback);
	};
	//关闭当前页面
	callnative.Exit = function(responseCallback){
		jsBridge.callHandler('CPApp','Exit','',responseCallback);
	};
	//加载新的html页面
	callnative.LoadUrl = function(url,responseCallback){
		jsBridge.callHandler('CPApp', 'LoadUrl', url, responseCallback);
	}
	/**CPWidget   控件插件*/
	//datepicker 日期选择器
	callnative.DatePicker = function(date,responseCallback){
		jsBridge.callHandler('CPWidget','DatePicker',date,responseCallback);
	};
	/**CPAction   action插件*/
	//调用action插件   调用原生页面
	callnative.StartNativeAction = function(className,params,responseCallback){
		var data = {
			'ClassName':className,
			'Data':params
		};
		jsBridge.callHandler('CPAction', 'StartNativeAction', data, responseCallback);
	};
	//利用原生页面显示html   webActivity
	callnative.StartWebAction = function(className,params,title,url,responseCallback){
		var data = {
				'ClassName':className,
				'Data':params,
				'Url':url,
				'Title':title
		};
		jsBridge.callHandler('CPAction', 'StartNativeAction', data, responseCallback);
	};
	/** CPLog客户端打印日志*/
	callnative.Debug = function(message,responseCallback){
		jsBridge.callHandler('CPLog', 'Debug', message, responseCallback);
	}
	/** CPImage图片插件 */
	//获取图片  
	callnative.CaptureImage = function(responseCallback){
		jsBridge.callHandler('CPImage', 'CaptureImage', '', responseCallback);
	}
	//获取圆形图片
	callnative.CaptureRoundImage = function(responseCallback){
		jsBridge.callHandler('CPImage', 'CaptureRoundImage', '', responseCallback);
	}
	
	//调用插件  统一方式
	callnative.CallHandler = function(pluginName,methodName,data,responseCallback){
		jsBridge.callHandler(pluginName, methodName, data, responseCallback);
	};

	/*
	 * 注册js插件   统一方式
	 * 举例：CALLNATIVE.RegisterHandler('TabMain', function(data, responseCallback) {
	 * 		responseCallback('回调信息！');
		});
	 * */ 
	callnative.RegisterHandler = function(HandlerName,Callback){
		jsBridge.registerHandler(HandlerName,Callback);
	}
	//调用原生方法的对象
	window.CALLNATIVE = callnative;
	
}())