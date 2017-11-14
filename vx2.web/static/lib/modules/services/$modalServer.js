(function(window, vx, undefined) {'use strict';
	var mod = vx.module("ui.libraries");
	mod.controller('ModalInstanceCtrl', ['$scope', '$modalInstance', 'items',
		function($scope, $modalInstance, items) {
			vx.extend($scope, items);
			$scope.$root.$modalClose = function() {
				$modalInstance.close();
			};
			$scope.cancel = function() {
				$modalInstance.dismiss('cancel');
			};
		}]);
	mod.service("$modalServer", ['$rootScope', '$modal','$log',
	function($rootScope, $modal,$log) {
		
		return {
			"open" : function(options) {
				options.controller = 'ModalInstanceCtrl';
				var modalInstance = $modal.open(options);
				modalInstance.result.then(function() {
					//$scope.gotoLocation("login.html");
					$log.info('Modal ok at: ' + new Date());
				}, function() {
					$log.info('Modal dismissed at: ' + new Date());
				});
			}
		};

	}]);

})(window, vx);