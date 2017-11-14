/**
 *  directive v-more
 *  v-more={
			"List":"dataList", //(必填)v-repeat的内容 如"item in dataList"
			"isType":"0", //(选填，默认为0) 0:前台分页 1:后台分页
 		}
 	pageSize="5" //每页显示条数，
 *  usage  
 		html:
 		<div class="moreList">
			<div class="fund-box" v-more="{'List':'item in dataList  |orderBy: sortType track by $index','isType':'0'}" pageSize="5">
			</div>
		</div>
		js:
		(前后台分页通用)
		$remote.post("data/XX.json",{},function(data){
          $scope.dataList=data;
      	});
    	（这里是模拟后台分页，真实情况不用写num这段，当数据加载完全，调 $scope.$emit("AllDateSuc");）
	var num=0;
    $scope.getMore=function(obj,index,pagesize){
    	var fordata={
    		"indexid":index,
    		"showcount":pagesize,
    	}
    	// 这块是模拟后台分页，当加载3次更多页面后，全部数据加载完成
    	num++;
    	if(num==3){
    		var list=[];
    		$scope.LcProductList=$scope.LcProductList.concat(list);
    		$scope.$apply();
	        $scope.$emit("moreDateSuc");//加载更多数据已完成
	        $scope.$emit("AllDateSuc");//数据全部加载完成
    		return;
    	}
	    $remote.post("data/InvPrdBuyPreNew.json",{},function(data){
	        $scope.more=data.LcProductList;
	        $scope.LcProductList=$scope.LcProductList.concat($scope.more);
	        $scope.$emit("moreDateSuc");//加载更多数据已完成
	        console.log($scope.LcProductList.length);
	     });
    }
 	*/
