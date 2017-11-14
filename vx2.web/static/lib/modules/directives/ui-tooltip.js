/*jshint smarttabs:true, eqeqeq:false, eqnull:true, laxbreak:true */
/**
 * @author fangpinghui
 */
(function (window, vx, undefined) {
    'use strict';

    var directive = {};

    directive.uiTooltip = [
        function () {
            var TRIGGER_ARRAY = ['focus', 'mouseenter'];
            var TRIGGER_ARRAY_CANCEL = ['blur', 'mouseleave'];
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    var placement = attrs.placement === undefined ? "top" : attrs.placement;
                    //定义弹出框模板
                    var tamplate = function (top, left, title) {
                        return '<div class="tooltip fade ' + placement + ' in" style="display: none;"><div class="tooltip-arrow"></div><div class="tooltip-inner">' + title + '</div></div>';
                    };
                    var trigger = element.attr('trigger');
                    var triggerCancel;
                    var index = TRIGGER_ARRAY.join("").indexOf(trigger);
                    if (index != '-1') {
                        triggerCancel = TRIGGER_ARRAY_CANCEL[index];
                    } else {
                        trigger = "mouseenter";
                        triggerCancel = "mouseleave";
                    }

                    var templateElement;
                    //获取页面上配置的属性
                    var title = attrs.title;
                    element.removeAttr("title");
                    //var placement = attrs.placement;
                    //先判断标题是否存在，如果不存在就不弹出框
                    if (title) {
                        //给定义的模板添加位置和标题
                        templateElement = vx.element(tamplate("0", "0", title));
                        //为指令绑定鼠标滑过事件
                        element.bind(trigger, function () {
                            //根据定义的模板创建一个div对象
                            var div = vx.element(templateElement);
                            //将创建的div加载到页面上
                            $("body").append(div);
                            div.css("display", "block");
                            var inside = "true";
                            //获取当前标签的位置
                            var getPosition = function (inside) {
                                return $.extend({}, (element.offset()), {
                                    width: element[0].offsetWidth,
                                    height: element[0].offsetHeight
                                });
                            };
                            //获取弹出框的宽度和高度
                            var actualHeight = div[0].offsetHeight;
                            var actualWidth = div[0].offsetWidth;
                            var pos = getPosition(inside);
                            var tp = {};
                            //设定弹出框的位置
                            switch (placement) {
                                case 'bottom':
                                    tp = {
                                        top: pos.top + pos.height,
                                        left: pos.left + pos.width / 2 - actualWidth / 2
                                    };
                                    break;
                                case 'top':

                                    tp = {
                                        top: pos.top - actualHeight,
                                        left: pos.left + pos.width / 2 - actualWidth / 2
                                    };
                                    break;
                                case 'left':
                                    tp = {
                                        top: pos.top + pos.height / 2 - actualHeight / 2,
                                        left: pos.left - actualWidth
                                    };
                                    break;
                                case 'right':
                                    tp = {
                                        top: pos.top + pos.height / 2 - actualHeight / 2,
                                        left: pos.left + pos.width
                                    };
                                    break;
                                default:
                                    tp = {
                                        top: pos.top + pos.height / 2 - actualHeight / 2,
                                        left: pos.left + pos.width
                                    };
                                    break;
                            }
                            templateElement.css(tp);
                            element.attr("title", null);
                        });
                        //为指令绑定鼠标移除事件
                        element.bind(triggerCancel, function () {
                            var div = vx.element(templateElement);
                            div.css("display", "none");
                        });
                        //转场时隐藏弹框
                        scope.$on("$pageContentLoaded", function (even, viewportId, pageIndex, target) {
                            var div = vx.element(templateElement);
                            div.css("display", "none");
                        });
                    }
                }
            };
        }];

    vx.module('ibsapp').directive(directive);

})(window, window.vx);
