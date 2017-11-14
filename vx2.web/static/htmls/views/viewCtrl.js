viewCtrl.$inject = ["$scope"];

function viewCtrl ( $scope ) {
	$scope.init = function () {
		console.log( "view" );
	}

	$scope.gotoI = function () {
		$scope.message ='&lt;h1&gtsdfsdfsdf&lth1&gt';
		$scope.goto("#2");
	}
}