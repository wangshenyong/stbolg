/*jshint smarttabs:true, eqeqeq:false, eqnull:true, laxbreak:true*/

/*(function(window, vx, undefined) {'use strict';

var mod = vx.module("ui.libraries");
mod.directive("vActionsheet", ["$os",function($os) {
	var actionsheet = (function() {
        var actionsheet = function(elID, opts, scope) {
            this.el = elID;
            if (this instanceof actionsheet) {
                if(typeof(opts)=="object"){
                for (var j in opts) {
                    this[j] = opts[j];
                }
                }
            } else {
                return new actionsheet(elID, opts);
            }
            try {
                var that = this;
                var markStart = '<div id="jq_actionsheet"><div style="width:100%">';
                var markEnd = '</div></div>';
                var markup;
                if (typeof opts == "string") {
                    markup = $(markStart + opts +"<a href='javascript:;' class='cancel'>取消</a>"+markEnd);
                } else if (typeof opts == "object") {
                    markup = $(markStart + markEnd);
                    var container = $(markup.children().get());
                    opts.push({text:"取消",cssClasses:"cancel"});
                    for (var i = 0; i < opts.length; i++) {
                        var item = $('<a href="javascript:;" >' + (opts[i].text || "TEXT NOT ENTERED") + '</a>');
                        item[0].onclick = (function(handler){
                        		return function(){
                        			scope.$apply(handler);
                        		}
                        })(opts[i].handler);
                        if (opts[i].cssClasses && opts[i].cssClasses.length > 0)
                            item.addClass(opts[i].cssClasses);
                        container.append(item);
                    }
                }
                $(elID).find("#jq_actionsheet").remove();
                $(elID).find("#jq_action_mask").remove();
                var actionsheetEl = $(elID).append(markup);
                
                this.el.style.overflow = "hidden";
                markup.on("click", "a",function(){that.hideSheet()});
                this.activeSheet=markup;
                $(elID).append('<div id="jq_action_mask" style="position:absolute;top:0px;left:0px;right:0px;bottom:0px;z-index:9998;background:rgba(0,0,0,.4)"/>');
            } catch (e) {
            	console.log("catch error: " + e);
            }
        };
        actionsheet.prototype = {
            activeSheet:null,
            hideSheet: function() {
                var that=this;
                this.activeSheet.off("click","a",function(){that.hideSheet()});
                $(this.el).find("#jq_action_mask").remove();
                // this.activeSheet.get().style[$.feat.cssPrefix+'Transition']="all 0ms";
                var markup = this.activeSheet;
                var theEl = this.el;
                setTimeout(function(){
                	// markup.get().style[$.feat.cssPrefix+'Transition']="all 300ms";
                	// markup.css($.feat.cssPrefix+"Transform", "translate"+$.feat.cssTransformStart+"0,0px"+$.feat.cssTransformEnd);
                	markup.remove();
	                markup=null;
	                theEl.style.overflow = "none";
                },10);            
            }
        };
        return actionsheet;
    })();
	return {
		restrict: 'A',
		link: function postLink(scope, element, attr){
			element.bind("click",function(e){
				var opts = null;
				opts = vx.copy(scope[attr.vActionsheet]);
				new actionsheet(vx.element("body")[0],opts,scope);	
			});
		}
	}
}]);
})(window, window.vx);*/


/**
 * popup service
 * return {
 * 	   "actionsheet":  function(actionJson, scope)
 * }
 * actionJson 数组
 * scope	当前scope
 */
(function(window, vx, undefined) {
	'use strict';
	vx.module('ibsapp')
		.factory('Popup', [function () {
			var actionsheet = (function() {
		        var actionsheet = function(elID, opts, scope) {
		            this.el = elID;
		            if (this instanceof actionsheet) {
		                if(typeof(opts)=="object"){
		                for (var j in opts) {
		                    this[j] = opts[j];
		                }
		                }
		            } else {
		                return new actionsheet(elID, opts);
		            }
		            try {
		                var that = this;
		                var markStart = '<div id="jq_actionsheet"><div style="width:100%">';
		                var markEnd = '</div></div>';
		                var markup;
		                if (typeof opts == "string") {
		                    markup = $(markStart + opts +"<a href='javascript:;' class='cancel'>取消</a>"+markEnd);
		                } else if (typeof opts == "object") {
		                    markup = $(markStart + markEnd);
		                    var container = $(markup.children().get());
		                    opts.push({text:"取消",cssClasses:"cancel"});
		                    for (var i = 0; i < opts.length; i++) {
		                        var item = $('<a href="javascript:;" >' + (opts[i].text || "TEXT NOT ENTERED") + '</a>');
		                        item[0].onclick = (function(handler){
		                        		return function(){
		                        			scope.$apply(handler);
		                        			$("body").css("overflow","");
		                        		}
		                        })(opts[i].handler);
		                        if (opts[i].cssClasses && opts[i].cssClasses.length > 0)
		                            item.addClass(opts[i].cssClasses);
		                        container.append(item);
		                    }
		                }
		                $(elID).find("#jq_actionsheet").remove();
		                $(elID).find("#jq_action_mask").remove();
		                markup.css("bottom",-(45*opts.length+10)+"px")
		                var actionsheetEl = $(elID).append(markup);
		                setTimeout(function(){
							markup.css("bottom","0px")
		                }, 0);
		                
		                this.el.style.overflow = "hidden";
		                markup.on("click", "a",function(){that.hideSheet()});
		                this.activeSheet=markup;
		                $(elID).append('<div id="jq_action_mask" style="position:fixed;top:0px;left:0px;right:0px;bottom:0px;z-index:9998;background:rgba(0,0,0,.4)"/>');
		                $("#jq_action_mask").bind("touchmove", function(e){  //阻止滑动
		                	e.preventDefault();
		                });
		            } catch (e) {
		            	console.log("catch error: " + e);
		            }
		        };
		        actionsheet.prototype = {
		            activeSheet:null,
		            hideSheet: function() {
		                var that=this;
		                this.activeSheet.off("click","a",function(){that.hideSheet()});
		                $("#jq_action_mask").unbind("touchmove");  //取消事件监听
		                $(this.el).find("#jq_action_mask").remove();
		                // this.activeSheet.get().style[$.feat.cssPrefix+'Transition']="all 0ms";
		                var markup = this.activeSheet;
		                var theEl = this.el;
		                setTimeout(function(){
		                	// markup.get().style[$.feat.cssPrefix+'Transition']="all 300ms";
		                	// markup.css($.feat.cssPrefix+"Transform", "translate"+$.feat.cssTransformStart+"0,0px"+$.feat.cssTransformEnd);
		                	markup.remove();
			                markup=null;
			                theEl.style.overflow = "none";
		                },10);            
		            }
		        };
		        return actionsheet;
		    })();
		return {
			actionsheet: function(actionJson, scope){
				if(vx.isArray(actionJson)){
					var opts = vx.copy(actionJson);
					new actionsheet(vx.element("body")[0],opts,scope);
				}
			}
		};
	}]);

})(window, window.vx);