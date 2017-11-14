/**
 * 主要功能:砸金蛋摇奖
 *
 *  */
(function(window, vx, undefined) {
    var directive = {};
    directive.uiSmashegg = ['$compile', '$targets',
        function($compile, $targets) {
            return {
                restrict: 'AE',
                template: '<div class="uiSmashegg"><div class="jd_01bg"><img src="lib/plugins/ui-smashegg/img/bg_001.png"><div class="yell_text"></div><div class="jd_01_01"><img src="lib/plugins/ui-smashegg/img/jd_01.png" id="allEgg"><img src="lib/plugins/ui-smashegg/img/jd_02.png" id="crackEgg"><img src="lib/plugins/ui-smashegg/img/jd_05.png" id="brokenEgg"><div><ul class="zd_bigcaidai"><li class="cardai01 cardai"><img src="lib/plugins/ui-smashegg/img/zd_cion15.png"></li><li class="cardai02 cardai"><img src="lib/plugins/ui-smashegg/img/zd_cion14.png"></li><li class="cardai03 cardai"><img src="lib/plugins/ui-smashegg/img/zd_cion13.png"></li><li class="cardai04 cardai"><img src="lib/plugins/ui-smashegg/img/zd_cion12.png"></li><li class="cardai05 cardai"><img src="lib/plugins/ui-smashegg/img/zd_cion11.png"></li><li class="cardai06 cardai"><img src="lib/plugins/ui-smashegg/img/zd_cion10.png"></li></ul></div></div><div class="jd_02"><img src="lib/plugins/ui-smashegg/img/xing.png"></div><div class="jd_03_01"><img src="lib/plugins/ui-smashegg/img/chuizi.png"  v-click="smashegg();"></div></div></div>',
                link: function(scope, element, attrs, controller) {
                    $('#crackEgg').hide();
                    $('#brokenEgg').hide();
                    scope.smashegg = function() {
                        //小锤向下砸的动作
                        $('.jd_03_01').addClass("jd_03");
                        //金蛋砸中后抖动
                        $(".jd_01_01").addClass("jd_01");
                        setTimeout(function() {
                            $('#allEgg').hide();
                            $('#crackEgg').show();
                        }, 800);
                        setTimeout(function() {
                            $('#crackEgg').hide();
                            $('#brokenEgg').show();
                            $(".jd_03_01").hide();
                            /**
                             *模拟砸金蛋结果
                             */
                            scope.result = Math.round(Math.random());
                            if (scope.result == '1') {
                                $(".yell_text").html("恭喜您,中奖了");
                                //背景光500毫秒闪烁
                                $(".cardai01").fadeIn(500);
                                $(".cardai03").animate({
                                    top: '225px',
                                    left: '345px'
                                }, 600);
                                $(".cardai04").animate({
                                    top: '230px',
                                    left: '202px'
                                }, 700);
                                $(".cardai05").animate({
                                    top: '230px',
                                    left: '230px'
                                }, 800);
                                $(".cardai06").animate({
                                    top: '340px',
                                    left: '246px'
                                }, 1000, function() {
                                    $(".cardai").addClass("cardai07");
                                    $(".zd_jindan").removeClass("zd_jindan01");
                                    $(".yell_text").show();
                                });
                            } else {
                                $(".yell_text").show();
                                $(".yell_text").html("再接再厉");
                            }
                        }, 1100);
                        return false;
                    };
                }
            };
        }
    ];
    vx.module('ibsapp').directive(directive);
})(window, window.vx);
