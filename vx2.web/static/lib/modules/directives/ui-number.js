/*jshint smarttabs:true, eqeqeq:false, eqnull:true, laxbreak:true*/
/**
 * @author wbr
 * input只能输入数字
 * <input ui-number='{"intLength":25,"float":false,"dotLength":1,"addZero":false}'/>
 * @param intLength:整数位长度 默认25
 * 		  float:是否可以是小数 默认false
 * 		  dotLength:小数位长度 默认1
 * 		  addZero:是否自动补零 默认false
 */
(function(window, vx, undefined) {'use strict';

	function checkKey(code, dot) {
		var aaa = {
			"isAllow" : false,
			"checkSpe" : checkSpe
		};

		function checkSpe(code, dot) {
			//				    回车 tab 退格 左  右
			var specialAllowKey = [13, 9, 8, 37, 39];
			if (dot) {
				//			  小键盘小数点  大键盘小数点
				specialAllowKey.push(110, 190);
			}
			var allow = false;
			for (var i = 0; i < specialAllowKey.length; i++) {
				if (code == specialAllowKey[i]) {
					allow = true;
					break;
				}
			}
			if (allow) {
				return true;
			} else {
				return false;
			}
		};
		if (code) {
			//			大键盘数字							小键盘数字
			if ((code >= 48 && code <= 57) || (code >= 96 && code <= 105) || checkSpe(code, dot)) {
				aaa.isAllow = true;
			} else {
				aaa.isAllow = false;
			}
		}
		return aaa;
	}

	var defaults = {
		"intLength" : 25,
		"float" : false,
		"dotLength" : 1,
		"addZero" : false
	};
	var directive = {};
	directive.uiNumber = [
	function() {
		return {
			restrict : 'A',
			link : function(scope, element, attrs) {
				var params = $.extend({}, defaults, vx.fromJson(attrs.uiNumber || {}));
				params.intLength = parseInt(params.intLength, 10);
				params.dotLength = parseInt(params.dotLength, 10);
				element.bind({
					'keydown' : function(e) {
						var theEvent = window.event || e, code = theEvent.keyCode || theEvent.which, len = params.intLength;
						var valueStr = $(this).val().toString();
						var dotIndex = valueStr.indexOf('.');
						if (params.float) {
							len = params.intLength + params.dotLength + 1;
						}
						if (valueStr.length >= len) {
							if (!checkKey().checkSpe(code, false)) {
								// theEvent.keyCode = 0;
								if (theEvent.preventDefault) {
									theEvent.preventDefault();
								} else {// ie
									theEvent.returnValue = false;
								}
							}
						} else {
							//可以是小数
							if (params.float) {
								//已经输入过小数点
								if (dotIndex > 0) {
									if (!checkKey(code, false).isAllow) {
										// theEvent.keyCode = 0;
										if (theEvent.preventDefault) {
											theEvent.preventDefault();
										} else {// ie
											theEvent.returnValue = false;
										}
									}
								}
								//未输入过小数点
								else {
									if (valueStr.length >= params.intLength) {
										if (!checkKey().checkSpe(code, true)) {
											// theEvent.keyCode = 0;
											if (theEvent.preventDefault) {
												theEvent.preventDefault();
											} else {// ie
												theEvent.returnValue = false;
											}
										}
									} else {
										if (!checkKey(code, true).isAllow) {
											// theEvent.keyCode = 0;
											if (theEvent.preventDefault) {
												theEvent.preventDefault();
											} else {// ie
												theEvent.returnValue = false;
											}
										}
									}
								}
							}
							//只能是整数
							else {
								if (!checkKey(code, false).isAllow) {
									// theEvent.keyCode = 0;
									if (theEvent.preventDefault) {
										theEvent.preventDefault();
									} else {// ie
										theEvent.returnValue = false;
									}
								}
							}
						}
					},
					'keyup' : function(e) {
						var len = params.intLength;
						var valueStr = $(this).val().toString();
						var dotIndex = valueStr.indexOf('.');
						if (params.float) {
							len = params.intLength + params.dotLength + 1;
						}
						if (dotIndex > 0) {
							element.attr("maxlength", dotIndex + params.dotLength + 1);
							var dotStr = valueStr.substr(dotIndex + 1);
							if (dotStr.length > params.dotLength) {
								dotStr = dotStr.substr(0, params.dotLength);
								valueStr = valueStr.substring(0, dotIndex + 1) + dotStr;
								$(this).val(valueStr);
							}
						} else {
							element.attr("maxlength", '');
						}
						if (valueStr.length > len) {
							$(this).val(valueStr.substr(0, len));
						}
					},
					'blur' : function(e) {
						if (params.float && params.addZero) {
							var len = params.intLength, zeroLen = params.dotLength;
							var valueStr = $(this).val().toString();
							var dotIndex = valueStr.indexOf('.');
							var zeroStr = function(l) {
								var zs = "";
								for (var i = 0; i < l; i++) {
									zs += "0";
								}
								return zs;
							};
							if (dotIndex < 0) {
								if (vx.isEmpty(valueStr)) {
									$(this).val("0." + zeroStr(zeroLen));
								} else {
									$(this).val(valueStr + "." + zeroStr(zeroLen));
								}
							} else if (dotIndex === 0) {
								$(this).val("0" + valueStr + zeroStr(zeroLen));
							} else {
								var dotStrLen = valueStr.substr(dotIndex + 1).length;
								zeroLen = params.dotLength - dotStrLen;
								$(this).val(valueStr + zeroStr(zeroLen));
							}
						}
					}
				});
			}
		};
	}];

	vx.module('ui.libraries').directive(directive);

})(window, window.vx);
(function(window, vx, undefined) {'use strict';
/**
 * 用户输入的限制
 * @author soda-lu
 * ui-num
 *
 */
vx.module('ui.libraries').directive('uiNum', ["$timeout", "$compile",
function($timeout, $compile) {
	return {
		restrict : 'CA',
		link : function(scope, element, attrs) {
			var defaults = {
				"maxlength" : "12",
				"hasDot" : true
			};
			var params = $.extend({}, defaults, vx.fromJson(attrs.uiNum || {}));
			element.bind({
				'blur' : function(e) {
					if ($(this).val() >= 0 && $(this).val() !== '') {
					} else {
						//输入非数字不清空
						scope[attrs.vModel] = undefined;
						$(this).val("");
						scope.$apply(scope);
					}
				},
				'paste' : function(e) {
					return false;
				},
				'keydown' : function(e, value) {
					// keydown start
					var theEvent = window.event || e;
					// 当整数位数达到maxlength-3时判断下一位是否为.,如果不是“.”则禁止输入
					if ((theEvent.ctrlKey || theEvent.shiftKey || $(this).val().toString().length == (Math.abs(params.maxlength) - 3))) {
						if (theEvent.keyCode != 13 && theEvent.keyCode != 9 && theEvent.keyCode != 8 && theEvent.keyCode !== 190) {
							//element.attr("maxlength",Math.abs(params.maxlength) - 3);
							if (window.event) {
								code = 0;
								theEvent.returnValue = false;
							} else {
								theEvent.preventDefault();
							}
						}
					}
					//释放tab back enter键 与"."
					if ((theEvent.ctrlKey || theEvent.shiftKey || $(this).val().toString().length == Math.abs(params.maxlength))) {
						if (theEvent.keyCode != 13 && theEvent.keyCode != 9 && theEvent.keyCode != 8) {
							//element.attr("maxlength",Math.abs(params.maxlength));
							// 没有小数位达到限制位数
							if (window.event) {
								code = 0;
								theEvent.returnValue = false;
							} else {
								theEvent.preventDefault();
							}
						}
					}
					// hasDot start 
					var code = theEvent.keyCode || theEvent.which;
					// 不能输入汉字
					/*if(code == 229){
						if (window.event) {
							code = 0;
							theEvent.returnValue = false;
						} else {
							theEvent.preventDefault();
						}
					}*/
					if (params.hasDot) {
						//如首位是0,其后必跟"."
						if ($(this).val() == '0' && (code != 190 && code !== 13 && code != 9 && code != 8)) {
							if (window.event) {
								code = 0;
								theEvent.returnValue = false;
							} else {
								theEvent.preventDefault();
							}
						}
						//禁止"."在首位
						if ($(this).val() === '' && code === 190) {
							if (window.event) {
								code = 0;
								theEvent.returnValue = false;
							} else {
								theEvent.preventDefault();
							}
						}
						//"."后仅保留两位有效数字
						if ($(this).val()!=="" && $(this).val()!==undefined && $(this).val()!==null) {
							var str = $(this).val() + "";
							var xiaoshudian = str.indexOf(".");
							var valueLength = str.length;
							if (valueLength >= 4 && (xiaoshudian == (valueLength - 3)) && (code != 190 && code !== 13 && code != 9 && code != 8)) {
								if (window.event) {
									code = 0;
									theEvent.returnValue = false;
								} else {
									theEvent.preventDefault();
								}
							}
							//禁止数字外的其他键
							if (code < 48 || (code > 57 && code < 96) || code > 105) {
								if (code == 229 || code == 110 || code == 37 || code == 39 || code == 46 || code == 8 || code == 180 || code == 190 || code == 9) {
									if ((code == 110 || code == 190) && $(this).val().toString().indexOf('.') > 0) {
										if (window.event) {
											code = 0;
											theEvent.returnValue = false;
										} else {
											theEvent.preventDefault();
										}
									}
								} else {
									if (window.event) {
										code = 0;
										theEvent.returnValue = false;
									} else {
										theEvent.preventDefault();
									}
								}
							}
							//END 禁止数字外的其他键
						}
					} else {
						//禁止数字外的其他键 299汉字
						if (code < 48 || (code > 57 && code < 96) || code > 105) {
							if (code == 229 || code == 110 || code == 37 || code == 39 || code == 46 || code == 8 || code == 180 || code == 190 || code == 9) {
								if ((code == 110 || code == 190)) {
									if (window.event) {
										code = 0;
										theEvent.returnValue = false;
									} else {
										theEvent.preventDefault();
									}
								}
							} else {
								if (window.event) {
									code = 0;
									theEvent.returnValue = false;
								} else {
									theEvent.preventDefault();
								}
							}
						}
						//END 禁止数字外的其他键
					}
					// hasDot end
					// keydown end
				}
			});
		}
	};
}]);

})(window, window.vx, window.$);
