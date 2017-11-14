/**
 * @author HQC
 * <input type="text" v-model="prdcode" ui-carousel repeat="PrdList"  incoming-field="des;rate"/>
 * v-model:model值，要求与json中字段一致
 * repeat  内部循环List
 * incoming-field 显示的字段,传入时需用;分割开来
 * index 记录当前产品在List位于第几个
 */
(function(window, vx, undefined) {
    'use strict';
    var directive = {};
    directive.uiCarousel = [
        '$parse', '$compile',
        function($parse, $compile) {
            return {
                //					require: 'ngModel',
                restrict: 'A',
                /*
                 * template : '<div id="Slide1" class="zy-Slide">' + '<section>前一张</section><section>后一张</section>' + '<ul>' + '<li v-repeat="row in XXXList"><a
                 * v-bind="row.bbb"></a></li>' + '</ul>' + '</div>',
                 */
                link: function(scope, element, attrs) {
                    var startX, moveEndX, states, states_l = [],
                        states_r = [],
                        len, clen, lis, options, repateList = attrs.repeat,
                        incomingField = attrs.incomingField;
                    // 输入域下新增滚动效果
                    function createCarousel() {
                        var temp = '<div id="Slide1" class="zy-Slide">'
                            //+ '<section>前一张</section><section>后一张</section>'
                            +
                            '<ul>' +
                            '<li v-repeat="row in ' + repateList + '"><span v-bind="row.' + incomingField[0] + '" class="des"></span><span class="rate">' + "{{row." + incomingField[1] + "*100|number:2}}%" + '</span></li>' +
                            '</ul>' + '</div>';
                        var coutemp = $(temp);
                        $(element).css("display", "none");
                        $(element).after(coutemp);
                        $compile(coutemp)(scope);
                    }
                    // 移动引发变化
                    function move() {
                        var index, ele;
                        lis.each(function(i, el) {
                            $(el).css('z-index', states[i]['&zIndex'])
                                .finish().animate(states[i],
                                    options.speed);
                            setTimeout(function() {
                                if (states[i]['&cindex'] == clen) {
                                    $(el).addClass("active");
                                } else
                                    $(el).removeClass("active");
                            }, options.speed / 3);
                            // .stop(true,true).animate(states[i],1000).find('img').css('opacity',states[i].$opacity)
                        });
                        // 获取当前为List中第几个元素
                        setTimeout(
                            function() {
                                ele = $(element).next("#Slide1").find(
                                    "li.active");
                                index = $(ele).index();
                                scope[attrs.index] = index;
                                scope[attrs.ngModel] = scope[repateList][index][attrs.ngModel];
                                scope.$apply();
                            }, options.speed / 3);
                    }
                    incomingField = incomingField.split(";");
                    createCarousel();
                    scope.$watch(function() {
                        return scope.$eval(repateList);
                    }, function(newLis, oldLis) {
                        if (newLis) {
                            len = scope.$eval(repateList).length;
                            clen = Math.floor(len / 2);
                            for (var i = 0; i < len; i++) {
                                if (i == clen) {
                                    var st = {
                                        '&zIndex': 2 * i,
                                        width: "34%",
                                        left: "33%",
                                        '&cindex': i,
                                        opacity: "1"
                                    };
                                    states_r.push(st);
                                    states_l.push(st);
                                } else {
                                    var index = i < clen ? i + 1 : len - i - 1,
                                        index1 = i < clen ? i : len - i,
                                        left = i < clen ? "0%" : "67%";
                                    if (i == clen + 1 || i == clen - 1) {
                                        states_r.push({
                                            '&zIndex': index,
                                            width: "33%",
                                            left: left,
                                            '&cindex': i,
                                            opacity: "0.5"
                                        });
                                        states_l.push({
                                            '&zIndex': index1,
                                            width: "33%",
                                            left: left,
                                            '&cindex': i,
                                            opacity: "0.5"
                                        });
                                    } else {
                                        states_r.push({
                                            '&zIndex': index,
                                            width: "33%",
                                            left: left,
                                            '&cindex': i,
                                            opacity: "0"
                                        });
                                        states_l.push({
                                            '&zIndex': index1,
                                            width: "33%",
                                            left: left,
                                            '&cindex': i,
                                            opacity: "0"
                                        });
                                    }
                                }
                            }
                            setTimeout(function() {
                                states = states_r;
                                lis = $(element).next("#Slide1").find("ul").find("li");
                                move();
                            });
                        }
                    });
                    // 配置项
                    options = {
                        speed: 1000
                    };
                    element.next("#Slide1").bind({
                        "touchstart": function(e) {
                            startX = e.originalEvent.touches[0].pageX;
                        },
                        /*"touchmove" : function(e) {
                        },*/
                        "touchend": function(e) {
                            // 移动结束X坐标
                            moveEndX = e.originalEvent.changedTouches[0].pageX;
                            var moveDistince = moveEndX - startX;
                            if (moveDistince >= 30) {
                                states_l.push(states_l.shift());
                                states_r.push(states_r.shift());
                                states = states_l;
                                move();
                            } else if (moveDistince < -30) {
                                states_r.unshift(states_r.pop());
                                states_l.unshift(states_l.pop());
                                states = states_r;
                                move();
                            }
                        }
                    });
                }
            };

        }
    ];
    ibsapp.directive(directive);
})(window, window.vx);
