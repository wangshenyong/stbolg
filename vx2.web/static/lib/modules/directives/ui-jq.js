'use strict';
vx.module('ui.libraries').directive('uiJq', ['$timeout', function ($timeout) {

	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			// Call jQuery method and pass relevant options
			function callPlugin() {
				var pluginOptions, pluginName;
				pluginOptions = scope.$eval(attrs.jqOptions);
				if (pluginOptions && !vx.isArray(pluginOptions)) {
					pluginOptions = [pluginOptions];
				}
				pluginName = attrs.uiJq;
				$timeout(function () {
					if(element[pluginName]===undefined){
						throw Error("please load the plugin which name is \'" + pluginName + "\' before use it!!!!");
					}
					element[pluginName].apply(element, pluginOptions);
				}, 0, false);
			}

			function refresh() {
				// If ui-refresh is used, re-fire the the method upon every change
				if (attrs.uiRefresh) {
					scope.$watch(attrs.uiRefresh, function () {
						callPlugin();
					});
				}
			}

			callPlugin();
			refresh();
		}
	};
}]);