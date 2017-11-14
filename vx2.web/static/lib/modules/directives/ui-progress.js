/*
 * 步骤导航菜单
 */
(function (window, vx, undefined) {
    'use strict';
    var directive = {};
    directive.uiProgress = [
        function () {
            return {
                restrict: 'CA',
	            scope:true,
                templateUrl: 'lib/template/progress/progress.html',

                link: function (scope, element, attrs) {
                    var current = '1';
                    var message = new Array();
                    if (vx.isDefined(attrs.current))
                        current = attrs.current;
                    if (vx.isDefined(attrs.message)) {
                        if (attrs.message.indexOf(",") != -1) {
                            message = attrs.message.split(',');
                            scope.message1 = message;
                        } else if (attrs.message.indexOf("，") != -1) {
                            message = attrs.message.split('，');
                            scope.message1 = message;
                        } else {
                            message[0] = attrs.message;
                            scope.message1 = message;
                        }
                    }
                    current = current * 1;
                    scope.current1 = current;
                    //// wizard
                    //var wizard=new Array();
                    //for(var i=1;i<=message.length;i++){
                    //	if(i<=current){
                    //		if(message.length==4){
                    //			if(i==1){
                    //				wizard.push("<span><img src='images/zzxx_001.png'/>&nbsp;<b class='font16'>");
                    //			}else{
                    //				wizard.push("<span><img src='images/zzxx_0"+(i-1)+"1.png'/>&nbsp;<b class='font16'>");
                    //			}
                    //				wizard.push(message[i-1]);
                    //				wizard.push("</b></span>");
                    //		}else{
                    //			wizard.push("<span><img src='images/zzxx_0"+i+"1.png'/>&nbsp;<b class='font16'>");
                    //			wizard.push(message[i-1]);
                    //			wizard.push("</b></span>");
                    //		}
                    //	}
                    //else{
                    //		if(message.length==4){
                    //		wizard.push("<span><img src='images/zzxx_0"+(i-1)+".png'/>&nbsp;");
                    //		}else{
                    //			wizard.push("<span><img src='images/zzxx_0"+i+".png'/>&nbsp;");
                    //		}
                    //		wizard.push(message[i-1]);
                    //		wizard.push("</span>");
                    //	}
                    //}
                    //element.prepend(wizard.join(''));
                }
            };
        }];
    vx.module('ui.libraries').directive(directive);
})(window, window.vx);