/**
 * 配置插件懒加载资源路径[files字段]、懒加挂插件模块名称[name字段]。
 * 使用字符串进行调用，如v-lazy-load="['easypiechart']"
 */
var $vLazyLoad_Modules = [{
	name: 'easypiechart',
	files: ['lib/plugins/easy-pie-chart/angular.easypiechart.min.js']
}, {
	name: 'ngGrid',
	files: ['lib/plugins/ng-grid/ng-grid.min.js', 'lib/plugins/ng-grid/ng-grid.min.css', 'lib/plugins/ng-grid/ng-grid.bootstrap.css']
}, {
	name: 'ui.grid',
	files: ['lib/plugins/ui-grid/ui-grid.min.js', 'lib/plugins/ui-grid/ui-grid.min.css', 'lib/plugins/ui-grid/ui-grid.bootstrap.css']
}, {
	name: 'ui.calendar',
	files: ['lib/plugins/ui-calendar/fullcalendar.min.js', 'lib/plugins/ui-calendar/fullcalendar.css', 'lib/plugins/ui-calendar/fullcalendar.theme.css', 'lib/plugins/ui-calendar/calendar.js']
}, {
	name: 'ui.select',
	files: ['lib/plugins/ui-select/select.js', 'lib/plugins/ui-select/select.min.css']
}, {
	name: 'angularFileUpload',
	files: ['lib/plugins/angular-file-upload/angular-file-upload.min.js']
}, {
	name: 'ngImgCrop',
	files: ['lib/plugins/ng-img-cap/ng-img-crop.min.js', 'lib/plugins/ng-img-cap/ng-mig-crop.min.css']
}, {
	name: 'angularBootstrapNavTree',
	files: ['lib/plugins/angular-bootstrap-nav-tree/abn_tree_directive.js', 'lib/plugins/angular-bootstrap-nav-tree/abn_tree.css']
}, {
	name: 'toaster',
	files: ['lib/plugins/toaster/toaster.js', 'lib/plugins/toaster/toaster.css']
}, {
	name: 'textAngular',
	files: ['lib/plugins/textAngular/dist/textAngular-sanitize.min.js', 'lib/plugins/textAngular/dist/textAngular.min.js']
}, {
	name: 'xeditable',
	files: ['lib/plugins/angular-xeditable/dist/js/xeditable.min.js', 'lib/plugins/angular-xeditable/dist/css/xeditable.css']
}, {
	name: 'smart-table',
	files: ['lib/plugins/angular-smart-table/dist/smart-table.min.js']
}, {
	name: 'countUpModule',
	files: ['lib/plugins/countup/dist/countUp.min.js', 'lib/plugins/countup/dist/angular-countUp.min.js']
}, {
	name: 'ui.map', //依赖ui-util  ui.event(全局加载)
	files: ['lib/plugins/angular-ui-utils/event.min.js', 'lib/plugins/angular-ui-map-baidu/ui-map.js']
}, {
	name: 'pdf',
	files: ['lib/plugins/pdfjs/pdf.js', 'lib/plugins/pdfjs/pdf.worker.js', 'lib/plugins/angular-pdf-viewer/dist/angular-pdf-viewer.js', 'lib/plugins/angular-pdf-viewer/angular-pdf-viewr.css']
}, {
	name: 'pdf2',
	files: ['lib/plugins/pdfjs/pdf.js', 'lib/plugins/pdfjs/pdf.worker.js', 'lib/plugins/angularjs-pdf/angular-pdf.js', 'lib/plugins/angularjs-pdf/angular-pdf.css']
}];

/**
 * 仅仅配置插件懒加载资源路径，非模块，name随意。
 * 使用变量进行调用，如v-lazy-load="[_screenfull]"
 */
