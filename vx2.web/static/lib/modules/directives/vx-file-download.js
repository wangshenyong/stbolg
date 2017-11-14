(function(window, vx, undefined) {
	var module = vx.module('ui.libraries');

	module.factory('$FileDownloader', ['$rootScope', '$http', '$window', '$compile', '$remote',
		function($rootScope, $http, $window, $compile, $remote) {
			function $FileDownloader(options) {
				vx.extend(this, options);
			}
			$FileDownloader.prototype.isHTML5 = !!($window.File && $window.FormData);
			$FileDownloader.prototype.isFile = function(value) {
				var fn = $window.File;
				return(fn && value instanceof fn);
			};
			$FileDownloader.prototype._iframeTransportDown = function(item, successFn, errorFn) {
				var form = vx.element('<form style="display: none;" />');
				var iframe = vx.element('#iframeTransport_DownLoadId');
				if(iframe.length === 0) {
					iframe = vx.element('<iframe name="iframeTransport_DownLoad" id="iframeTransport_DownLoadId">');
				} else {
					iframe[0].contentDocument.body.innerHTML = "";
				}
				var that = this;
				// remove old form

				vx.forEach(item, function(value, key) {
					var element = vx.element('<input type="hidden" name="' + key + '" />');
					element.val(value);
					form.append(element);
				});

				form.prop({
					action: item.url,
					method: 'POST',
					target: iframe.prop('name'),
					enctype: 'multipart/form-data',
					encoding: 'multipart/form-data' // old IE
				});

				iframe.bind('load', function() {
					try {
						var html = iframe[0].contentDocument.body.innerHTML;
					} catch(e) {}

					var xhr = {
						response: html,
						status: 200,
						dummy: true
					};
					var headers = {};
					var response = that._transformResponse(xhr.response, headers);
					//console.info("downLoad request reveive:" + item.url + "with data:" + xhr.response);
					if(xhr.status >= 200 && xhr.status < 300) {
						successFn && successFn(response, xhr.status, headers);
					} else {
						errorFn && errorFn(response, xhr.status, headers);
					}
				});

				form.abort = function() {
					var xhr = {
						status: 0,
						dummy: true
					};
					var headers = {};
					var response;

					iframe.unbind('load').prop('src', 'javascript:false;');
				};

				vx.element("body").after(form);
				form.append(iframe);

				form[0].submit();
				this._render();
			};
			$FileDownloader.prototype.download = function(action, params, successFn, errorFn) {
				params.url = $window.TRSCONTEXT + action;
				//console.info("downLoad request send:" + params.url + "with params:" + vx.toJson(params));
				$FileDownloader.prototype._iframeTransportDown(params, successFn, errorFn);
			};
			$FileDownloader.prototype._transformResponse = function(response, headers) {
				var headersGetter = this._headersGetter(headers);
				vx.forEach($http.defaults.transformResponse, function(transformFn) {
					response = transformFn(response, headersGetter);
				});
				return response;
			};
			$FileDownloader.prototype._headersGetter = function(parsedHeaders) {
				return function(name) {
					if(name) {
						return parsedHeaders[name.toLowerCase()] || null;
					}
					return parsedHeaders;
				};
			};
			$FileDownloader.prototype._render = function() {
				if(!$rootScope.$$phase)
					$rootScope.$apply();
			};
			$FileDownloader.isFile = $FileDownloader.prototype.isFile;

			$FileDownloader.isHTML5 = $FileDownloader.prototype.isHTML5;

			return $FileDownloader;
		}
	]);

})(window, window.vx);