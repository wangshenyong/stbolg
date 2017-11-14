/**
 *Add By WEILE
 * 表格的各行变色 
 */
(function(window, vx, undefined) {'use strict';

  var directive = {};
  directive.uiColor = [
  function() {
    return {
      restrict : 'CA',
      link : function(scope, element, attrs) {
        var options = vx.fromJson(attrs.uiColor || {});
        var _default = {
          id : "#senfe",  //表格id
          odd: "#fff",  //奇数行颜色
          even : "#fff", //偶数行颜色
          mhover : "#dae1f0", //鼠标hover颜色
          mclick : "#fff" //选中颜色
        };
        options = vx.extend(_default, options);
        scope.$watch(function(){
          var l=vx.element(options.id).find("tbody tr").length;
          return l;
        },function(){
          changeColor();
        });
        function changeColor() {
        var t=vx.element(options.id).find("tbody tr");
        vx.element(options.id).find("tbody tr:even").css("background",options.even);
        vx.element(options.id).find("tbody tr:odd").css("background",options.odd);
        t.bind({
          mouseover:function(){
            $(this).css("background",options.mhover);},
          mouseout:function(){
             if($(this).index()%2==0 && !$(this).hasClass("mactive")){
              $(this).css("background",options.odd);    
            }else if(!$(this).hasClass("mactive")){
              $(this).css("background",options.even); 
            }},
          click:function(){
            vx.element(options.id).find("tbody tr:even").css("background",options.even);
            vx.element(options.id).find("tbody tr:odd").css("background",options.odd);
            $(this).siblings().removeClass("mactive");
            $(this).addClass("mactive");
            $(this).css("background",options.mclick);}
        });
    };
    }
    };
  }];
   vx.module('ui.libraries').directive(directive);
  })(window, window.vx);
