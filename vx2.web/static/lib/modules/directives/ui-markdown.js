(function (window, vx) {
	vx.module('ibsapp').directive('pre', ['$location', '$compile', function ($location, $compile) {
		return {
			restrict: 'E',
			terminal:true,
			compile: function (element) {
				//var content = $(element).html();
				//element.html(content);
				return function (scope,element,attr){
					if(attr.compile){
						$compile(element.contents())(scope);
					}
				}
			}
		};
	}]);
})(window, vx);
