/**
 * 多功能下拉框，可输入，可搜索，可选择
 * @author wangjian
 */
(function(window, vx, undefined) {
    var directive = {};
    directive.uiSelectsearch = ['$timeout', '$compile', '$rootScope',
        function($timeout, $compile, $rootScope) {
            return {
                restrict: 'CA',
                link: function(scope, element, attrs) {
                    // 默认参数
                    var defaults = {
                        emptyMessage: '搜索无记录',
                        lineHeight: 20, //默认select框中的option的行高
                        num: 10, //默认显示条数
                        inputFlag: false, //select框是否具有可输入功能
                        splitChar: '/' //默认显示分割字符
                    };
                    var settings = $.extend({}, defaults, vx.fromJson(attrs.uiSelectsearch || {}));


                    //总条数
                    var totalNum = 0;
                    //显示数组 (上海银行)
                    var inputValueArr;
                    var chooseOptionFlag = false;
                    var keyInputFlag = false;
                    var focusFlag = false;



                    function applyScope() {
                        if (scope.$$phase == '$apply' || scope.$$phase == '$digest') {
                            return;
                        } else {
                            scope.$apply();
                        }
                    }

                    $("body").off('mousedown.searchSelect', '#' + settings.inputId);
                    $("body").off('click.searchSelect', '.' + settings.selectId + ' .searchSelectOption');
                    $("body").off('keyup.searchSelect', '#' + settings.inputId);
                    /*  $("body").off('mouseleave.searchSelect', '.'+settings.selectId+'.searchSelectDrop');*/


                    //input框(searchSelectButtonText)需显示的字段

                    function showInputValue(Model, inputDom, inputValueStr) {
                        if (inputValueStr) {
                            inputValueArr = inputValueStr.split(",");
                        }
                        var inputStr = "";
                        //若此Select框为不可输入的
                        for (var i in inputValueArr) {
                            if (Model[inputValueArr[i]]) {
                                if (i == inputValueArr.length - 1) {
                                    inputStr = inputStr + Model[inputValueArr[i]];
                                } else {
                                    inputStr = inputStr + Model[inputValueArr[i]] + settings.splitChar;
                                }
                            }
                        }
                        /* $("#"+settings.inputId).val(inputStr);*/
                        $("#" + inputDom).val(inputStr);
                    }

                    //阻止事件冒泡到body的click事件上
                    function preventBodyClick(evt) {
                        if (evt.preventDefault) {
                            evt.preventDefault();
                        } else {
                            evt.returnValue = false;
                        }
                        if (evt.stopPropagation) {
                            evt.stopPropagation();
                        } else {
                            evt.cancelBubble = true;
                        }
                    }

                    settings.selectHeight = settings.lineHeight * settings.num + settings.lineHeight * 3 / 2;
                    //首次进入，list无返回值
                    var drop = $('<div class="searchSelectDrop selectNone ' + settings.selectId + '" style="height:' + settings.selectHeight + 'px;width:' + ($(element).outerWidth() - 2) + 'px;"></div>');
                    var options = $('<div class="searchSelectOptions" style="height:' + (settings.num * settings.lineHeight) + 'px;"></div>');
                    var option = $('<div class="searchSelectOption"></div>');
                    var empty = $('<div class="searchSelectEmpty"><p class="searchSelectEmpty" style="line-height:' + settings.lineHeight + 'px">' + settings.emptyMessage + '</p></div>');
                    var p = $('<p class="searchSelectOptionText" style="line-height:' + settings.lineHeight + 'px"></p>');
                    //显示总条数
                    var info = $('<div style="width:auto;margin-top:' + settings.lineHeight / 5 + 'px;line-height:' + settings.lineHeight + 'px;text-align:center;"><span>共<span class="totalNum">0</span>条记录</span></div>');
                    $(drop).append(options);
                    $(element).parent().append(drop);
                    $(drop).append(info);
                    //禁止按tab键切换到此input框
                    $('#' + settings.inputId).attr("tabindex", "-1");


                    //如果使用v-option循环出的option值，则监听循环的list
                    if (vx.element(element).attr("v-options")) {
                        //监听数据有没有获取到
                        scope.$watch(function() {
                            //若option为循环出来的，即监听循环的List集合
                            return scope[settings.List];

                        }, function(newvalue, oldvalue) {
                            if (newvalue) {
                                if ($(".searchSelectDrop." + settings.selectId)) {
                                    $(".searchSelectDrop." + settings.selectId).remove();
                                }
                                showSelect();
                            }
                        });
                    }


                    //模拟创建Select的option
                    function showSelect() {
                        return element.each(function(i, obj) {
                            settings.selectHeight = settings.lineHeight * settings.num + settings.lineHeight * 3 / 2;
                            //创建option
                            var drop = $('<div class="searchSelectDrop ' + settings.selectId + '" style="height:' + settings.selectHeight + 'px;width:' + ($(element).outerWidth() - 2) + 'px;"></div>');
                            var options = $('<div class="searchSelectOptions"></div>');
                            var option = $('<div class="searchSelectOption"></div>');
                            var empty = $('<div class="searchSelectEmpty"><p class="searchSelectEmpty" style="line-height:' + settings.lineHeight + 'px">' + settings.emptyMessage + '</p></div>');
                            var p = $('<p class="searchSelectOptionText" style="line-height:' + settings.lineHeight + 'px"></p>');
                            //显示总条数
                            var info = $('<div class="totalNumInfo" style="width:auto;margin-top:' + settings.lineHeight / 5 + 'px;line-height:' + settings.lineHeight + 'px;text-align:center;"><span>共<span class="totalNum">0</span>条记录</span></div>');

                            // Looping through options in select and copy into new element.
                            $(this).find('option').each(function(i, obj) {
                                $(p).text($(this).text());
                                $(option).attr('id', 'searchSelectOptionValue-' + $(this).val());
                                $(option).append(p);
                                $(options).append(option.clone());
                                $(options).append(empty);
                            });
                            $(drop).append(options);
                            $(element).parent().append(drop);
                            $(drop).append(info);
                            $(this).attr('tabindex', '-1');

                            //select框是否默认选择了option中的一项
                            var isOptionFlag = false;
                            for (var i in scope[settings.List]) {
                                if (scope[settings.selectId] == scope[settings.List][i]) {
                                    isOptionFlag = true;
                                }
                            }
                            //总条数
                            if (scope[settings.selectId] && isOptionFlag) {
                                totalNum = $("." + settings.selectId + " .searchSelectOption").length;
                                //初始化时select框绑定值
                                $("." + settings.selectId).find("span.totalNum").text(totalNum);
                            } else {
                                totalNum = $("." + settings.selectId + " .searchSelectOption").length - 1;
                                //初始化时select框未绑定值
                                $("." + settings.selectId).find("span.totalNum").text(totalNum);
                            }

                            //option多数据时滚动选项栏
                            $(this).siblings('.searchSelectDrop').niceScroll({
                                cursorcolor: "#000000",
                                cursoropacitymax: 0.5,
                                cursoropacitymin: 0.5,
                                cursorwidth: 7,
                                scrollspeed: 40,
                                hidecursordelay: 0
                            });
                        });
                    }


                    //查找包含输入字符的option选项
                    $.expr[':'].searchSelectContains = $.expr.createPseudo(function(arg) {
                        return function(elem) {
                            return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
                        };
                    });
                    //搜索，并显示总条数
                    function showTotalNum(thisDom) {
                        var queryOption="";
                        if (thisDom.val() == "") {
                            queryOption = thisDom.siblings('.searchSelectDrop').find('.searchSelectOptionText');
                        } else {
                            queryOption = thisDom.siblings('.searchSelectDrop').find('.searchSelectOptionText:searchSelectContains("' + thisDom.val() + '")');
                        }
                        if (queryOption.parent().show().length) {
                            $('.' + settings.selectId + ' div.searchSelectEmpty').hide();
                        } else {
                            $('.' + settings.selectId + ' div.searchSelectEmpty').show();
                        }
                        //动态解析搜索总条数
                        if (thisDom.val() == "") {
                            //总条数
                            $("." + settings.selectId).find("span.totalNum").text(totalNum);
                        } else {
                            //总条数
                            $("." + settings.selectId).find("span.totalNum").text(queryOption.parent().show().length);
                        }
                    }


                    //点击input框（select框下的下拉框出现）
                    $("body").on('mousedown.searchSelect', '#' + settings.inputId, function(ev) {
                        //如果光标已为点入状态，直接返回
                        if (focusFlag == true) {
                            return;
                        }
                        chooseOptionFlag = false;
                        keyInputFlag = false;
                        //focusFlag=true;

                        //鼠标点入时将searchSelectEmpty，即没搜索记录提醒隐藏
                        $('.' + settings.selectId + ' div.searchSelectEmpty').hide();
                        //若首次进入，未产生下拉表数据
                        if (!$(this).siblings(".searchSelectDrop").hasClass("selectNone")) {
                            //若为不可输入的
                            if (settings.inputFlag == false) {
                                $("#" + settings.inputId).val("");
                                //匹配字符高亮
                                $("." + settings.selectId + " .searchSelectOptions").textSearch("");
                                //总条数
                                $("." + settings.selectId).find("span.totalNum").text(totalNum);
                            } else {
                                //匹配字符高亮
                                $("." + settings.selectId + " .searchSelectOptions").textSearch($(this).val());
                                //总条数
                                $("." + settings.selectId).find("span.totalNum").text(totalNum);
                            }
                        }

                        //若已有打开的option，将页面中已打开的下拉框关闭
                        /*if($(".searchSelectDrop.dropOpened").length>0){
                        	$(".searchSelectDrop.dropOpened").mouseleave();

                        	$(".searchSelectDrop.dropOpened").removeClass("dropOpened");
                        }*/
                        //模拟select框的option的div显示
                        $(this).siblings('.searchSelectDrop').show();
                        $(this).siblings('.searchSelectDrop').find('.searchSelectOption').show();
                        //为打开的drop添加类dropOpened
                        $(this).siblings('.searchSelectDrop').addClass("dropOpened");
                        $(this).siblings('select').val('');
                    });

                    //选中option时调用的方法
                    $("body").on('click.searchSelect', '.' + settings.selectId + ' .searchSelectOption', function(ev) {
                        preventBodyClick(ev);
                        /*  ev.stopPropagation();*/

                        //选中option时调用的mouseleave标志
                        chooseOptionFlag = true;
                        //focusFlag=false;
                        //将其它的option选项有选中样式的，将选中样式移除
                        $(this).addClass('searchSelectOptionSelected').siblings().removeClass('searchSelectOptionSelected');
                        //将select的option选择框隐藏
                        $(this).parents('.searchSelectDrop').hide();
                        //取消dropOpened类
                        $(this).parents('.searchSelectDrop').removeClass("dropOpened");
                        //触发select框的change事件
                        $(this).parents('.searchSelectDrop').siblings('select').val($(this).attr('id').replace('searchSelectOptionValue-', ''));
                        //解决IE下重复点击同一个option，加载慢问题
                        $(this).parents('.searchSelectDrop').siblings('select').change();
                        //显示选中值
                        showInputValue(scope[settings.selectId], settings.inputId, settings.inputValue);
                        if ($(this).parents(".searchSelectDrop").siblings("#" + settings.inputId).hasClass("inputGrey")) {
                            $(this).parents(".searchSelectDrop").siblings("#" + settings.inputId).removeClass("inputGrey");
                        }
                    });

                    //在input框中输入搜索值，键盘弹起时调用的方法
                    $("body").on('keyup.searchSelect', '#' + settings.inputId, function(ev) {
                        keyInputFlag = true;
                        //若首次进入，未产生下拉表数据
                        if ($(this).siblings(".searchSelectDrop").hasClass("selectNone")) {
                            return;
                        }
                        $(this).siblings('select').val('');
                        $(this).siblings('.searchSelectDrop').show().find('.searchSelectOption').hide();
                        showTotalNum($(this));
                        //匹配字符高亮
                        $("." + settings.selectId + " .searchSelectOptions").textSearch($(this).val());
                    });

                    $("#" + settings.inputId).focus(function(event) {
                        focusFlag = true;
                    });

                    $("#" + settings.inputId).blur(function(event) {
                        focusFlag = false;
                    });
                    $("#" + settings.inputId).click(function(event) {
                        preventBodyClick(event);
                        //鼠标点击其他其它select框，关闭上一个select框
                        var popSize = $("body").find(".searchSelectDrop:visible").size();
                        if (popSize > 1) {
                            $("body").find(".searchSelectDrop:visible").each(function(index, DomEle) {
                                if ($(DomEle).hasClass(settings.selectId)) {
                                    return;
                                } else {
                                    var attrsPre = $(DomEle).siblings("select").attr("ui-selectsearch");
                                    var settingsPre = $.extend({}, defaults, vx.fromJson(attrsPre || {}));
                                    if (settingsPre.inputFlag == false) {
                                        if (scope[settingsPre.selectId]) {
                                            showInputValue(scope[settingsPre.selectId], settingsPre.inputId, settingsPre.inputValue);
                                        } else {
                                            $("#" + settingsPre.inputId).val("");
                                        }
                                    } else {
                                        //将之前option绑定的清空
                                        $(".searchSelectDrop." + settingsPre.selectId).find('.searchSelectOption').removeClass('searchSelectOptionSelected');
                                        //是否含有placeholder属性
                                        if ($("#" + settingsPre.inputId).attr("placeholder") && $("#" + settingsPre.inputId).val() == $("#" + settingsPre.inputId).attr("placeholder")) {

                                            scope[settingsPre.selectId] = "";
                                            applyScope();
                                            $("#" + settingsPre.inputId).val("");
                                            $("#" + settingsPre.inputId).blur();
                                        } else {
                                            scope[settingsPre.selectId] = $("#" + settingsPre.inputId).val();
                                            applyScope();
                                            $("#" + settingsPre.inputId).val(scope[settingsPre.selectId]);
                                        }
                                    }
                                    $(".searchSelectDrop." + settingsPre.selectId).hide();
                                    //取消dropOpened类
                                    $(".searchSelectDrop." + settingsPre.selectId).removeClass("dropOpened");
                                }
                            });
                        }
                    });
                    //鼠标点击其它地方，关闭select框
                    var bindEvent = "click." + settings.selectId;
                    $("body").off(bindEvent);
                    $("body").on(bindEvent, function(event) {
                        if ($("body").find(".searchSelectDrop:visible").size() <= 0) {
                            return;
                        }
                        if (settings.selectId != $("body").find(".searchSelectDrop:visible").siblings("select").attr("v-model")) {
                            return;
                        }
                        //select不可输入
                        if (settings.inputFlag == false) {
                            if (scope[settings.selectId]) {
                                showInputValue(scope[settings.selectId], settings.inputId, settings.inputValue);
                            } else {
                                $("#" + settings.inputId).val("");
                            }
                        } else {
                            if (keyInputFlag == true || $("#" + settings.inputId).val() == "" || $("#" + settings.inputId).val() == $("#" + settings.inputId).attr("placeholder")) {
                                //将之前option绑定的清空
                                $(".searchSelectDrop." + settings.selectId).find('.searchSelectOption').removeClass('searchSelectOptionSelected');
                                //是否含有placeholder属性
                                if ($("#" + settings.inputId).attr("placeholder") && $("#" + settings.inputId).val() == $("#" + settings.inputId).attr("placeholder")) {
                                    scope[settings.selectId] = "";
                                    applyScope();
                                    $("#" + settings.inputId).val("");
                                    $("#" + settings.inputId).blur();
                                } else {
                                    scope[settings.selectId] = $("#" + settings.inputId).val();
                                    applyScope();
                                    $("#" + settings.inputId).val(scope[settings.selectId]);
                                }

                            }
                        }
                        $(".searchSelectDrop." + settings.selectId).hide();
                        //取消dropOpened类
                        $(".searchSelectDrop." + settings.selectId).removeClass("dropOpened");
                        /*focusFlag=false;*/
                    });
                }
            };
        }
    ];
    vx.module('ibsapp').directive(directive);
})(window, window.vx);