(function(window,vx,$){
 		'use strict';
 		var mod = vx.module("ui.libraries");
 		mod.directive("uiMore", ["$os","$compile", function($os,$compile){
 			return {
 				compile : function(element, attr, transclude) {
 					var pageSize = attr.pagesize || '5';
 					var uiMore = eval('('+attr.uiMore+')');
 					var pageName = uiMore.List.match(/\s*in\s*(\w*)/)[1];
				// var pageName = uiMore.List;
				element.removeAttr('ui-more');
				element.attr('v-repeat', uiMore.List);
				var nextButton = $('<div class="morebox"><a class="btn-more" id="' 
					+ pageName + '_nextButton" v-click="' 
					+ pageName + '_moreNextPage()">加载更多数据</a>');
				element.after(nextButton);

				return function(scope, element, attr, ctrl){
					var options={
						"morePageId":Math.random(),
						"parentTarget":element.parent(),
						"init":init,
						"width":0,
						"height":0,
						"itemIndex":0,//当前页数
						"isType":0//0前台分页，1后台分页
					};
			var boxArgument={"isscroll":true,"isAllData":false};
			function init(){
				boxArgument["m_body"] = document.body;
				boxArgument["m_element"] = document.compatMode == 'BackCompat' ? m_body
				: document.documentElement;
				options.width=options.parentTarget.width();
				options.height=options.parentTarget.height();
				scope.$on("moreDateSuc", function() {
	              clearAnimate();
	              boxArgument["isscroll"] = true;
	            });
	            scope.$on("AllDateSuc", function() {
	              clearAnimate();
	              boxArgument["isscroll"] = true;
	              $("#" + pageName + "_nextButton").html("数据已全部展示，共" + options.len + "条").
	              attr("disabled", "disabled");
	            });

			};
			function pageList(list,index,len){
				if(scope[list].length==0){
					return;
				}else if(scope[list]==scope[list+'_All']){

					scope[list]=scope[list+'_All'].slice(index*len,index*len+len*1);
				}else{
					scope[list]=scope[list].concat(scope[list+'_All'].slice(index*len,index*len+len*1));
				}
				scope.$digest()
				options.itemIndex++;
			}

			function deviceJudge(){
				if($os.ios || $os.android){
						//手机
						touchAction();
					}else{
						//电脑
						mouseAction();
					};
				}
				function touchAction(){
					/*$(window).unbind("scroll");
					$(window).scroll(function(event){			
											
					});*/
					/*$(options["parentTarget"]).unbind("touchstart");
					$(options["parentTarget"]).bind("touchstart",function(e){
						event.preventDefault()
					})*/
					$(options["parentTarget"]).unbind("touchmove");
					$(options["parentTarget"]).bind("touchmove",function(){
						scrollToMove();
					})
				}
				function mouseAction(){
					// $(window).unbind("scroll");
					if(document.attachEvent){
						//ie
						options["parentTarget"][0].attachEvent('onmousewheel',scrollToMove());
					}else if($os.firefox){
						//firefox
						options["parentTarget"][0].addEventListener('DOMMouseScroll',scrollToMove(),false);
					}else{
						//chrome
						options["parentTarget"][0].onmousewheel=options["parentTarget"][0].onmousewheel=scrollToMove;
					}
				}
				function scrollToMove(){
					
					if(boxArgument["isAllData"]){
						// $("#"+pageName+"_nextButton").html("没有数据了！");
						return;
					}
					console.log(pageName);
					if($os.firefox){
						boxArgument["m_offsetTop"] = boxArgument["m_element"].scrollTop;
					}else{
						boxArgument["m_offsetTop"] = boxArgument["m_body"].scrollTop;
					}
					boxArgument["m_offset"] = boxArgument["m_offsetTop"] + boxArgument["m_element"].clientHeight;
					if(boxArgument["m_offset"]>=options.parentTarget.offset().top+options.height-10){
						setCallBack()
					}
					
				}
				function setCallBack() {
            if (boxArgument["isscroll"]) {
              boxArgument["isscroll"] = false;
              console.log("diao le ");
              setAnimate();
              // setTimeout(function(){
              if (options.isType == '0') {
                if (parseInt(options.len / (pageSize * 1)) <= options.itemIndex) {
                  pageList(pageName, options.itemIndex, pageSize);
                  $("#" + pageName + "_nextButton").html("没有数据了！");
                  boxArgument["isAllData"] = true;
                } else if (options.len > options.itemIndex * pageSize) {
                  pageList(pageName, options.itemIndex, pageSize);
                } else {
                  $("#" + pageName + "_nextButton").html("没有数据了！");
                  boxArgument["isAllData"] = true;
                }
                setTimeout(function() {
                  clearAnimate();
                  boxArgument["isscroll"]=true;
                  // boxArgument["isAllData"] = true;
                }, 1000)
              } else {
                if ($("#" + pageName + "_nextButton").attr('disabled') != 'disabled') {
                	options.itemIndex++
                  scope.getMore(pageName, options.itemIndex , pageSize);
                } else {
                  clearAnimate();
                  boxArgument["isAllData"] = true;
                }
              }

              // clearAnimate();
              // boxArgument["isscroll"]=true;
              // },1000)
            }

          }
				function setAnimate(){
					var img="<img class='loading' src='css/images/load.gif'>"
					nextButton.append(img);
				}
				function clearAnimate(){
					nextButton.find("img").remove()
				}
				scope[pageName+"_moreNextPage"]=function(){
					setCallBack();
				}
				
				$compile(element)(scope);
				var oneFlag=true;
				scope.$watch(pageName, function(list) {
					if(!list){
						$("#"+pageName+"_nextButton").html("");
						return;
					} 
					$("#"+pageName+"_nextButton").html("加载更多数据..");
					for(var i in uiMore){
						options[i]=uiMore[i];
					}
					if (oneFlag) {
              oneFlag = false;
              scope[pageName + "_All"] = scope[pageName] || [];
              if (options.isType == "1") {
                if (scope[options.totalNum]) {
                  options["len"] = parseInt(scope[options.totalNum]);
                } else {
                  options["len"] = scope[pageName + "_All"].length;
                }
              }else{
              	options["len"] = scope[pageName + "_All"].length;
              }
              /*options["len"]=scope[pageName+"_All"].length;*/
              /*  alert("len:"+pageName+" "+options["len"]);*/
              if (options["len"] == 0) {
                $("#" + pageName + "_nextButton").html("无数据！");
                return;
              } else if (options["len"] < pageSize * 1) {
                $("#" + pageName + "_nextButton").html("数据已全部展示，共" + options.len + "条").attr("disabled", "disabled");
                boxArgument["isAllData"] = true;
                return;
              }
              if (options.isType == "0") {
                pageList(pageName, 0, pageSize);
              }
              deviceJudge();
            } else {
              if (options.isType == "1") {
                scope[pageName + "_All"] = scope[pageName] || [];

                if (scope[options.totalNum]) {
                  options["len"] = parseInt(scope[options.totalNum]);
                } else {
                  options["len"] = scope[pageName + "_All"].length;
                }
                // if (options["len"] <= scope[pageName + "_All"].length) {
                  if(parseInt(options.len)%(pageSize*1)!=0 || options["len"]<=0){
                  $("#" + pageName + "_nextButton").html("数据已全部展示，共" + options.len + "条").attr("disabled", "disabled");
                  boxArgument["isAllData"] = true;
                  return;
                } else {
                  boxArgument["isAllData"] = false;
                  $("#" + pageName + "_nextButton").removeAttr('disabled');
                  deviceJudge();
                }
              }
            }
					options.init();
					
					
				});
			}
		}
	}
}]);

})(window,window.vx,window.$);