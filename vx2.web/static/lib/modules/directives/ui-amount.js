/**
 *@author yoyo.liu
 * @param {Object} window
 * @param {Object} vx
 * 输入金额 ui-amout
 */
(function(window, vx, undefined) {
    'use strict';

    function toChineseCash(sAmount) {
        var value = toStdAmount(sAmount);
        if (value.indexOf(".") != value.lastIndexOf('.'))
            return '金额输入有误';
        var sCN_Num = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖");
        var unit = new Array('元', '万', '亿', '万');
        var subunit = new Array('拾', '佰', '仟');
        var sCNzero = '零';
        var result = "";
        var iDotIndex = value.indexOf(".");
        var sBeforeDot = value.slice(0, iDotIndex);
        var sAfterDot = value.slice(iDotIndex);
        var len = 0;
        len = sBeforeDot.length;
        var i = 0,
            j = 0,
            k = 0;
        // j is use to subunit,k is use to unit
        var oldC = '3';
        var cc = '0';
        result = unit[0] + result;
        var oldHasN = false;
        var hasN = false;
        var allZero = true;
        for (var i = 0; i < len; i++) {
            if (j == 0 && i != 0) {
                if (!hasN) {
                    if ((k % 2) == 0)
                        result = result.slice(1);
                } else {
                    if (oldC == '0')
                        result = sCNzero + result;
                }
                result = unit[k] + result;
                oldHasN = hasN;
                hasN = false;
            }
            cc = sBeforeDot.charAt(len - i - 1);
            if (oldC == '0' && cc != oldC) {
                if (hasN)
                    result = sCNzero + result;
            }
            if (cc != '0') {
                if (j != 0) {
                    result = subunit[j - 1] + result;
                }
                var dig = '0';
                dig = sCN_Num[cc];

                if (dig == '0') {
                    return false;
                }
                hasN = true;
                allZero = false;
                result = dig + result;
            }
            oldC = cc;
            j++;
            if (j == 4) {
                k++;
                j = 0;
            }
        }
        if (allZero) {
            result = "零元";
        } else {
            var bb = 0;
            if (!hasN) {
                bb++;
                if (!oldHasN) {
                    bb++;
                }
            }
            if (bb != 0) {
                result = result.slice(bb);
            }
            if (result.charAt(0) == '零') {
                result = result.slice(1);
            }
        }

        // after dot
        sAfterDot = sAfterDot.slice(1);
        len = sAfterDot.length;
        var corn = new Array('0', '0');
        var cornunit = new Array('角', '分');
        var n = 0;
        // j is use to subunit,k is use to unit
        var dig = '0';
        corn[0] = sAfterDot.charAt(0);
        if (len > 1) {
            corn[1] = sAfterDot.charAt(1);
        } else {
            corn[1] = '0';
        }
        if ((corn[0] == '0') && (corn[1] == '0')) {
            return result += '整';
        } else {
            if (allZero)
                result = "";
        }
        for (var i = 0; i < 2; i++) {
            var curchar = corn[i];
            dig = sCN_Num[curchar];
            if (i == 0) {
                if (result != "" || curchar != '0') {
                    result += dig;
                }
                if (curchar != '0') {
                    result += cornunit[0];
                }
            }
            if (i == 1 && curchar != '0') {
                result = result + dig + cornunit[1];
            }
        }
        return result;
    }

    /**
     * 返回######.##形式的金额
     * @author wangjian
     * @param  sAmount 传入金额
     * @return sResult 返回######.##形式的金额
     */
    function toStdAmount(sAmount) {
        if (!vx.isDefined(sAmount))
            return;
        var sComma = /\,/gi;
        sAmount = sAmount + "";
        var sResult = sAmount.replace(sComma, "");
        var iDotIndex = sResult.indexOf(".");
        var iLength = sResult.length;
        var toMatchNaNum = /\D/;
        var flag = true;
        if ((iDotIndex != -1 && (iLength - iDotIndex > 3 || toMatchNaNum.test(sResult.slice(0, iDotIndex)))) || toMatchNaNum.test(sResult.slice(iDotIndex + 1, iLength))) {
            flag = false;
            return sResult.substr(0, iDotIndex + 3);
            // 小数点后大于2位数 或 含有非数字字符
        } else {
            // 将金额处理为######.##形式
            if (iDotIndex == -1) {
                sResult = sResult + '.00';
            } else if (iDotIndex === 0) {
                if (iLength - iDotIndex === 1)
                    sResult = '0' + sResult + '00';
                if (iLength - iDotIndex === 2)
                    sResult = '0' + sResult + '0';
                if (iLength - iDotIndex === 3)
                    sResult = '0' + sResult;
            } else {
                if (iLength - iDotIndex === 2)
                    sResult = sResult + '0';
                if (iLength - iDotIndex === 1)
                    sResult = sResult + '00';
            }

            // 处理金额非前面的0
            var sTemp = "";
            sTemp = sResult.slice(0, iDotIndex);
            var iTemp = new Number(sTemp);
            sTemp = iTemp.toString();
            if (sTemp.length > 16) {
                flag = false;
                return 2;
                // 太长的金额
            }
            iDotIndex = sResult.indexOf(".");
            sResult = sTemp + sResult.slice(iDotIndex);
            // 返回######.##形式的金额
            return sResult;
        }
    }

    function toCashWithComma(cash) {
        while (cash.charAt(0) == '0') {
            cash = cash.substr(1);
        };
        if (!isFloat(cash)) {
            return addComma(cash);
        };
        var dotIndex = cash.indexOf(".");
        var integerCash = cash.substring(0, dotIndex);
        var decimalCash = cash.substring(dotIndex);
        return addComma(integerCash) + decimalCash;
    }

    function toCashWithCommaAndDot(cash) {
        if (cash == null || cash == 'null' || cash == '') {
            return '';
        }
        var temp = toCashWithComma(cash);
        if (temp.length == 0) {
            return "0.00";
        }
        var dotPos = temp.indexOf(".");
        if (dotPos < 0) {
            return temp + '.00';
        }
        if (dotPos == 0) {
            temp = '0' + temp;
            dotPos = temp.indexOf(".");
        }
        if (dotPos == temp.length - 2) {
            return temp + '0';
        }
        if (dotPos == temp.length - 1) {
            return temp + '00';
        }
        return temp;
    }

    function isFloat(s) {
        var isFloat = RegExp(/^([0-9]+(\.+))[0-9]+$/);
        return (isFloat.test(s));
    }

    function isMoney(s) {
        var isMoney = RegExp(/^[0-9]{0,15}\.{0,1}[0-9]{0,2}$/);
        return (isMoney.test(s));
    }

    function addComma(str) {
        if (str.length > 3) {
            var mod = str.length % 3;
            var output = (mod > 0 ? (str.substring(0, mod)) : '');
            for (var i = 0; i < Math.floor(str.length / 3); i++) {
                if ((mod == 0) && (i == 0)) {
                    output += str.substring(mod + 3 * i, mod + 3 * i + 3);
                } else {
                    output += ',' + str.substring(mod + 3 * i, mod + 3 * i + 3);
                }
            }
            return (output);
        } else {
            return str;
        }
    }

    /*
     * vLimit
     */
    var directive = {};
    directive.uiLimit = ['$compile',
        function($compile) {
            return {
                restrict: 'CA',
                link: function(scope, element, attrs) {
                    var defaults = {
                        "length": undefined
                    };
                    var params = $.extend({}, defaults, vx.fromJson(attrs.vLimit || {}));
                    scope.$watch(attrs.ngModel, function(u) {});

                    element.bind({
                        'keydown': function(e, value) {
                            if (params.length) {
                                var theEvent = window.event || e;
                                if (($(this).val().toString().length >= params.length)) {
                                    if (theEvent.keyCode != 13 && theEvent.keyCode != 9 && theEvent.keyCode != 8 && theEvent.keyCode != 37 && theEvent.keyCode != 39) {
                                        if (window.event) {
                                            theEvent.keyCode = 0;
                                            theEvent.returnValue = false;
                                            theEvent.preventDefault();
                                        } else {
                                            theEvent.preventDefault();
                                        }
                                    }
                                }
                            }
                        },
                        'keyup': function(e) {
                            if (params.length) {
                                if (($(this).val().toString().length > params.length)) {
                                    $(this).val($(this).val().substr(0, 10));
                                }
                            }
                        }
                    });
                }
            };
        }
    ];
    // Modify chenguojian
    /**
     * EX:
     *        <input type="number" v-model="payAmount" v-amount="ChineseCashPay" />
     *        <span style="color:red;">{{ChineseCashPay}}</span>
     */
    directive.uiAmount = ['$compile',
        function($compile) {
            return {
                restrict: 'CA',
                link: function(scope, element, attrs) {
                    var defaults = {
                        "ChineseCash": "ChineseCash",
                        "maxlength": 11
                    };
                    var params = $.extend({}, defaults, vx.fromJson(attrs.uiAmount || {}));
                    scope.$watch(attrs.ngModel, function(u) {
                        if (isMoney(toStdAmount(u)))
                            scope[params.ChineseCash] = toChineseCash(u);
                        if (vx.isEmpty(u))
                            scope[params.ChineseCash] = "";
                        if (!/\./.test(u) && /,/.test(u))
                            scope[attrs.ngModel] = u.replace(",", "");
                    });
                    //				scope[attrs.vAmount] = "";
                    var flag = false;
                    element.bind({
                        'focus': function() {
                            if (flag) {
                                scope[attrs.ngModel] = undefined;
                            } else {
                                if (scope[attrs.ngModel] == undefined) {
                                    scope[attrs.ngModel + "_amount"] = undefined;
                                }
                                if (scope[attrs.ngModel + "_amount"]) {
                                    scope[attrs.ngModel] = scope[attrs.ngModel + "_amount"];
                                }
                            }
                            scope.$apply(scope);
                        },
                        'blur': function() {
                            if ($(this).val() >= 0) {
                                flag = false;
                                scope[attrs.ngModel + "_amount"] = parseFloat($(this).val());
                                scope[attrs.ngModel] = toCashWithCommaAndDot(toStdAmount($(this).val() + ''));
                                $(this).val(scope[attrs.ngModel].substr(0, scope[attrs.ngModel].indexOf(".") + 3));
                                scope.$apply(scope);
                            } else {
                                flag = true;
                            }
                            //进行回调操作（现无参）
                            if (params.blurCallBack) {
                                eval(params.blurCallBack);
                                scope.$apply(scope);
                            }
                        },
                        'keydown': function(e, value) {
                            var theEvent = window.event || e;
                            if ((theEvent.ctrlKey || theEvent.shiftKey || $(this).val().toString().length == params.maxlength)) {
                                if (theEvent.keyCode != 13 && theEvent.keyCode != 9 && theEvent.keyCode != 8) {
                                    if (window.event) {
                                        code = 0;
                                        theEvent.returnValue = false;
                                    } else {
                                        theEvent.preventDefault();
                                    }
                                }
                            }
                            var code = theEvent.keyCode || theEvent.which;
                            if (code < 48 || (code > 57 && code < 96) || code > 105) {
                                if (code == 229 || code == 110 || code == 37 || code == 39 || code == 46 || code == 8 || code == 180 || code == 190 || code == 9) {
                                    if ((code == 110 || code == 190) && scope[attrs.ngModel].indexOf(".") > 0) {
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
                        },
                        'keyup': function(e) {
                            //						var amount = scope[attrs.ngModel].substr(0,scope[attrs.ngModel].length()-3);
                            //lss
                            //						if($(this).val().toString().length=11){
                            //							scope.$jsonError = [{
                            //								"_exceptionMessage" : "["+attrs.title+"]"+"不能大于11位"
                            //							}];
                            //
                            //							return;
                            //						}
                            var showValue = $(this).val();
                            if (showValue.indexOf(".") >= 0 && showValue.length - showValue.indexOf(".") > 3) {
                                $(this).val(scope[attrs.ngModel].substr(0, scope[attrs.ngModel].indexOf(".") + 3));
                            }
                        }
                    });
                }
            };
        }
    ];

    vx.module('ui.libraries').directive(directive);

})(window, window.vx);