var $vLazyLoad_NoModules = {
	_iscroll: ['lib/plugins/$scrollPage/iscroll.min.js', 'lib/plugins/$scrollPage/$scrollPage.css', 'lib/plugins/$scrollPage/$scrollPage.js'],
	_sparkline: ['lib/plugins/jquery.sparkline/dist/jquery.sparkline.retina.js'],
	_flotDepend: ['lib/plugins/flot/jquery.flot.js'],
	_flot: ['lib/plugins/flot/jquery.flot.pie.js', 'lib/plugins/flot/jquery.flot.resize.js', 'lib/plugins/flot.tooltip/js/jquery.flot.tooltip.js', 'lib/plugins/flot.orderbars/js/jquery.flot.orderBars.js', 'lib/plugins/flot-spline/js/jquery.flot.spline.js'],
	_chosen: ['lib/plugins/chosen/chosen.jquery.min.js', 'lib/plugins/bootstrap-chosen/bootstrap-chosen.css'],
	_sortable: ['lib/plugins/html5sortable/jquery.sortable.js'],
	_nestable: ['lib/plugins/nestable/jquery.nestable.js', 'lib/plugins/nestable/jquery.nestable.css'],
	_dataTableDepend: ['lib/plugins/datatables/media/js/jquery.dataTables.min.js'],
	_dataTable: ['lib/plugins/integration/bootstrap/3/dataTables.bootstrap.js', 'lib/plugins/integration/bootstrap/3/dataTables.bootstrap.css'],
	_moment: ['lib/plugins/moment/min/moment-with-locales.min.js'],
	_datepicker: ['lib/plugins/bootstrap-daterangepicker/daterangepicker.js', 'lib/plugins/bootstrap-daterangepicker/daterangepicker-bs3.css'],
	//小草银行成长效果
	_xiaocao: ['lib/plugins/ui-xiaocao/zepto.min.js', 'lib/plugins/ui-xiaocao/ui-xiaoCao.js', 'lib/plugins/ui-xiaocao/css/ui-xiaocao.css'],
	//WAP版网页密码插件
	_CSII_WebPassword: ['lib/plugins/CSII.WebPassword/password-widget.min.js'],
	_vectorMapDepend: ['lib/plugins/jvectormap/jquery-jvectormap-2.0.3.min.js'],
	_vectorMap: ['lib/plugins/jvectormap/jquery-jvectormap-cn.js', 'lib/plugins/jvectormap/jquery-jvectormap-2.0.3.css'],
	_touchspin: ['lib/plugins/bootstrap-touchspin/dist/jquery.bootstrap-touchspin.min.js', 'lib/plugins/bootstrap-touchspin/dist/jquery.bootstrap-touchspin.min.css'],
	_wysiwyg: ['lib/plugins/bootstrap-wysiwyg/bootstrap-wysiwyg.js', 'lib/plugins/bootstrap-wysiwyg/external/jquery.hotkeys.js'],
	_tagsinput: ['lib/plugins/bootstrap-tagsinput/dist/bootstrap-tagsinput.js', 'lib/plugins/bootstrap-tagsinput/dist/bootstrap-tagsinput.css'],
	_footable: ['lib/plugins/footable/dist/footable.all.min.js', 'lib/plugins/footable/css/footable.core.css'],
	_qrcode: ['lib/plugins/jquery-qrcode/jquery.qrcode.js'],
	_uiselectsearch: ['lib/plugins/ui-selectsearch/jquery.nicescroll.js', 'lib/plugins/ui-selectsearch/TextSearch.js', 'lib/plugins/ui-selectsearch/ui-selectSearch.js'],
	_chartService: ['lib/plugins/chart/Chart.js', 'lib/plugins/chart/$chartService.js', 'lib/plugins/chart/chartService.css'],
	_discdraw: ['lib/plugins/ui-discdraw/jQueryRotate.2.2.js', 'lib/plugins/ui-discdraw/ui-discdraw.js', 'lib/plugins/ui-discdraw/ui-discdraw.css'],
	_hammeregg: ['lib/plugins/ui-hammeregg/ui-hammeregg.js', 'lib/plugins/ui-hammeregg/ui-hammeregg.css'],
	_rollernie: ['lib/plugins/ui-rollernie/ui-rollernie.js', 'lib/plugins/ui-rollernie/ui-rollernie.css'],
	_fullpage: ['lib/plugins/fullpage/jquery-ui-1.10.3.min.js', 'lib/plugins/fullpage/jquery.fullpage.js', 'lib/plugins/fullpage/jquery.fullpage.css', 'lib/plugins/fullpage/fullpage.css'],
	_alphabet: ['lib/plugins/alphabet/alphabet.css'],
	_slideslip: ['lib/plugins/touch/touch.js', 'lib/plugins/sideslip/sideslip.css'],
	_guacard: ['lib/plugins/guacard/wScratchPad.js', 'lib/plugins/guacard/GuaCard.css'],
	_uiscale: ['lib/plugins/ui-scale/ui-scale.js', 'lib/plugins/ui-scale/ui-scale.css'],
	_uicarousel: ['lib/plugins/ui-carousel/ui-carousel.js', 'lib/plugins/ui-carousel/ui-carousel.css'],
	_uicarousel2: ['lib/plugins/ui-carousel/ui-carousel2.js', 'lib/plugins/ui-carousel/ui-carousel2.css'],
	_uicarousel3: ['lib/plugins/ui-carousel/ui-carousel3.js', 'lib/plugins/ui-carousel/ui-carousel3.css'],
	_uiYaojiang: ['lib/plugins/ui-yaojiang/ui-yaoJiang.js', 'lib/plugins/ui-yaojiang/ui-yaoJiang.css'],
	_sildeslipMenu: ['lib/plugins/sideslip-menu/sildeslip-menu.css'],
	_scrollBall: ['lib/plugins/scrollBall/ScrollBall.js'],
	_uismashegg: ['lib/plugins/ui-smashegg/ui-smashegg.js', 'lib/plugins/ui-smashegg/ui-smashegg.css'],
	_uicountdown: ['lib/plugins/ui-countdown/jquery.downCount.js', 'lib/plugins/ui-countdown/ui-countdown.js'],
	_uicountup: ['lib/plugins/ui-countup/ui-countup.js'],
	_takephoto: ['lib/plugins/takephoto/lrz.all.bundle.js', 'lib/plugins/takephoto/takePhoto.js'],
	_uiselect2: ['lib/plugins/ui-select2/jquery.select.js', 'lib/plugins/ui-select2/ui-select2.js', 'lib/plugins/ui-select2/ui-select2.css'],
	_popup: ['lib/plugins/actionsheet/actionsheet.js', 'lib/plugins/actionsheet/actionsheet.css'],
	_echarts: ['lib/plugins/echarts/echarts.min.js', 'lib/plugins/echarts/echarts.css'],
	_swiper: ['lib/plugins/swiper/swiper-3.4.2.jquery.min.js', 'lib/plugins/swiper/swiper-3.4.2.min.css', 'lib/plugins/swiper/swiper_page.css']
};

if (typeof(exports) != "undefined") {
	exports.lazyLoad_Modules=$vLazyLoad_Modules;
	exports.lazyLoad_NoModules=$vLazyLoad_NoModules;
} else {
	vx.module('ibsapp').config(['$vLazyLoadProvider', // vlazyload config
		function($vLazyLoadProvider) {
			$vLazyLoadProvider.config({
				debug: true,
				events: true,
				modules: $vLazyLoad_Modules
			});
		}
	]).run(['$rootScope',
		function($rootScope) {
			vx.extend($rootScope, $vLazyLoad_NoModules);
		}
	]);
}
