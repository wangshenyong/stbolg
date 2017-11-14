BankInnerTransferCtrl.$inject=['$scope','$remote'];
function BankInnerTransferCtrl($scope,$remote){
	$scope.startup=function(){
		$scope.test="myTest!!!!";
		var params={"UserId":"007"};
		$remote.post("AccList.do",params,function(data){
			$scope.AccList=data;
			$scope.AccNo=$scope.AccList[0];
		});
	};
	//提交方法
	$scope.doPre=function(){
		var params=$scope.preForm.$getData();
		params.token="142134321";
		$remote.post("doPre.do",params,function(data){
			$scope.goto("#2");
		});
	};
	$scope.doConf=function(){
		var params=$scope.preForm.$getData();
		params.token="142134321";
		$remote.post("doConf.do",params,function(data){
			$scope.goto("#3");
		});
	}
}
