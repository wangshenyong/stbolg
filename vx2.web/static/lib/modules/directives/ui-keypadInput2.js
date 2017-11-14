/*jshint smarttabs:true, eqeqeq:false, eqnull:true, laxbreak:true*/
/**
 * @author wbr
 * @description 虚拟键盘及其相应配合的按键与输入框组件
 */
(function(window, vx, $) {
    'use strict';

    var mod = vx.module("ui.libraries");
    /**
     * @author wbr
     * @description 使用虚拟键盘的输入框，配合uiKeypad与uiKey
     */
    mod.directive("uiKeypadInput2", [
        function() {
            // 定义键盘输入框对象
            function KeypadInput($scope, $element, $attrs, ctrl) {
                this.$scope = $scope;
                this.$element = $element;
                this.$attrs = $attrs;
                this.ctrl = ctrl;
                //当前input所想要调用的虚拟键盘的名字
                this.keypadId = $attrs.uiKeypadInput2;

                this.init();
            }

            /**
             * 记录当前选中的input
             */
            KeypadInput.selectedInput = null;
            /**
             * 清空已选中input及相关监听事件
             */
            KeypadInput.clearSelectedInput = function(e, id, value) {
                if (KeypadInput.selectedInput) {
                    if (undefined !== value) {
                        KeypadInput.selectedInput.ctrl.$setViewValue(value);
                        KeypadInput.selectedInput.ctrl.$render();
                    }
                    KeypadInput.selectedInput.$element.blur();
                    KeypadInput.selectedInput.$scope.$apply();
                    KeypadInput.selectedInput = null;

                }
            };
            /**
             * 初始化绑定监听事件
             */
            KeypadInput.prototype.init = function() {
                //阻止移动端默认键盘弹出
                this.$element.attr("readonly", true);
                this.$element.on("focus.uiKeypadInput2", $.proxy(keypadInputFocus, this));
                this.$scope.$on("uiKeypad.CLOSE", KeypadInput.clearSelectedInput);
            };

            /**
             * 虚拟输入框获取焦点时，触发keypad打开函数
             */
            function keypadInputFocus(event) {
                event.stopPropagation();

                this.$scope.$emit("uiKeypad.OPEN", this.keypadId, this.$attrs.ngPattern, this.ctrl.$viewValue);
                KeypadInput.selectedInput = this;
            }

            return {
                restrict: 'A',
                require: '^ngModel',
                link: function($scope, $element, $attrs, controller) {
                    new KeypadInput($scope, $element, $attrs, controller);
                }
            };
        }
    ]);
    /**
     * @author wbr
     * @description 虚拟键盘，配合uiKeypadInput与uiKey。
     * 				使用时需要用v-include指令引入键盘template
     */
    mod.directive("uiKeypad2", [
        function() {
            function Keypad($scope, $element, $attrs) {
                this.$scope = $scope;
                this.$element = $element;
                this.$attrs = $attrs;
                //当前keypad的名字。方便以后扩展多类型虚拟键盘
                this.keypadId = $attrs.uiKeypad2;
                this.opened = false;

                this.init();
            }

            /**
             * 初始化绑定监听事件
             */
            Keypad.prototype.init = function() {
                this.$element.hide();
                this.$scope.$on('uiInput.CLOSE', $.proxy(handleClose, this));
                this.$scope.$on("uiKeypad.OPEN", $.proxy(handleOpen, this));
                this.$scope.$on("uiKeypad.DISABLED", $.proxy(handleDisabled, this));
                this.$scope.$on("uiKeypad.RECOVERY", $.proxy(handleRecovery, this));
            };
            /**
             * 输入完毕时
             */
            function handleClose(e, id, value) {
                if (this.keypadId === id) {
                    this.$element.hide();
                    this.opened = false;
                    this.$scope.$broadcast("uiKeypad.CLOSE", this.keypadId, value);
                }
            }

            /**
             * 当input聚焦时打开虚拟键盘
             */
            function handleOpen(event, id, pattern, viewValue) {
                if (this.keypadId === id) {
                    if (!this.opened) {
                        this.$element.show();
                        this.opened = true;
                    }
                    this.$element.removeClass("keypad-disabled");
                    this.$scope.$broadcast("uiKeypad.OPENED", id, pattern, viewValue);
                }
            }

            /**
             * 当input校验失败后，键盘变为不可用状态
             */
            function handleDisabled(event, id) {
                if (this.keypadId === id) {
                    this.$element.addClass("keypad-disabled");
                }
            }

            /**
             * 键盘状态恢复
             */
            function handleRecovery(event, id) {
                if (this.keypadId === id) {
                    this.$element.removeClass("keypad-disabled");
                }
            }

            return {
                restrict: 'A',
                link: function($scope, $element, $attrs) {
                    new Keypad($scope, $element, $attrs);
                }
            };
        }
    ]);
    /**
     * @author wbr
     * @description 虚拟键盘按键，配合uiKeypadInput与uiKeypad
     */
    mod.directive("uiKey2", [
        function() {
            function Key($scope, $element, $attrs) {
                this.$scope = $scope;
                this.$element = $element;
                this.$attrs = $attrs;
                this.isTouch = ("ontouchstart" in document.documentElement) ? true : false;
                //移动端touchmove事件Y轴移动多少时判定为取消输入
                this.moveYLength = 30;
                this.init();
            }

            /**
             * 初始化绑定按钮按下函数
             */
            Key.prototype.init = function() {
                //防止触发vSubmit
                this.$element.attr("type", "button");
                if (this.isTouch) {
                    this.$element.on('touchstart.uiKey', $.proxy(keyPressStart, this));
                } else {
                    this.$element.on('mousedown.uiKey', $.proxy(keyPressStart, this));
                }

                this.$scope.$on('destroy', this.destroy);
            };
            /**
             * 点击某个数字键后绑定后续事件
             */
            Key.prototype.bindEvent = function() {
                if (this.isTouch) {
                    this.$element.on('touchend.uiKey', $.proxy(keyPressEnd, this));
                    this.$element.on('touchmove.uiKey', $.proxy(keyPressOut, this));
                } else {
                    this.$element.on('mouseup.uiKey', $.proxy(keyPressEnd, this));
                    this.$element.on('mouseleave.uiKey', $.proxy(keyPressOut, this));
                }
            };
            /**
             * 解绑事件
             */
            Key.prototype.unbindEvent = function() {
                if (this.isTouch) {
                    this.$element.off('touchend.uiKey');
                    this.$element.off('touchmove.uiKey');
                } else {
                    this.$element.off('mouseup.uiKey');
                    this.$element.off('mouseleave.uiKey');
                }
            };
            /**
             * $scope销毁时解绑所有事件
             */
            Key.prototype.destroy = function() {
                if (this.isTouch) {
                    this.$element.off('touchstart.uiKey');
                } else {
                    this.$element.off('mousedown.uiKey');
                }
                this.unbindEvent();
            };
            /**
             * 添加按下时的样式 ，并绑定后续事件
             */
            function keyPressStart(event) {
                if (this.isTouch) {
                    var orginE = event.originalEvent;
                    var touch = orginE.touches[0];
                    this.startPosition = {
                        x: touch.pageX,
                        y: touch.pageY
                    };
                }
                this.$element.addClass('pressed');
                event.preventDefault();
                event.stopImmediatePropagation();
                this.bindEvent();
            }

            /**
             * 确定输入一个数字时，广播“uiKey.PRESSED”事件，去除按下样式，解除绑定
             */
            function keyPressEnd(event) {
                this.$element.removeClass('pressed');
                this.$scope.$emit("uiKey.PRESSED", this.$attrs.uiKey2);
                this.unbindEvent();
            }

            /**
             * 移出数字键范围时，去除按下样式，解除绑定
             */
            function keyPressOut(event) {
                //计算移动端touchmove时移动的距离，用于模拟取消输入手势
                if (this.isTouch) {
                    var orginE = event.originalEvent;
                    var touch = orginE.touches[0];
                    this.endPosition = {
                        x: touch.pageX,
                        y: touch.pageY
                    };
                    var deltaY = this.endPosition.y - this.startPosition.y;
                    var moveLength = Math.abs(deltaY);
                    if (moveLength > this.moveYLength) { //如果Y轴移动距离大于this.moveYLength，判定为取消输入
                        this.$element.removeClass('pressed');
                        this.unbindEvent();
                    } else { //否则，作为正常数字键按下响应
                        $.proxy(keyPressEnd, this);
                    }
                } else {
                    this.$element.removeClass('pressed');
                    this.unbindEvent();
                }
            }

            return {
                restrict: 'A',
                link: function($scope, $element, $attrs) {
                    new Key($scope, $element, $attrs);
                }
            };
        }
    ]);
    /**
     * @author wbr
     * @description 虚拟键盘上的输入框，配合uiKeypadInput、uiKeypad、uiKey
     */
    mod.directive("uiInput", [
        function() {
            function Input($scope, $element, $attrs) {
                this.$scope = $scope;
                this.$element = $element;
                this.$attrs = $attrs;
                this.keypadId = $attrs.uiInput;
                this.value = "";
                this.regExp = null;
                this.init();
            }

            /**
             * 初始化绑定按键按下时的相应函数
             */
            Input.prototype.init = function() {
                //阻止移动端默认键盘弹出
                this.$element.attr("readonly", true);
                this.$scope.$on("uiKey.PRESSED", $.proxy(handleKeyPressed, this));
                this.$scope.$on("uiKeypad.OPENED", $.proxy(handleOpen, this));
            };
            /**
             * 虚拟按键按下时
             */
            function handleKeyPressed(event, key) {
                if (key.indexOf('[') === -1 && key.indexOf(']') === -1) {
                    normalKeyPressed(key, this);
                } else {
                    key = key.substring(1, key.length - 1);
                    fnKeyPressed(key, this);
                }
            }

            /**
             * 虚拟键盘打开时
             */
            function handleOpen(event, keypadId, pattern, viewValue) {
                if (this.keypadId === keypadId) {
                    if (viewValue) {
                        this.value = viewValue;
                        this.$element.val(viewValue);
                    } else {
                        this.value = "";
                        this.$element.val("");
                    }
                    this.regExp = pattern;
                }
            }

            /**
             * 检查v-pattern
             */
            function allowed(value, key, regExp) {
                var allowed = true;
                var pattern = regExp,patternStr;
                if (pattern) {
                	// charAt为字符串方法 
					patternStr = regExp.toString();
                    if (patternStr.charAt(0) === "/" && patternStr.charAt(patternStr.length - 1) === "/") {
                        pattern = patternStr.substring(1, patternStr.length - 1);
                    }
                    pattern = new RegExp(pattern, 'gi');

                    var newValue = "" + value + key;

                    if (!pattern.test(newValue)) {
                        allowed = false;
                    }
                }
                return allowed;

            };

            /**
             * 正常按键按下时
             */
            function normalKeyPressed(key, self) {
                var value = self.value + "";

                if (!value) {
                    value = "";
                }

                if (allowed(value, key, self.regExp)) {
                    value += key;
                    self.value = value;
                    self.$element.val(value);
                } else {
                    self.$scope.$emit("uiKeypad.DISABLED", self.keypadId);
                }
            }

            /**
             * 功能按键按下时
             */
            function fnKeyPressed(key, self) {
                if (key === "CLEAR") {
                    self.value = "";
                    self.$element.val("");
                    self.$scope.$emit("uiKeypad.RECOVERY", self.keypadId);
                } else if (key === "CANCEL") {
                    self.$scope.$emit("uiInput.CLOSE", self.keypadId);
                } else if (key === "OK") {
                    // 如果最后一个是“.”则复制时去掉"." add by lss
                    if (self.value.substring(self.value.length - 1) == ".") {
                        self.value = self.value.substring(0, self.value.length - 1);
                    }
                    self.$scope.$emit("uiInput.CLOSE", self.keypadId, self.value);
                }
            }

            return {
                restrict: 'A',
                link: function($scope, $element, $attrs) {
                    new Input($scope, $element, $attrs);
                }
            };
        }
    ]);

})(window, window.vx, window.$);
