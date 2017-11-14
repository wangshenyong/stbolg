(function(window, vx, undefined) {'use strict';
	var mod = vx.module("ui.libraries");
	mod.service("$domainServer", ['$rootScope', '$log',
	function($rootScope, $log) {		
		return function(action,item, successFn, errorFn) {
				var form = vx.element('<form style="display: none;" />');
				//var iframe = vx.element('#iframeTransport_DownLoadId');
				// if (iframe.length === 0) {
					// //iframe = vx.element('<iframe name="iframeTransport_DownLoad" id="iframeTransport_DownLoadId">');
				// } else {
					// if(iframe[0].contentDocument){						
						// //iframe[0].contentDocument.body = "";
						// //iframe[0]="";
					// }else{
						// //iframe[0]="";
					// }
				// }
				//var that = this;
				// remove old form

				vx.forEach(item, function(value, key) {
					var element = vx.element('<input type="hidden" name="' + key + '" />');
					element.val(value);
					form.append(element);
				});

				form.prop({
					action : action,
					method : 'POST',
					target : '_blank',//iframe.prop('name'),
					//enctype : 'multipart/form-data',
					//encoding : 'multipart/form-data' // old IE
				});

				// iframe.bind('load', function() {
					// try {
						// Fix for legacy IE browsers that loads internal error page
						// when failed WS response received. In consequence iframe
						// content access denied error is thrown becouse trying to
						// access cross domain page. When such thing occurs notifying
						// with empty response object. See more info at:
						// http://stackoverflow.com/questions/151362/access-is-denied-error-on-accessing-iframe-document-object
						// Note that if non standard 4xx or 5xx error code returned
						// from WS then response content can be accessed without error
						// but 'XHR' status becomes 200. In order to avoid confusion
						// returning response via same 'success' event handler.

						// fixed vx.contents() for iframes
						// var html = iframe[0].contentDocument.body.innerHTML;
					// } catch (e) {
					// }
// 
					// var xhr = {
						// response : html,
						// status : 200,
						// dummy : true
					// };
					// var headers = {};
					// var response = xhr.response;
					// console.info("domain request reveive:" + item.url + "with data:" + xhr.response);
					// if (xhr.status >= 200 && xhr.status < 300) {
						// successFn && successFn(response, xhr.status, headers);
					// } else {
						// errorFn && errorFn(response, xhr.status, headers);
					// }
				// });

				// form.abort = function() {
					// var xhr = {
						// status : 0,
						// dummy : true
					// };
					// var headers = {};
					// var response;
// 
					// //iframe.unbind('load').prop('src', 'javascript:false;');
// 
				// };

				vx.element("body").after(form);
				//form.append(iframe);

				form[0].submit();
				//this._render();
			}

	}]);

})(window, vx);