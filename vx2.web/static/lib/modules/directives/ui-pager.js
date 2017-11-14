/**
 * @author tian
 * @description 必须依赖skip过滤器
 */
(function(window, vx, undefined) {
  'use strict';
  var mod = vx.module('ibsapp');
  /*
   * 过滤器skipFilter
   * [skipAt,skipEndAt) 从 skipAt 开始（包括 skipAt）到 skipEndAt 结束（不包括 skipEndAt）
   * example:
   * {{exa|skip:1:2}}
   */
  var filter = {};
  filter.skipFilter = function() {
    return function(input, skipAt, skipEndAt, appendStr) {
      if (!vx.isArray(input) && !vx.isString(input))
        return input;
      else if (skipEndAt && !appendStr)
        return input.slice(skipAt, skipEndAt);
      else if (appendStr) {
        if (vx.isString(input) && (input.length - 1) > skipEndAt) {
          return input.slice(skipAt, skipEndAt) + appendStr;
        } else if (vx.isString(input)) {
          return input.slice(skipAt, skipEndAt);
        }
      } else
        return input.slice(skipAt);

    };
  };

  mod.filter('skip', filter.skipFilter);
  /*
   * 分页组件ui-pager
   */
  pagerController.$inject = ['$element', '$attrs', '$scope', '$remote', '$compile'];
  function pagerController($element, $attrs, $scope, $remote, $compile) {
    var pager = this;
    pager.currentIndex = 0;
    pager.curIdx = 0;
    //前端分页使用
    pager.currentPage = 1;
    pager.totalPage = 0; 
    pager.recordNumber = null;
    pager.pageSize = $attrs.pagersize ? parseInt($attrs.pagersize) : 10;
    pager.pageOptions = [];
    pager.List = [];

    var name = ($attrs.uiPager || $attrs.uiPager.length > 0) ? $attrs.uiPager : $attrs.name;

    pager.langFlag = ($scope['language'] || $attrs.language) === 'en' ? false : true;
    $scope[name] = vx.extend(pager, $scope[name] || {});
    $scope.getPagerName = function() {
      return name;
    };

    $scope.$watch(function() {
      return $scope[name];
    }, function(values) {
      if (!$scope[name]) {
        //$scope[name]=pager;
        return;
      }
      var pager = $scope[name];
      if (isNaN(pager.currentIndex)) {
        pager.currentIndex = 0;
      }
      if (isNaN(pager.curIdx)) {
        pager.curIdx = 0;
      }
      if (isNaN(pager.currentPage)) {
        pager.currentPage = 1;
      }
      if (isNaN(pager.totalPage)) {
        pager.totalPage = 0;
      }
      if (!pager.langFlag) {
        pager.langFlag = true;
      }
      if (isNaN(pager.pageSize)) {
        pager.pageSize = $attrs.pagersize ? parseInt($attrs.pagersize) : 10;
      }
      if (isNaN(pager.recordNumber)) {
        pager.recordNumber = $attrs.pagertype ? pager["List"].length : 0;
      }
      pager.totalPage = pager.recordNumber % pager.pageSize == 0 ? Math.floor(pager.recordNumber / pager.pageSize) : (Math.floor(pager.recordNumber / pager.pageSize) + 1);
      if (!pager.pageOptions || pager.pageOptions.length == 0) {
        pager.pageOptions = [];
        for (var i = 0; i < parseInt(pager.totalPage); i++) {
          var no = pager.langFlag ? '第' + (i + 1 ) + '页' : i + 1;
          pager.pageOptions.push(no);
        }
      }
    });
    $scope.topPage = function(name) {
      var pager = $scope[name];
      if (pager.currentPage > 1) {
        pager.currentIndex = 0;
        if ($attrs.pagertype)
          pager.curIdx = 0;
        pager.goPageNo = null;
        changePage(pager, name);
      };
    };
    $scope.prevPage = function(name) {
      var pager = $scope[name];
      var curIdxTemp = pager.currentIndex - pager.pageSize;
      if (curIdxTemp < 0 || pager.totalPage <= 1)
        return false;
      pager.currentIndex = curIdxTemp;
      if ($attrs.pagertype)
        pager.curIdx = curIdxTemp;
      pager.prevPageEnable = true;
      pager.goPageNo = null;
      changePage(pager, name);
    };
    $scope.nextPage = function(name) {
      var pager = $scope[name];
      var curIdxTemp = pager.currentIndex + pager.pageSize;
      if (curIdxTemp >= pager.recordNumber)
        return false;
      pager.currentIndex = curIdxTemp;
      if ($attrs.pagertype)
        pager.curIdx = curIdxTemp;
      pager.nextPageEnable = true;
      pager.goPageNo = null;
      changePage(pager, name);
    };
    $scope.bottomPage = function(name) {
      var pager = $scope[name];
      if (pager.currentPage < pager.totalPage) {
        pager.currentIndex = (pager.totalPage - 1) * pager.pageSize;
        if ($attrs.pagertype)
          pager.curIdx = (pager.totalPage - 1) * pager.pageSize;
        pager.goPageNo = null;
        changePage(pager, name);
      };
    };
    $scope.goPage = function(name) {
      var pager = $scope[name];
      var curIdxTemp = 0;
      if (!pager.goPageNo)
        return false;
      for (var i = 0; i < pager.pageOptions.length; i++) {
        if (pager.goPageNo == pager.pageOptions[i]) {
          curIdxTemp = i * pager.pageSize;
          break;
        }
      }
      //var curIdx = (pager.pageOptions.indexOf(pager.goPageNo)) * pager.pageSize;
      pager.currentIndex = curIdxTemp;
      if ($attrs.pagertype)
        pager.curIdx = curIdxTemp;
      changePage(pager, name);
      $("#selectNo" + name).find("option[value=" + pager.goPageNo + "]").attr("selected", "selected").siblings().removeAttr("selected");
      $compile($("#selectNo"+name))($scope);
    };

    $scope.goPageNum = function(name) {
      var pager = $scope[name];
      pager.totalPage = pager.recordNumber % pager.pageSize == 0 ? Math.floor(pager.recordNumber / pager.pageSize) : Math.floor(pager.recordNumber / pager.pageSize) + 1;
      pager.pageOptions = [];
      for (var i = 0; i < parseInt(pager.totalPage); i++) {
        var no = pager.langFlag ? '第' + (i + 1 ) + '页' : i + 1;
        pager.pageOptions.push(no);
      };
      pager.currentPage = 1;
      pager.currentIndex = 0;
      if ($attrs.pagertype)
        pager.curIdx = 0;
      pager.goPageNo = null;
      changePage(pager, name);
      $("#selectId" + name).find("option[value=" + pager.pageSize + "]").attr("selected", "selected").siblings().removeAttr("selected");
      $compile($("#selectId"+name))($scope);
    };

    function changePage(pager, name) {
      pager.currentPage = pager.currentIndex / pager.pageSize + 1;
      if (!$attrs.pagertype) {
        delete pager["List"];
        $remote.post($attrs.transactionid, pager, function(value) {
          $scope[name] = value['resultMap'];
        });
      }
    };
  };

  var directive = {};

  directive.uiPager = ['$compile', '$log', '$templateRequest',
  function($compile, $log, $templateRequest) {
    return {
      restrict : 'CA',
      controller : pagerController,
      // templateUrl: 'lib/template/pager/ui-pager.html',
      // transclude: true,
      // replace: true,
      // scope: false,
      compile : function(tElement, tAttrs) {
        var name = (tAttrs.uiPager || tAttrs.uiPager.length > 0) ? tAttrs.uiPager : tAttrs.name;
        var orderFlag = (tAttrs.order && tAttrs.order != 'false') ? true : false;
        var col = 0,
            bodyTr = tElement.children('tbody:first').children('tr'),
            ths = tElement.children('thead').find('th'),
            repeatTarget = bodyTr.attr('v-repeat') ? bodyTr : tElement.children('tbody:first'),
            expa = repeatTarget.attr('v-repeat');
        var url = "lib/template/pager/ui-pager.html";

        if (!expa)
          $log.error("DOM must have <tbody> & <thead>");
        // 给v-repeat指令返回的list数组，设置按什么字段（predicate）升/降排序（reverse）过滤器
        repeatTarget.attr('v-repeat', expa + '| skip:' + name + '.curIdx | limitTo:' + name + '.pageSize | orderBy:' + name + '.predicate:' + name + '.reverse');
        // 遍历tbody里td，用于生成thead的名称等属性
        vx.forEach(bodyTr.children('td'), function(elm) {
          var expc = $(elm).text(),
              exp = expc.replace(/[{}\s]/g, ""),
              name = (exp.indexOf(".") > 0 && exp.split(".").length == 2) ? exp.split(".")[1].split(/\|/)[0] : null;
          orderFlag && name && $(ths[col]).attr('order', name) && $(ths[col]).append('<span class="ui-icon ui-icon-triangle-1-s"> </span>');
          col += 1;
        });

        return {
          pre : function(scope, element, attrs, ctrl) {
            // 定义排序ORDER函数，通过改变过滤器orderBy的predicate以及reverse来达到目的
            var listenerOrder = function(ev) {
              var sort = vx.element(this).children('span');
              scope[name].predicate = vx.element(this).attr('order');
              scope[name].reverse = false;
              vx.element(this).siblings().children('span').removeClass('ui-icon-triangle-1-n ui-icon-triangle-1-s').toggleClass('ui-icon-triangle-1-s');
              if (sort.hasClass('ui-icon-triangle-1-n')) {
                scope[name].reverse = true;
                sort.removeClass('ui-icon-triangle-1-n');
                sort.toggleClass('ui-icon-triangle-1-s');
              } else {
                scope[name].reverse = false;
                sort.removeClass('ui-icon-triangle-1-s');
                sort.toggleClass('ui-icon-triangle-1-n');
              }
              // console.log('orderBy :' + grid.predicate + '
              // order: ' + grid.reverse);
              scope.$digest();
            };
            // 给表头th绑定排序ORDER函数
            vx.forEach(ths, function(elm) {
              $(elm).bind('click', listenerOrder);
            });

            $templateRequest(url, true).then(function(tfoot) {
              element.append($compile(tfoot)(scope));
            });

          }
        };
      }
    };
  }];

  mod.directive(directive);

})(window, window.vx);
