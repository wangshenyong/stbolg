/**
 * 主要作用：滚动摇奖
 * @author guozhenyao
 *  */

(function(window, vx, undefined) {
    'use strict';
    var directive = {};
    directive.uiRollernie = ['$state',
        function($state) {
            var defaults = {
                totalOpts: 5, //每个滚轮的总共的选项
                startOpt: 1, //开始滚动时的第一个选项
                isClickStop: false, //标记是否点击停止摇奖
                startSpeed: 100, //开始滚动时的速度
                stopIndex1: 1, //第一个小窗口停止的位置
                stopIndex2: 2, //第二个小窗口停止的位置
                stopIndex3: 3, //第三个小窗口停止的位置
                targetState: "example.rollErnie2", //跳转到的状态
            };
            return {
                template: '<div class="rollErnie"><div class="rollErnieBody"><div class="w1"><div class="img1">1</div><div class="img2">2</div><div class="img3">3</div><div class="img4">4</div><div class="img5">5</div><div class="img0"></div></div><div class="w2"><div class="img1">1</div><div class="img2">2</div><div class="img3">3</div><div class="img4">4</div><div class="img5">5</div><div class="img0"></div></div><div class="w3"><div class="img1">1</div><div class="img2">2</div><div class="img3">3</div><div class="img4">4</div><div class="img5">5</div><div class="img0"></div></div><div class="clearfix"></div><div class="operationArea"><button type="button" class="btn btn-info" id="operation"></button><button type="button" class="btn btn-danger" id="stop">停止</button></div></div><div class="cover"></div><div class="resultTip"></div><div class="continueTip"></div><div class="winPrizeTip"></div></div>',
                restrict: 'CA',
                link: function(scope, element, attrs) {
                    var $this = $('.rollErnie');
                    var opts = vx.extend({}, defaults, vx.fromJson(attrs.uiThreewindowyj));
                    // console.log(opts.targetUrl+"----------------------");
                    //标记有几个小窗口的转动已经结束
                    var stopCount = 0;
                    //结果提示的内容
                    var resultStr = "";
                    //摇奖结束后链接的url
                    var nextUrl = "";
                    //抽奖机会的次数
                    var chancecount = 3;

                    /**
                     * 获取一定范围内随机的数字
                     * startIndex:范围的最小值(包括这个值)
                     * endIndex:范围的最大值（包括这个值）
                     *  */
                    function getRan(startIndex, endIndex) {
                        return parseInt(Math.random() * (endIndex - startIndex + 1) + startIndex, 10);
                    }

                    /**
                     * 滚动过程
                     * currentWindow:当前滚动的小窗口
                     * currObjIndex:窗口中当前的图片
                     * nextObjIndex:下一个要进入小窗口的图片
                     * speed:滚动的速度
                     * stopIndex:停止在那个图片
                     *  */
                    function run(currentWindow, currObjIndex, nextObjIndex, speed, stopIndex) {
                        $this.find(currentWindow).find('.img' + nextObjIndex).css({
                            top: "-100%"
                        });
                        $this.find(currentWindow).find('.img' + nextObjIndex).animate({
                            "top": "0"
                        }, speed);
                        $this.find(currentWindow).find('.img' + currObjIndex).animate({
                            top: "100%"
                        }, speed, function() {
                            if (opts.isClickStop) {
                                speed = 500;
                            }
                            if (opts.isClickStop && stopIndex == nextObjIndex) {
                                stopCount++;
                                if (stopCount == 3) {
                                    if (opts.stopIndex1 == opts.stopIndex2 && opts.stopIndex1 == opts.stopIndex3) {
                                        //console.log("中一等奖");
                                        resultStr = "中一等奖";
                                        nextUrl = opts.targetUrl;
                                    } else if (opts.stopIndex1 == opts.stopIndex2 || opts.stopIndex1 == opts.stopIndex3 || opts.stopIndex2 == opts.stopIndex3) {
                                        resultStr = "中二等奖";
                                        nextUrl = opts.targetUrl;
                                    } else {
                                        resultStr = "没中奖";
                                        nextUrl = opts.returnUrl;
                                    }
                                    chancecount--;
                                    // 中奖了
                                    if (nextUrl == opts.targetUrl) {
                                        $this.find('.winPrizeTip').html('<span>' + resultStr + '</span><button class="btn btn-info btn-large">确定</button>').css({
                                            display: "block"
                                        });
                                        $this.find('.cover').css({
                                            display: "block"
                                        });
                                        $this.find('.winPrizeTip').find('button').bind('click', function() {
                                            $this.find('.continueTip').hide();
                                            $this.find('.cover').css({
                                                display: "none"
                                            });
                                            // 调整到中奖页面
                                            $state.go(opts.targetState, {
                                                "flag": "true",
                                                "resultStr": resultStr
                                            });
                                        });
                                        return;
                                    }
                                    if (chancecount <= 0) {
                                        // $this.find('.resultTip').html('<span>' + resultStr + '</span><button class="btn btn-info btn-large" disabled>没有机会了</button>').css({
                                        //     display: "block"
                                        // });
                                        // $this.find('.cover').css({
                                        //     display: "block"
                                        // });
                                        // 调整到中奖页面
                                        $state.go(opts.targetState, {
                                            "flag": "false",
                                            "resultStr": resultStr
                                        });
                                    } else {
                                        $this.find('.continueTip').html('<span>' + resultStr + '</span><button class="btn btn-info btn-large">还有' + chancecount + '次机会</button>').css({
                                            display: "block"
                                        });
                                        $this.find('.cover').css({
                                            display: "block"
                                        });
                                        $this.find('.continueTip').find('button').bind('click', function() {
                                            $this.find('.continueTip').hide();
                                            $this.find('.cover').css({
                                                display: "none"
                                            });
                                        });
                                    }
                                    $('#operation').text('重来').bind('click', function() {
                                        again();
                                        $(this).unbind();
                                        stopCount = 0;
                                    });
                                }
                                return;
                            }
                            currObjIndex = nextObjIndex;
                            nextObjIndex++;
                            if (nextObjIndex > opts.totalOpts) {
                                nextObjIndex = opts.startOpt;
                            }
                            run(currentWindow, currObjIndex, nextObjIndex, speed, stopIndex);
                        });
                    }


                    $this.find('.img0').css({
                        top: "0%"
                    });
                    //设置开始时默认显示的图片

                    /**
                     * 开始摇奖
                     *  */
                    function start() {
                        opts.stopIndex1 = getRan(1, 5);
                        opts.stopIndex2 = getRan(1, 5);
                        opts.stopIndex3 = getRan(1, 5);
                        //console.log("中奖数字：" + opts.stopIndex1 + "," + opts.stopIndex2 + "," + opts.stopIndex3);
                        $this.find('.img0').css({
                            top: "0"
                        });
                        opts.isClickStop = false;
                        run('.w1', 0, 1, opts.startSpeed, opts.stopIndex1);
                        setTimeout(function() {
                            run('.w2', 0, 1, opts.startSpeed, opts.stopIndex2);
                        }, 200);
                        setTimeout(function() {
                            run('.w3', 0, 1, opts.startSpeed, opts.stopIndex3);
                        }, 300);
                    }

                    /**
                     * 重来
                     *  */
                    function again() {
                        opts.isClickStop = false;
                        var againStartIndex1 = opts.stopIndex1;
                        var againStartIndex2 = opts.stopIndex2;
                        var againStartIndex3 = opts.stopIndex3;
                        var againNextIndex1 = againStartIndex1 + 1;
                        var againNextIndex2 = againStartIndex2 + 1;
                        var againNextIndex3 = againStartIndex3 + 1;

                        /*重置中奖数字 注意在获取重来的默认设置后，再进行重置。因为重来默认值的重设需要使用原先的中奖数字*/
                        opts.stopIndex1 = getRan(1, 5);
                        opts.stopIndex2 = getRan(1, 5);
                        opts.stopIndex3 = getRan(1, 5);
                        //console.log("中奖数字：" + opts.stopIndex1 + "," + opts.stopIndex2 + "," + opts.stopIndex3);

                        if (againNextIndex1 > opts.totalOpts) {
                            againNextIndex1 = opts.startOpt;
                        }
                        if (againNextIndex2 > opts.totalOpts) {
                            againNextIndex2 = opts.startOpt;
                        }
                        if (againNextIndex3 > opts.totalOpts) {
                            againNextIndex3 = opts.startOpt;
                        }
                        run('.w1', againStartIndex1, againNextIndex1, opts.startSpeed, opts.stopIndex1);
                        setTimeout(function() {
                            run('.w2', againStartIndex2, againNextIndex2, opts.startSpeed, opts.stopIndex2);
                        }, 200);
                        setTimeout(function() {
                            run('.w3', againStartIndex3, againNextIndex3, opts.startSpeed, opts.stopIndex3);
                        }, 300);
                    }


                    $('#stop').bind('click', function() {
                        opts.isClickStop = true;
                    });
                    $('#operation').text('开始').bind('click', function() {
                        start();
                        $(this).unbind();
                    });

                }
            };
        }
    ];
    vx.module('ibsapp').directive(directive);
})(window, window.vx);
