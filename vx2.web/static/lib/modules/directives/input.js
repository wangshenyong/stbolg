/**
 * input directive
 * Call native keyboard program
 * @auther
 */

(function(window,vx,$){
	'use strict';
	
	var mod = vx.module("ui.libraries");
	
	mod.directive("input", ["$os", "$nativeCall", function($os, $nativeCall){
		return {
			restrict: 'E',
			compile: function(element, attr, transclude){
				var type = element.attr("type"),button;
				if(($os.android || $os.wphone) && type==="date"){
					var date = element[0];
					var ediv = document.createElement("div");
					ediv.id = "mapp_" + date.id;
					ediv.className = "mapp_date " + date.className;
					ediv.style.marginLeft = "0";
					var jqediv = $(ediv);
					jqediv.addClass('dateInput');
					ediv.innerHTML = date.value ? date.value : date.placeholder;
					vx.element(ediv).attr("v-bind", attr.vModel);
					vx.element(ediv).bind("click", function(e){
//						e.preventDefault();
						var that = this;
						$nativeCall.datePicker(function(value){
							that.innerHTML = value;
							vx.element(that).trigger("input");
						});
					});
					vx.element(ediv).bind("input", function(){
						date.value = this.innerHTML;
						vx.element(date).trigger("input");
					});
					element[0].parentNode.appendChild(ediv);
					element[0].style.display="none";
				}else if(type==="checkbox"){
					button = document.createElement("a");
					button.className = "btn checkbox";
					element.after(button);
					element.hide();
					vx.element(button).bind("click",function(){
						var self = vx.element(this);
						element.trigger("click");
					});
				}
				return {
					post: function(scope, iElement, iAttr){
						if(type==="checkbox"){
							scope.$watch(iAttr.vModel, function(){
								var $button = vx.element(button);
								if(element[0].checked){
									$button.addClass("checkbox-checked");
									$button.removeClass('checkbox');
								} else {
									$button.addClass("checkbox");
									$button.removeClass('checkbox-checked');
								}
							});
						}
					}
				};
			}
		};
	}]);
	
})(window,window.vx,window.$);
