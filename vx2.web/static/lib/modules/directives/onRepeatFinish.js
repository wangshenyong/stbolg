/**
 * @author wbr
 * @discription 配合vRepeat指令，用于在repeat结束后冒泡一个事件。可以在嵌套repeat中使用
 * @params on-repeat-finish属性用于自定义事件名称
 *         emit-when属性是当前scope的一个方法，用于控制在什么情况下冒泡事件，返回为true则为确认冒泡
 *         emit-data属性有值时作为冒泡方法第二参数传递
 * <div v-repeat='repeatItem in list' on-repeat-finish='emitEventName' emit-when='fn(repeatItem[, $index, ...])' emit-data='someData'></div>
 */
vx.module('ui.libraries').directive('onRepeatFinish', ['$timeout',
function($timeout) {
  return {
    restrict : 'A',
    link : function(scope, element, attr) {
      var emitWhen,
          emitName,
          data;
      if (true === scope.$last) {
        emitWhen = attr.emitWhen;
        emitName = attr.onRepeatFinish || '$RepeatFinish';
        data = scope.$eval(attr.emitData);
        if (emitWhen) {
          if (scope.$eval(emitWhen)) {
            $timeout(function() {
              scope.$emit(emitName, data);
            });
          }
        } else {
          $timeout(function() {
            scope.$emit(emitName, data);
          });
        }
      }
    }
  };
}]);
