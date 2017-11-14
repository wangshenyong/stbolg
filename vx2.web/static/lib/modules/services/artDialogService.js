/*jshint smarttabs:true, eqeqeq:false, eqnull:true, laxbreak:true */
/**
 * 弹框，
 * 需要依赖artDialog.js插件以及其样式
 * @author wangjian
 */
(function(window, vx, undefiend) {
    var services = {};

    services.$artDialogService = ['$log',
        function($log) {
            return {
                open: function(dialogId, div, title, width, height, dragFlag) {
                    art.dialog({
                        id: dialogId,
                        content: div,
                        title: title,
                        width: width,
                        height: height,
                        //cancel : closeFlag,
                        fixed: true,
                        lock: true,
                        drag: (dragFlag === null ? true : dragFlag),
                        resize: false, //禁止放大缩小窗口
                        opacity: 0.1
                    });
                },
                close: function(id) {
                    art.dialog.list[id].close();
                }
            };
        }
    ];

    vx.module('ui.libraries').factory(services);

})(window, vx);
