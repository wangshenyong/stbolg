// native与js交互框架代码（js桥） 开始-------------
(function() {
	if (window.WebViewJavascriptBridge) {
		return

	}
	var messagingIframe;
	var sendMessageQueue = [];
	var receiveMessageQueue = [];
	var messageHandlers = {};

	var CUSTOM_PROTOCOL_SCHEME = 'wvjbscheme';
	var QUEUE_HAS_MESSAGE = '__WVJB_QUEUE_MESSAGE__';

	var responseCallbacks = {};
	var uniqueId = 1;

	function _createQueueReadyIframe(doc) {
		messagingIframe = doc.createElement('iframe');
		messagingIframe.style.display = 'none';
		doc.documentElement.appendChild(messagingIframe);
	}

	function init(messageHandler) {
		if (WebViewJavascriptBridge._messageHandler) {
			throw new Error('WebViewJavascriptBridge.init called twice');
		}
		WebViewJavascriptBridge._messageHandler = messageHandler;
		var receivedMessages = receiveMessageQueue;
		receiveMessageQueue = null;
		for (var i = 0; i < receivedMessages.length; i++) {
			_dispatchMessageFromObjC(receivedMessages[i]);
		}
	}

	function send(data, responseCallback) {
		_doSend({
			data : data
		}, responseCallback);
	}

	function registerHandler(handlerName, handler) {
		messageHandlers[handlerName] = handler;
	}

	function callHandler(handlerName, command, params, responseCallback) {
		callRegistHandler('PluginHandler', handlerName, function(response) {
			if (response == 'true') {
				var data = {
					'Command' : command,
					'Params' : params
				};
				var str = JSON.stringify(data);
				_doSend({
					handlerName : handlerName,
					data : encode(str)
				}, responseCallback);
			}
		});
	}

	function callRegistHandler(handlerName, PluginName, responseCallback) {
		var data = {
			'PluginName' : PluginName
		};
		_doSend({
			handlerName : handlerName,
			data : data
		}, responseCallback);
	}

	function _doSend(message, responseCallback) {
		if (responseCallback) {
			var callbackId = 'cb_' + (uniqueId++) + '_' + new Date().getTime();
			responseCallbacks[callbackId] = responseCallback;
			message['callbackId'] = callbackId;
		}
		sendMessageQueue.push(message);
		messagingIframe.src = CUSTOM_PROTOCOL_SCHEME + '://' + QUEUE_HAS_MESSAGE;
	}

	function _fetchQueue() {
		var messageQueueString = JSON.stringify(sendMessageQueue);
		sendMessageQueue = [];
		if (isIphone()) {
			 return messageQueueString;
	            // android can't read directly the return data, so we can reload
				// iframe src to communicate with java
	     } else if (isAndroid()) {
	    	 messagingIframe.src = CUSTOM_PROTOCOL_SCHEME + '://return/_fetchQueue/' +encode(messageQueueString);
	     	return messageQueueString;
	     }
	}
	function isAndroid() {
        var ua = navigator.userAgent.toLowerCase();
        var isA = ua.indexOf("android") > -1;
        if (isA) {
            return true;
        }
        return false;
    }

    function isIphone() {
        var ua = navigator.userAgent.toLowerCase();
        var isIph = ua.indexOf("iphone") > -1;
        if (isIph) {
            return true;
        }
        return false;
    }
	function _dispatchMessageFromObjC(messageJSON) {
		setTimeout(function _timeoutDispatchMessageFromObjC() {
			var message = JSON.parse(messageJSON);
			var messageHandler;

			if (message.responseId) {
				var responseCallback = responseCallbacks[message.responseId];
				if (!responseCallback) {
					return;
				}
				responseCallback(message.responseData);
				delete responseCallbacks[message.responseId];
			} else {
				var responseCallback;
				if (message.callbackId) {
					var callbackResponseId = message.callbackId;
					responseCallback = function(responseData) {
						// 返回给客户端的数据进行base64编码
						var data = encode(responseData);
						_doSend({
							responseId : callbackResponseId,
							responseData : data
						});
					}
				}

				var handler = WebViewJavascriptBridge._messageHandler;
				if (message.handlerName) {
					handler = messageHandlers[message.handlerName];
				}

				try {
					handler(message.data, responseCallback);
				} catch (exception) {
					if ( typeof console != 'undefined') {
						console.log("WebViewJavascriptBridge: WARNING: javascript handler threw.", message, exception);
					}
				}
			}
		});
	}

	function _handleMessageFromObjC(messageJSON) {
		if (receiveMessageQueue) {
			receiveMessageQueue.push(messageJSON);
		} else {
			_dispatchMessageFromObjC(messageJSON);
		}
	}


	window.WebViewJavascriptBridge = {
		init : init,
		send : send,
		registerHandler : registerHandler,
		callHandler : callHandler,
		_fetchQueue : _fetchQueue,
		_handleMessageFromObjC : _handleMessageFromObjC
	};

	var doc = document;
	_createQueueReadyIframe(doc);
	var readyEvent = doc.createEvent('Events');
	readyEvent.initEvent('WebViewJavascriptBridgeReady');
	readyEvent.bridge = WebViewJavascriptBridge;
	doc.dispatchEvent(readyEvent);

	// 报文加密
	function encode(data) {
		// return data
		return BASE64.encoder(data);
	}

	// 报文解密
	function decode(data) {
		return BASE64.decoder(data);
	}

	// base64 开始---------------------
	/**
	 * create by 2012-08-25 pm 17:48
	 *
	 * @author hexinglun@gmail.com BASE64 Encode and Decode By UTF-8 unicode
	 *         可以和java的BASE64编码和解码互相转化
	 */
	var BASE64_MAPPING = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '/'];

	/**
	 * ascii convert to binary
	 */
	var _toBinary = function(ascii) {
		var binary = new Array();
		while (ascii > 0) {
			var b = ascii % 2;
			ascii = Math.floor(ascii / 2);
			binary.push(b);
		}
		/*
		 * var len = binary.length; if(6-len > 0){ for(var i = 6-len ; i > 0 ;
		 * --i){ binary.push(0); } }
		 */
		binary.reverse();
		return binary;
	};

	/**
	 * binary convert to decimal
	 */
	var _toDecimal = function(binary) {
		var dec = 0;
		var p = 0;
		for (var i = binary.length - 1; i >= 0; --i) {
			var b = binary[i];
			if (b == 1) {
				dec += Math.pow(2, p);
			}++p;
		}
		return dec;
	};

	/**
	 * unicode convert to utf-8
	 */
	var _toUTF8Binary = function(c, binaryArray) {
		var mustLen = (8 - (c + 1)) + ((c - 1) * 6);
		var fatLen = binaryArray.length;
		var diff = mustLen - fatLen;
		while (--diff >= 0) {
			binaryArray.unshift(0);
		}
		var binary = [];
		var _c = c;
		while (--_c >= 0) {
			binary.push(1);
		}
		binary.push(0);
		var i = 0, len = 8 - (c + 1);
		for (; i < len; ++i) {
			binary.push(binaryArray[i]);
		}

		for (var j = 0; j < c - 1; ++j) {
			binary.push(1);
			binary.push(0);
			var sum = 6;
			while (--sum >= 0) {
				binary.push(binaryArray[i++]);
			}
		}
		return binary;
	};

	var __BASE64 = {
		/**
		 * BASE64 Encode
		 */
		encoder : function(str) {
			var base64_Index = [];
			var binaryArray = [];
			for (var i = 0, len = str.length; i < len; ++i) {
				var unicode = str.charCodeAt(i);
				var _tmpBinary = _toBinary(unicode);
				if (unicode < 0x80) {
					var _tmpdiff = 8 - _tmpBinary.length;
					while (--_tmpdiff >= 0) {
						_tmpBinary.unshift(0);
					}
					binaryArray = binaryArray.concat(_tmpBinary);
				} else if (unicode >= 0x80 && unicode <= 0x7FF) {
					binaryArray = binaryArray.concat(_toUTF8Binary(2, _tmpBinary));
				} else if (unicode >= 0x800 && unicode <= 0xFFFF) {// UTF-8
					// 3byte
					binaryArray = binaryArray.concat(_toUTF8Binary(3, _tmpBinary));
				} else if (unicode >= 0x10000 && unicode <= 0x1FFFFF) {// UTF-8
					// 4byte
					binaryArray = binaryArray.concat(_toUTF8Binary(4, _tmpBinary));
				} else if (unicode >= 0x200000 && unicode <= 0x3FFFFFF) {// UTF-8
					// 5byte
					binaryArray = binaryArray.concat(_toUTF8Binary(5, _tmpBinary));
				} else if (unicode >= 4000000 && unicode <= 0x7FFFFFFF) {// UTF-8
					// 6byte
					binaryArray = binaryArray.concat(_toUTF8Binary(6, _tmpBinary));
				}
			}

			var extra_Zero_Count = 0;
			for (var i = 0, len = binaryArray.length; i < len; i += 6) {
				var diff = (i + 6) - len;
				if (diff == 2) {
					extra_Zero_Count = 2;
				} else if (diff == 4) {
					extra_Zero_Count = 4;
				}
				// if(extra_Zero_Count > 0){
				// len += extra_Zero_Count+1;
				// }
				var _tmpExtra_Zero_Count = extra_Zero_Count;
				while (--_tmpExtra_Zero_Count >= 0) {
					binaryArray.push(0);
				}
				base64_Index.push(_toDecimal(binaryArray.slice(i, i + 6)));
			}

			var base64 = '';
			for (var i = 0, len = base64_Index.length; i < len; ++i) {
				base64 += BASE64_MAPPING[base64_Index[i]];
			}

			for (var i = 0, len = extra_Zero_Count / 2; i < len; ++i) {
				base64 += '=';
			}
			return base64;
		},
		/**
		 * BASE64 Decode for UTF-8
		 */
		decoder : function(_base64Str) {
			var _len = _base64Str.length;
			var extra_Zero_Count = 0;
			/**
			 * 计算在进行BASE64编码的时候，补了几个0
			 */
			if (_base64Str.charAt(_len - 1) == '=') {
				// alert(_base64Str.charAt(_len-1));
				// alert(_base64Str.charAt(_len-2));
				if (_base64Str.charAt(_len - 2) == '=') {// 两个等号说明补了4个0
					extra_Zero_Count = 4;
					_base64Str = _base64Str.substring(0, _len - 2);
				} else {// 一个等号说明补了2个0
					extra_Zero_Count = 2;
					_base64Str = _base64Str.substring(0, _len - 1);
				}
			}

			var binaryArray = [];
			for (var i = 0, len = _base64Str.length; i < len; ++i) {
				var c = _base64Str.charAt(i);
				for (var j = 0, size = BASE64_MAPPING.length; j < size; ++j) {
					if (c == BASE64_MAPPING[j]) {
						var _tmp = _toBinary(j);
						/* 不足6位的补0 */
						var _tmpLen = _tmp.length;
						if (6 - _tmpLen > 0) {
							for (var k = 6 - _tmpLen; k > 0; --k) {
								_tmp.unshift(0);
							}
						}
						binaryArray = binaryArray.concat(_tmp);
						break;
					}
				}
			}

			if (extra_Zero_Count > 0) {
				binaryArray = binaryArray.slice(0, binaryArray.length - extra_Zero_Count);
			}

			var unicode = [];
			var unicodeBinary = [];
			for (var i = 0, len = binaryArray.length; i < len; ) {
				if (binaryArray[i] == 0) {
					unicode = unicode.concat(_toDecimal(binaryArray.slice(i, i + 8)));
					i += 8;
				} else {
					var sum = 0;
					while (i < len) {
						if (binaryArray[i] == 1) {++sum;
						} else {
							break;
						}++i;
					}
					unicodeBinary = unicodeBinary.concat(binaryArray.slice(i + 1, i + 8 - sum));
					i += 8 - sum;
					while (sum > 1) {
						unicodeBinary = unicodeBinary.concat(binaryArray.slice(i + 2, i + 8));
						i += 8; --sum;
					}
					unicode = unicode.concat(_toDecimal(unicodeBinary));
					unicodeBinary = [];
				}
			}
			return unicode;
		}
	};

	window.BASE64 = __BASE64;
	// base64 结束-------------
})();
// native与js交互框架代码（js桥） 结束-------------加密

// 页面事件交互代码 开始----------
var jsBridge;
(function connectWebViewJavascriptBridge(callback) {
	if (window.WebViewJavascriptBridge) {
		callback(WebViewJavascriptBridge);
	} else {
		document.addEventListener('WebViewJavascriptBridgeReady', function() {
			callback(WebViewJavascriptBridge);
		}, false);
	}
})(function(bridge) {
	window.jsBridge = bridge;
	bridge.init(function(message, responseCallback) {
		responseCallback(data);
	});
});
// 页面事件交互代码 结束----------