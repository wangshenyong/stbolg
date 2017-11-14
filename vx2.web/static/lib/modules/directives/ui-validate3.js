/*jshint smarttabs:true, eqeqeq:false, eqnull:true, laxbreak:true */
/**
 * @author wupeng 
 */
(function(window, vx, undefined) {'use strict';

	var directive = {};
	directive.uiValidate3 = ['$compile',
	function($compile) {
		var options = {
			'info':[{"title" : "required",'message':'此项必填'}]
		};
		
		return {
			restrict : 'A',
            link : function(scope, element, attrs) {
				var infoes = vx.fromJson(attrs.uiValidate3 || {}).info;
            	if(vx.isUndefined(infoes) || vx.equals(infoes.length,0)) {
            		infoes = options.info;
            	}
            	var pro = vx.fromJson(attrs.uiValidate3 || {}).prompt;
            	var placement = vx.fromJson(attrs.uiValidate3 || {}).placement;
            	var multiple = vx.fromJson(attrs.uiValidate3 || {}).multiple;
				//获取提示信息
                pro = (vx.isUndefined(pro) || vx.equals(pro.length,0)) ? true : pro;
                //提示信息显示位置
                placement = (vx.isUndefined(placement) || vx.equals(placement.length,0)) ? "right" : placement;
                //设置多行显示验证信息
                multiple = (vx.isDefined(multiple) && multiple !== "false") ? multiple : false;
                var html = '';
                var html2 = '';
                $.each(infoes, function(i){
	                if(vx.isUndefined(infoes[i].title)) {
	                	$.error('error : title参数出错');
	                }
                	html += '<li title='+ infoes[i].title +'>'+ (vx.isUndefined(infoes[i].message) ? 'message参数出错' : infoes[i].message) +'</li>';
                });
                //自定义弹出模板div
                var template = function(top, left, placement, html2) {
                    return ['<div class="popover ' + placement + '">',
                    		'<div class="arrow"></div>',
                    		'<div class="popover-inner">',
                    		''+ html2 +'',
                    		'<div class="popover-content">',
                    		'<ul>'+ html +'</ul>',
                    		'</div></div></div>'].join('');
                };
                //弹出div
                var div;
                var totalFlag = true;//默认都没验证通过
                //当前表单元素name值
                var name = attrs.name;
                if (!name || vx.equals(name,null)) {
					$.error("error : name attribute of Element undefine!");
					return;
				}
                //获取离当前表单元素最近的form元素name属性值,用于表单元素的验证
                var form = null;
                $("form").each(function() {
                    var obj = $(this).find("[name='" + name + "']");
                    if (obj.length > 0)
                        form = $(this);
                });
                var formName = form.attr("name");
                if($(element).children().children('input[type="checkbox"]').length > 0) {
	                element.bind('mouseenter', function() {
	                    if(vx.equals(pro,true)) {
	                    	div = vx.element($compile(template("0", "0", placement, html2))(scope));
	                    } else { 
	                    	html2 = '<h3 class="popover-title">'+ pro +'</h3>'; 
	                    	div = vx.element($compile(template("0", "0", placement, html2))(scope));
	                    }
	                    scope.$apply(); 
	                    $('body').append(div);
						getDivPosition(element);
	               		validateForm();
	                });
	                element.bind('mouseleave', function() {
	                	$('body').find('div.popover').remove();
	                });
	                scope.$watch(formName + "['" + name + "'].$error.required", function() {
	                	if (!multiple && !$('body').find('div.popover').is(":visible") && scope.$eval(formName + "['" + name + "'].$dirty")) {
							getDivPosition(element);  
	                    }
	                    validateForm();
	                });
                } else {
	                element.bind('focus', function() {
	                    //根据定义的模板创建一个弹出框div
	                    if(vx.equals(pro,true)) {
	                    	div = vx.element($compile(template("0", "0", placement, html2))(scope));
	                    } else { 
	                    	html2 = '<h3 class="popover-title">'+ pro +'</h3>'; 
	                    	div = vx.element($compile(template("0", "0", placement, html2))(scope));
	                    }
	                    scope.$apply(); //加载内容
	                    //将创建的div加载到页面上
	                    $('body').append(div);
						getDivPosition(element);
	               		validateForm();
	                });
	                element.bind('keydown', function(event) {
	                    validateForm();
	                });
	                //添加失去焦点事件
	                element.bind('blur', function() {
	                	$('body').find('div.popover').remove();
	                	if(totalFlag) {
	                		element.css('border-color','#FF9999');
	                	} else {
	                		element.css('border-color','#CCCCCC');
	                	}
	                });
	                scope.$watch(attrs.vModel, function() {
	                	if (!multiple && !$('body').find('div.popover').is(":visible") && scope.$eval(formName + "['" + name + "'].$dirty")) {
							getDivPosition(element);  
	                    }
	                    validateForm();
	                });
                 } 
                 function validateForm() {
                    //获取用户输入的title
                    var fg = new Array(infoes.length);
                    for (var i = 0; i < infoes.length; i++) {
                        var title = infoes[i].title;
                        var titleName = formName + "['" + name + "'].$error." + title;
                        var flag = (scope.$eval(titleName) === null) ? true : scope.$eval(titleName);
                        fg[i] = flag; 
                        var m = 0;
                		for(var j = 0; j<fg.length; j++) {
                			if(vx.equals(fg[j],true)) {
	                  			totalFlag = true;
                			} else if(vx.equals(fg[j],false)){
                				m = m+1;
                				if(vx.equals(m,fg.length)) {
                    				totalFlag = false;
                    			}
                			}
                   	 	}
                   	 	if(vx.equals(totalFlag,false)) {
                   	 		element.css('border-color','#CCCCCC');
                   	 	} 
                        if(!multiple) {
                        	if(flag) {
                        		 $("div.popover li[title=" + title + "]").show();
                        		 $("div.popover li[title=" + title + "]").siblings().hide();
	                             $("div.popover li[title=" + title + "]").removeClass("correct");
	                             $("div.popover li[title=" + title + "]").addClass("error");
	                             return;
                        	} 
                        	if(i === infoes.length-1) {
                        		$("body").find('div.popover').hide();
                        	}
                        } else {
	                       	if (flag) {
	                            $("div.popover li[title=" + title + "]").removeClass("correct");
	                            $("div.popover li[title=" + title + "]").addClass("error");
	                        } else {
	                            $("div.popover li[title=" + title + "]").removeClass("error");
	                            $("div.popover li[title=" + title + "]").addClass("correct");
	                        }
                        }
                    }
                }
                
                //设置弹出框的位置
                function getDivPosition(element) { 
                	validateForm();
                    //显示弹出框
                    div.css("display", "block"); 
                    //计算表单元素所在的位置
					var inside = "true";
                    //计算表单元素的宽度和高度
                    var getPosition = function(inside) {//offsetHeight=height+padding+border
                        return $.extend(true, {}, (element.offset()), {  
                            width : element[0].offsetWidth,  
                            height : element[0].offsetHeight 
                        });
                    };
                    var pos = getPosition(inside);
                    //获取弹出框div的宽度和高度
                    var actualWidth = div[0].offsetWidth; 
                    var actualHeight = div[0].offsetHeight; 
                    //计算弹出框所在的位置tp{top, left}
                    var tp = {};
                    switch (placement) {
                        case 'bottom':
                            tp = {
                                top : pos.top + pos.height,
                                left : pos.left + pos.width / 2 - actualWidth / 2
                            };
                            break;
                        case 'top':
                            tp = {
                                top : pos.top - actualHeight,
                                left : pos.left + pos.width / 2 - actualWidth / 2
                            };
                            break;
                        case 'left':
                            tp = {
                                top : pos.top + pos.height / 2 - actualHeight / 2,
                                left : pos.left - actualWidth
                            };
                            break;
                        case 'right':
                            tp = {
                                top : pos.top + pos.height / 2 - actualHeight / 2,
                                left : pos.left + pos.width
                            };
                            break;
                        default:
                            tp = {
                                top : pos.top + pos.height / 2 - actualHeight / 2,
                                left : pos.left + pos.width
                            };
                            break;
                    }
                    //定位显示弹出框
                    div.css(tp);
                }
                //监听事件$stateChangeSuccess
                scope.$root.$on("$stateChangeSuccess",function(event, preparedState, lastState){
				$('body').find('div.popover').remove();
	                	if(totalFlag) {
	                		element.css('border-color','#FF9999');
	                	} else {
	                		element.css('border-color','#CCCCCC');
	                	}
			});
			}
			
		};
	}];

	vx.module('ui.libraries').directive(directive);

})(window, window.vx);