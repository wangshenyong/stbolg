(function(window, vx, undefined) {'use strict';

var directive = {};

  directive.uiCheckboxtree = ['$compile','$timeout',
  function($compile,$timeout) {
    return {
      restrict : 'CA',
      scope : true ,
      require : '?vModel',
      link : function(scope, element, attrs, vModelCtrl) {
        var defaults = {
          /* Callbacks
           The callbacks should be functions that take one argument. The checkbox tree
           will return the vx.element wrapped LI element of the item that was checked/expanded.
           */
          onExpand : null,
          onCollapse : null,
          onCheck : null,
          onUnCheck : null,
          onHalfCheck : null,
          onLabelHoverOver : null,
          onLabelHoverOut : null,
          /* Valid choices: 'expand', 'check' */
          labelAction : "expand",
          // Debug (currently does nothing)
          debug : false
        };
              
        var settings = vx.extend(defaults, vx.fromJson(attrs.uiCheckboxtree5 || {}));       
        scope.$watch(function() {
          var liSize1 = vx.element(element).find("li").size();
          var liSize2 = vx.element(element).find("li ul li").size();
          var liSize3 = vx.element(element).find("li ul li ul li").size();
          var liSize4 = vx.element(element).find("li ul li ul li ul li").size();
          var liSize=liSize1+liSize2+liSize3+liSize4;
          return liSize;
        }, function(newVal, oldVal) {
         
          if (newVal > 0) {
            $timeout( function(){
              CheckboxTree();
              },500);
          }         
        });   
        
        scope.changeDataFristTrgger=function(){
          scope.DataFristTrgger=true;
          if(scope.myXgClass=="collapsed"||vx.isEmpty(scope.myXgClass)){
            scope.myXgClass='expanded'
          }else{
            scope.myXgClass='collapsed'
          }
        };
        scope.changeDataSecoundTrgger=function(index,strId){
          var secoundScope=vx.element("#"+strId+index).scope();         
          secoundScope.dataSecoundTrgger=true;
          if(secoundScope.myXgSecoundClass=="collapsed"||vx.isEmpty(secoundScope.myXgSecoundClass)){
            secoundScope.myXgSecoundClass='expanded'
          }else{
            secoundScope.myXgSecoundClass='collapsed'
          }
        };
        scope.changeDataThirdTrgger=function(rowIndex,index,dataChildren,strId){
          var thirdScope=vx.element("#"+strId+rowIndex+index).scope();                    
          if(vx.isEmpty(dataChildren)){
            thirdScope.myXgThirdClass='';
          }else{
            thirdScope.dataThirdTrgger=true;
            if(thirdScope.myXgThirdClass=="collapsed"||vx.isEmpty(thirdScope.myXgThirdClass)){
              thirdScope.myXgThirdClass='expanded'
            }else{
              thirdScope.myXgThirdClass='collapsed'
            }
          }
          
        };
        
        
        scope.myClass='collapsed';
        scope.chengeRowDataFristTrgger=function(){
          scope.rowDataFristTrgger=true;
          if(scope.myClass=="collapsed"||vx.isEmpty(scope.myClass)){
            scope.myClass='expanded'
          }else{
            scope.myClass='collapsed'
          }
        } 
        scope.chengeRowDataSecoundTrgger=function(rootIndex,index,strId){
          var secoundScope=vx.element("#"+strId+rootIndex+index).scope();         
          secoundScope.rowDataSecoundTrgger=true;
          if(secoundScope.mySecoundClass=="collapsed"||vx.isEmpty(secoundScope.mySecoundClass)){
            secoundScope.mySecoundClass='expanded'
          }else{
            secoundScope.mySecoundClass='collapsed'
          }         
        };
        scope.chengeRowDataThirdTrgger=function(rootIndex,rowIndex,index,strId){
          var thirdScope=vx.element("#"+strId+rootIndex+rowIndex+index).scope();          
          thirdScope.rowDataThirdTrgger=true;
          if(thirdScope.myThirdClass=="collapsed"||vx.isEmpty(thirdScope.myThirdClass)){
            thirdScope.myThirdClass='expanded'
          }else{
            thirdScope.myThirdClass='collapsed'
          }
        };
        
        
          var CheckboxTree =  function  (){
          var $tree = element;          
          var changeParents= function (eleAttr) {
            var thisElement=eleAttr;
            var $all = thisElement.siblings("ul").find("li > :checkbox");
            
            var $checked = $all.filter(":checked");
            
             // All children are checked
            if ($all.length == $checked.length) {
              
              thisElement.prop("checked", true).addClass("checked");              
              if (settings.onCheck)
                settings.onCheck(vx.element(this).parent());
              
            }                                               

            // Some children are checked, makes the parent in a half checked state.
            else {            

              thisElement.prop("checked", false).removeClass("checked");//.siblings(".checkbox").removeClass("checked").addClass("half_checked");
              
            }
          }
          

          $tree.find("li").each(function(index,domEle) {

            // Go through and hide only ul's (subtrees) that do not have a sibling div.expanded:
            // We do this to not collapse *all* the subtrees (if one is open and checkTree is called again)
            vx.element(this).find("ul").each(function() {
              if (!vx.element(this).siblings(".expanded").length)
                vx.element(this).hide();
            });
            

            var $label = vx.element(this).children("label");
            var $checkbox =  vx.element(this).children("input:checkbox");
            var $checkboxDiv =  vx.element(this).find("div > span > input:checkbox");
            var $arrow = vx.element(this).children("span.arrow");
            // If the li has children:
            if (vx.element(this).is(":has(ul)")) {
              // If the subtree is not visible, make the arrow collapsed. Otherwise expanded.
              if (vx.element(this).children("ul").is(":hidden"))
                $arrow.addClass("collapsed");
              else
                $arrow.addClass("expanded");

              // When you click the image, toggle the child list
              $arrow.unbind("click");
              $arrow.bind("click",function() {
                
                // Swap the classes: expanded <-> collapsed and fire the onExpand/onCollapse events               
                if (vx.element(this).hasClass("collapsed")) {
                  vx.element(this).siblings("ul").show();
                  vx.element(this).addClass("expanded").removeClass("collapsed");
                  if (settings.onExpand)
                    settings.onExpand(vx.element(this).parent());
                } else {
                  vx.element(this).siblings("ul").hide();
                  vx.element(this).addClass("collapsed").removeClass("expanded");
                  if (settings.onCollapse)
                    settings.onCollapse(vx.element(this).parent());
                }
                
              })              
            }
            
            $checkbox.parents("ul").each(function() {
              
              var parentsCheckbox = vx.element(this).parent().children(":checkbox");
              changeParents(parentsCheckbox);
            });

            $checkbox.unbind("click.check");
            $checkbox.bind("click.check",function(event){
              
              if($checkbox.siblings("ul").size()>0){
                
                if($checkbox.prop("checked")){
                  $checkbox.siblings("ul").find("input:checkbox").prop("checked", true);
                }else{
                  $checkbox.siblings("ul").find("input:checkbox").prop("checked", false);

                }
                
              }else if($checkbox.siblings("div").size()>0){
                if($checkbox.prop("checked")){
                  $checkbox.siblings("div").find("input:checkbox").prop("checked", true);
                }else{
                  $checkbox.siblings("div").find("input:checkbox").prop("checked", false);
                }
                
              }
              
              vx.element(this).parents("ul").each(function() {
                
                var parentsCheckbox = vx.element(this).parent().children(":checkbox");
                changeParents(parentsCheckbox);
                
                
              });
            });           
            $checkboxDiv.each(function(index,domELement){             
              $(domELement).unbind("click.check");
              $(domELement).bind("click.check",function(event){
                event.stopPropagation();
                if($(domELement).parent().parent().is("div")){
                  if($(domELement).prop("checked")){
                    $(domELement).parent().parent().siblings(":checkbox").prop("checked", true);                    
                    $(domELement).parent().parent().siblings(":checkbox").parents("ul").each(function() {                     
                      var parentsCheckbox = vx.element(this).parent().children(":checkbox");
                      changeParents(parentsCheckbox);                                           
                    });                                       
                  }else{
                    if($(domELement).parent().siblings("span").children(":checkbox").prop("checked")){
                                            
                    }else{
                      $(domELement).parent().parent().siblings(":checkbox").prop("checked", false);
                      $(domELement).parent().parent().siblings(":checkbox").parents("ul").each(function() {                     
                        var parentsCheckbox = vx.element(this).parent().children(":checkbox");
                        changeParents(parentsCheckbox);                                           
                      }); 
                    }
                  }
                }
              });
            });
          }).find("label")
          // Clicking the labels should do the labelAction (either expand or check)
          .click(function() {
            var action = settings.labelAction;
            switch(settings.labelAction) {
              case "expand":
                vx.element(this).siblings(".arrow").click();
                break;
              case "check":
                vx.element(this).siblings(".checkbox").click();
                break;
            }
          })
          // Add a hover class to the labels when hovering
          .hover(function() {
            vx.element(this).addClass("hover");
            if (settings.onLabelHoverOver)
              settings.onLabelHoverOver(vx.element(this).parent());
          }, function() {
            vx.element(this).removeClass("hover");
            if (settings.onLabelHoverOut)
              settings.onLabelHoverOut(vx.element(this).parent());
          }).end();
          };
          

      }
    };
  }];

  vx.module('ui.libraries').directive(directive);

})(window, window.vx);
