ibsapp.directive("uiSlideToggle", function () {
    return {
        restrict: 'A',
        link: function (scope, element) {
            element.bind("click", function (event) {
                var target = event.target;
                if ($(target).hasClass("level1")) {
                    var level2_ul = $(target).next();
                    if (level2_ul.is(":visible")) {
                        level2_ul.slideUp();
                        $(target).parent().removeClass("active");
                    } else {
                        $(target).parent().parent().find("li").removeClass("active");
                        $(target).parent().parent().find("ul.nav").slideUp();
                        $(target).parent().find("ul.nav").slideDown();
                        $(target).parent().addClass("active");
                    }
                } else if ($(target).hasClass("level2")) {
                    $(target).parent().parent().children().removeClass("active");
                    $(target).parent().addClass("active");
                }
            });
        }
    }
});
ibsapp.run(['$rootScope', '$log', '$window', function ($rootScope, $log, $window) {
    $rootScope.$on('$stateChangeStart', function (event) {
        NProgress.start();  //第一个进度节点
        $log.debug("1.$stateChangeStart");
    });
    $rootScope.$on('$viewContentLoading', function (event) {
        $log.debug('2.$viewContentLoading');
        NProgress.inc();  //第二个进度节点
    });

    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState) {
        NProgress.inc(0.5);//第三个进度节点
        var listener = event.targetScope.$watch('$viewContentLoaded', function () {
            listener();
            $log.debug('4.$viewContentLoaded');
	        setTimeout(function () {
		        NProgress.done();  //第四个进度节点
	        }, 200);
            $window.scrollTo(0, 0);
        });
        $log.debug("3.$stateChangeSuccess");
    });
    $rootScope.$on("$stateChangeError", function () {
	    setTimeout(function () {
		    NProgress.done(); //last进度节点
	    },200);
        $window.scrollTo(0, 0);
    });
}]);
