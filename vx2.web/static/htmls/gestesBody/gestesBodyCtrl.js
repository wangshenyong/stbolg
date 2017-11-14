gestesBodyCtrl.$inject = ['$scope'];

function gestesBodyCtrl($scope) {
    $scope.init = function() {
        console.log("gestesBody start");
    }
    // 导航
    $scope.navMessage = {
        nav: [
            { header: "header1", title: ["title1", "title2", "title3", "title4"] },
            { header: "header2", title: ["title1", "title2", "title3", "title4"] },
            { header: "header3", title: ["title1", "title2", "title3", "title4"] },
            { header: "header4", title: ["title1", "title2", "title3", "title4"] },
            { header: "header5", title: ["title1", "title2", "title3", "title4"] },
            { header: "header6", title: ["title1", "title2", "title3", "title4"] },
            { header: "header7", title: ["title1", "title2", "title3", "title4"] }
        ]
    }
    $scope.gotocontent = function() {
        $scope.goto("gestes.gestesContent");
    }
//view
$scope.view = function () {

	window.open("http://localhost:8089/#/views",'_blank','width:100%,height:100%,resizable=yes');
}
    $scope.changeshow = function(event) {
        var target = event.target,siblings;
        // console.log(target.nodeName);
        // console.log(siblings);
        // 重置li的class
        function resetliClass( lis ) {
        	console.log(lis);
            for (var key in lis) {
                if (lis[key].nodeName == "LI") {
                    console.log("ok:" + lis[key].className)
                    var siblingsClassName = lis[key].className.split(" ");
                    siblingsClassName[0] = "aVisited";
                    lis[key].className = siblingsClassName.join(" ");
                }
            }
        }

        // 对选择li设置选择class
        if (target.nodeName == "LI") {
            // console.log(target.className.split(" ")[0]);
            var className = target.className.split(" ");
            siblings = target.parentNode.childNodes;
            console.log(siblings);
            resetliClass( siblings );
            if (className[0] == "aVisited") {
                className[0] = "aVisited_V"
                target.className = className.join(" ");
            } else {
                className[0] = "aVisited";
                target.className = className.join(" ");
            }
        }
        //对选中的a进行li重置和class切换
        if (target.nodeName == "A") {
        	console.log("target.nextSibling :" +target.nextSibling.nextSibling.nodeName);
        	siblings = target.nextSibling.nextSibling.childNodes;
        	resetliClass( siblings );
        }

    }
}