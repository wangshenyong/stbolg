/**
 * @author wbr
 * 日期相关工具
 * */
(function(window, vx, undefined) {
    'use strict';
    var service = {};
    service.$dateUtil = ['$filter',
        function($filter) {
            return {

                /**
                 * 要返回的提示信息
                 */
                flagStr: '',

                /**
                 * 判断是否日期格式
                 * @author wangjian
                 * @param  dateStart [description]
                 * @param  dateEnd   [description]
                 */
                isDateString: function(dateStart, dateEnd) {

                    if (arguments.length == 1) {
                        return isDateStr(arguments[0]);
                    } else if (arguments.length == 2) {
                        var date1 = isDateStr(arguments[0]);
                        var date2 = isDateStr(arguments[1]);
                        return (date1 && date2);
                    } else {
                        return false;
                    }

                    // 判断一个字符串是否为合法的日期格式：YYYY-MM-DD HH:MM:SS
                    //或 YYYY-MM-DD
                    function isDateStr(ds) {
                        var parts = ds.split(' ');
                        switch (parts.length) {
                            case 2:
                                if (isDatePart(parts[0]) === true && isTimePart(parts[1])) {
                                    return true;
                                } else {
                                    return false;
                                }
                                break;
                            case 1:
                                var aPart = parts[0];
                                if (aPart.indexOf(':') > 0) {
                                    return isTimePart(aPart);
                                } else {
                                    return isDatePart(aPart);
                                }
                                break;
                            default:
                                return false;
                        }
                    }

                    //判断一个字符串是否为合法的日期格式：YYYY-MM-DD
                    function isDatePart(dateStr) {
                        var parts;
                        if (dateStr.indexOf("-") > -1) {
                            parts = dateStr.split('-');
                        } else if (dateStr.indexOf("/") > -1) {
                            parts = dateStr.split('/');
                        } else {
                            return false;
                        }
                        if (parts.length < 3) {
                            //日期部分不允许缺少年、月、日中的任何一项
                            return false;
                        }
                        for (var i = 0; i < 3; i++) {
                            //如果构成日期的某个部分不是数字，则返回false
                            if (isNaN(parts[i])) {
                                return false;
                            }
                        }
                        var y, m, d;
                        y = parts[0];
                        //年
                        m = parts[1];
                        //月
                        d = parts[2];
                        //日
                        //限定年月日的范围
                        if (y > 3000) {
                            return false;
                        }
                        if (m < 1 || m > 12) {
                            return false;
                        }
                        if (d < 1 || d > 31) {
                            return false;
                        }
                        switch (d) {
                            case 29:
                                if (m == 2) {
                                    //如果是2月份
                                    if ((y / 100) * 100 == y && (y / 400) * 400 != y) {
                                        //如果年份能被100整除但不能被400整除 (即闰年)
                                    } else {
                                        return false;
                                    }
                                }
                                break;
                            case 30:
                                if (m == 2) {
                                    //2月没有30日
                                    return false;
                                }
                                break;
                            case 31:
                                if (m == 2 || m == 4 || m == 6 || m == 9 || m == 11) {
                                    //2、4、6、9、11月没有31日
                                    return false;
                                }
                                break;
                            default:
                                return true;
                        }
                        return true;
                    }

                    // isDatePart(dateStr)结束

                    function isTimePart(timeStr) {
                        var parts;
                        parts = timeStr.split(':');
                        if (parts.length < 2) {
                            //日期部分不允许缺少小时、分钟中的任何一项
                            return false;
                        }
                        for (var i = 0; i < parts.length; i++) {
                            //如果构成时间的某个部分不是数字，则返回false
                            if (isNaN(parts[i])) {
                                return false;
                            }
                        }
                        var h, m, s;
                        h = parts[0];
                        //小时
                        m = parts[1];
                        //分钟
                        if (h < 0 || h > 23) {
                            //限制小时的范围
                            return false;
                        }
                        if (m < 0 || h > 59) {
                            //限制分钟的范围
                            return false;
                        }
                        if (parts.length > 2) {
                            s = parts[2];
                            //日
                            if (s < 0 || s > 59) {
                                //限制秒的范围
                                return false;
                            }
                        }
                        return true;
                    }

                    //isDatePart(dateStr)结束

                },
                /**
                 * 判断日期区间是否合法
                 * @author wangjian
                 * @param  {[type]}  startDate [起始时间]
                 * @param  {[type]}  endDate   [结束时间]
                 * @param  {[type]}  interval  [月份限制，两个日期超过这个限制则返回false]
                 * @return {Boolean}           [结果]
                 */
                isCorrectDateInterval: function(startDate, endDate, interval) {
                    //这里传递的是字符串

                    if (arguments.length == 3) {

                        if (startDate === undefined) {
                            this.flagStr = "开始日期不能为空!";
                            return false;
                        } else if (endDate === undefined) {
                            this.flagStr = "结束日期不能为空!";
                            return false;
                        }
                        var intervalMonth = 3;
                        var intervalYear = 1;
                        if (interval !== undefined) {
                            try {
                                intervalMonth = Number(interval);
                                if (isNaN(intervalMonth)) {
                                    this.flagStr = "间隔日期不能解析!";
                                    return false;
                                }
                                if (intervalMonth <= 0 || intervalMonth > 12) {
                                    this.flagStr = "超出间隔日期的范围！";
                                    return false;
                                }
                            } catch (err) {
                                this.flagStr = "间隔日期不能解析";
                                return false;
                            }
                        }

                        if (this.isDateString(startDate) === false) {

                            this.flagStr = "开始时间格式错误，请从新输入！";
                            return false;
                        } else if (this.isDateString(endDate) === false) {
                            this.flagStr = "结束时间格式错误，请从新输入！";
                            return false;

                        }

                        var _startDate = arguments[0].replace(/-/g, "\/");
                        var _endDate = arguments[1].replace(/-/g, "\/");
                        var dateStart = new Date(_startDate);
                        var dateEnd = new Date(_endDate);
                        var currentDate = new Date();

                        //要得到晚一年的时间
                        var lackOneYear_year = Number(currentDate.getFullYear()) - 1;
                        var lackOneYear_month = currentDate.getMonth();
                        var lackOneYear_day = currentDate.getDate();
                        var lackOneYear = new Date(lackOneYear_year, lackOneYear_month, lackOneYear_day);

                        if (currentDate - dateStart < 0) {
                            this.flagStr = "开始时间大于当前时间！";
                            return false;
                        } else if (currentDate - dateEnd < 0) {
                            this.flagStr = "结束时间大于当前时间！";
                            return false;
                        } else if (dateStart - dateEnd > 0) {
                            this.flagStr = "开始时间大于结束时间！";
                            return false;
                        }

                        if (dateStart - lackOneYear < 0) {

                            this.flagStr = "查询的时间跨度不能超过一年！";
                            return false;
                        } else if (dateEnd - lackOneYear < 0) {
                            this.flagStr = "查询的时间跨度不能超过一年！";
                            return false;
                        }

                        var startNum = _startDate.split('/');
                        var endNum = _endDate.split('/');

                        //获取开始时间的年月日
                        var startYear = parseInt(startNum[0], 10);
                        var startMonth = parseInt(startNum[1], 10);
                        var startDay = parseInt(startNum[2], 10);

                        //获取结束时间的年月日
                        var endYear = parseInt(endNum[0], 10);
                        var endMonth = parseInt(endNum[1], 10);
                        var endDay = parseInt(endNum[2], 10);

                        //获取年月日的差值，用于两者的比较
                        var year = endYear - startYear;
                        var month = endMonth - startMonth;
                        var day = endDay - startDay;

                        if (year > 1) {
                            this.flagStr = "超过一年了！";
                            return false;

                        } else if (year == 1) {
                            var oneYearMonth = month + 12;

                            //先判断超过一年的，在判断超过三个月的。
                            if (month > 0) {
                                this.flagStr = "超过一年的不能查询！";
                                return false;
                            } else if (month === 0) {
                                if (day > 0) {
                                    this.flagStr = "超过一年的不能查询！";
                                    return false;
                                } else {
                                    this.flagStr = "没有超过一年但是超过三个月！";
                                    return false;
                                }
                            } else {
                                if (oneYearMonth > intervalMonth) {
                                    this.flagStr = "超过" + intervalMonth + "个月了,请重新输入日期！";
                                    return false;
                                } else if (oneYearMonth == intervalMonth) {
                                    if (day > 0) {
                                        this.flagStr = "超过" + intervalMonth + "个月了,请重新输入日期！";
                                        return false;
                                    } else {
                                        this.flagStr = "";
                                        return true;
                                    }

                                } else {
                                    this.flagStr = "";
                                    return true;
                                }
                            }

                        } else if (year === 0) {
                            if (month > intervalMonth) {
                                this.flagStr = "超过" + intervalMonth + "个月了,请重新输入日期！";
                                return false;
                            } else if (month == intervalMonth) {
                                if (day > 0) {
                                    this.flagStr = "超过" + intervalMonth + "个月了,请重新输入日期！";
                                    return false;
                                } else {
                                    this.flagStr = "";
                                    return true;
                                }

                            } else {
                                this.flagStr = "";
                                return true;
                            }

                        } else {
                            return false;
                        }

                    } else if (arguments.length == 2) {
                        var _startDate = arguments[0].replace(/-/g, "\/");
                        var _endDate = arguments[1].replace(/-/g, "\/");
                        var dateStart = new Date(_startDate);
                        var dateEnd = new Date(_endDate);
                        var currentDate = new Date();
                        if (currentDate - dateStart < 0) {
                            this.flagStr = "开始时间大于当前时间！";
                            return false;
                        } else if (currentDate - dateEnd < 0) {
                            this.flagStr = "结束时间大于当前时间！";
                            return false;
                        } else if (dateStart - dateEnd > 0) {
                            this.flagStr = "开始时间大于结束时间！";
                            return false;
                        } else {
                            this.flagStr = "";
                            return true;
                        }
                    }
                    //传递的参数不是两个或三个的时候都返回false
                    else {
                        this.flagStr = '参数传递不对！';
                        return false;
                    }

                },

                /**
                 * 获得错误原因
                 * @author wangjian
                 * @return {string} 返回校验错误的原因
                 */
                getErrorReason: function() {

                    return this.flagStr;
                },

                /**
                 * [getStandardDate description]
                 * @author wangjian
                 * @param  {[type]} dateStr [description]
                 * @return {[type]}         [description]
                 */
                getStandardDate: function(dateStr) { //这个方法暂时是没有用的

                    var dateString = dateStr;
                    var dateLength = dateString.length;
                    var year, month, day;
                    var dateNum = [];
                    if (dateLength <= 0 || dateLength > 8) {
                        this.flagStr = '时间的格式不对！';
                        return false;
                    } else {
                        dateNum[0] = dateString.substring(0, 4);
                        if (dateString.substring(4, 5) === '0') {
                            dateNum[1] = dateString.substring(5, 6);
                        } else {
                            dateNum[1] = dateString.substring(5, 7);
                        }

                    }

                },

                /**
                 * 获得当前时间
                 * @author wangjian
                 * @param  {[type]} t [description]
                 * @return {[type]}   [description]
                 */
                getDate: function(t) {
                    if (!t) {
                        return new Date();
                    }
                    var TIMESTAMP_REG = /^\d{13}$/;
                    var DATE_STR_REG = /^\d{4}[\.\-\/]\d{1,2}[\.\-\/]\d{1,2}$/;
                    var isTs = TIMESTAMP_REG.test(t);
                    var isDateStr = DATE_STR_REG.test(t);
                    if (isTs) {
                        t = parseInt(t, 10);
                        return new Date(t);
                    } else if (isDateStr) {
                        return new Date(t);
                    } else {
                        try {
                            return new Date(t);
                        } catch (e) {
                            throw "DateUtil.getDate() invalid parameter";
                        }
                    }
                },

                /**
                 * 计算某一时间偏移后的时间
                 * @author wangjian
                 * @param  {[type]} days         偏移量
                 * @param  {[type]} standardDate 起始时间
                 * @param  {[type]} format       [description]
                 * @return {[type]}              返回时间
                 */
                changeDate: function(days, standardDate, format) {
                    format = format || 'yyyy-MM-dd';
                    if (days && !standardDate) {
                        var group = days.match(/(-?\d+)([dDMmWw])/);
                        var value = parseInt(group[1], 10),
                            type = group[2].toUpperCase();
                        if (type === 'D')
                            return $filter('date')(new Date(new Date().getTime() + (value * 24 * 3600 * 1000)), format);
                        else if (type === 'W')
                            return $filter('date')(new Date(new Date().getTime() + (value * 7 * 24 * 3600 * 1000)), format);
                        else if (type === 'M') {
                            var date = new Date();
                            date.setMonth(date.getMonth() + value);
                            return $filter('date')(date, format);
                        }
                    } else if (days && standardDate) {
                        var group = days.match(/(-?\d+)([dDMmWw])/);
                        var value = parseInt(group[1], 10),
                            type = group[2].toUpperCase();
                        if (type === 'D')
                            return $filter('date')(new Date(standardDate.getTime() + (value * 24 * 3600 * 1000)), format);
                        else if (type === 'W')
                            return $filter('date')(new Date(standardDate.getTime() + (value * 7 * 24 * 3600 * 1000)), format);
                        else if (type === 'M') {
                            var date = new Date(standardDate);
                            date.setMonth(date.getMonth() + value);
                            return $filter('date')(date, format);
                        }
                    } else
                        return $filter('date')(new Date(), format);
                },

                /**
                 * 计算两个日期之间的相差天数
                 * @author wangjian
                 * @param  {[type]} beginDate 起始时间
                 * @param  {[type]} endDate   [结束时间]
                 * @return {[type]}           [天数]
                 */
                daysBetween: function(beginDate, endDate) {
                    var opts = Object.prototype.toString,
                        difference;
                    if (opts.call(beginDate) === "[object Date]" && opts.call(endDate) === "[object Date]") {
                        difference = (endDate.getTime() - beginDate.getTime()) / 86400000;
                    } else {
                        var OneMonth = beginDate.substring(5, beginDate.lastIndexOf('-'));
                        var OneDay = beginDate.substring(beginDate.length, beginDate.lastIndexOf('-') + 1);
                        var OneYear = beginDate.substring(0, beginDate.indexOf('-'));
                        var TwoMonth = endDate.substring(5, endDate.lastIndexOf('-'));
                        var TwoDay = endDate.substring(endDate.length, endDate.lastIndexOf('-') + 1);
                        var TwoYear = endDate.substring(0, endDate.indexOf('-'));
                        difference = ((Date.parse(TwoMonth + '/' + TwoDay + '/' + TwoYear) - Date.parse(OneMonth + '/' + OneDay + '/' + OneYear)) / 86400000);
                    }
                    return difference;
                }
            };
        }
    ];

    vx.module('ui.libraries').service(service);

})(window, window.vx);
