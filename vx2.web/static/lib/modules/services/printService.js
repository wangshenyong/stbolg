/*jshint smarttabs:true, eqeqeq:false, eqnull:true, laxbreak:true */
/**
 * 打印的服务，里面的样式是为了美化传来的页面参数，如不需要可删除
 * @author yoyo
 */
(function(window, vx, undefiend) {

    function $printProvider() {
        this.$get = [
            function() {
                return function print(html) {
                    if (vx.msie !== 7) {
                        if ($(".PrintStartMark")[0]) {
                            var $parentOrg = $(".PrintStartMark").parent(),
                                $parentCln;
                            var $html = $(html);
                            $html.find("*").css("font-size", "20px");
                            $html.find(".current > .pos").css("font-size", "18px");
                            $html.find(".current>span").not(".pos").css('float', 'right');
                            $html.find(".jycg_r").css('float', 'right');
                            $html.find(".zz_right").css('top', '20%');
                            $html.find(".zz_right").css('right', '3%');
                            html = $html[0].outerHTML;
                            html = $("<div style='width:1024px;font-size:20px;'></div>").append(html)[0].outerHTML;
                            while ($parentOrg[0].nodeName !== "BODY") {
                                $parentCln = $parentOrg.clone(false, false);
                                $parentCln = $parentCln.empty();
                                $parentCln = $parentCln.append(html);
                                html = $parentCln[0].outerHTML;
                                $parentOrg = $parentOrg.parent();
                            }
                        }
                    } else if (vx.msie == 7) {
                        var $html = $(html);
                        $html.find("*").css("font-size", "20px");
                        $html.find(".current>span").not(".pos").css('*float', 'right');
                        $html.find(".current>span span").css('*padding-right', '20px');
                        $html.find(".jycg_r").css('*float', 'right');
                        $html.find(".zz_right").css('*top', '20%');
                        $html.find(".zz_right").css('*right', '3%');
                        $html.find(".current > .pos").css("font-size", "18px");
                        html = $html[0].outerHTML;
                        html = $("<div class='right height530' style='width:1100px;'></div>").append(html)[0].outerHTML;

                        html = $("<div style='width:1100px;font-size:20px;'></div>").append(html)[0].outerHTML;

                        html = $("<div class='content_main' style='position:relative;width:1100px;'></div>").append(html)[0].outerHTML;
                        html = $(html)[0].outerHTML;
                    }
                    var toElement = (function() {
                        var div = document.createElement('div');
                        return function(html) {
                            div.innerHTML = html;
                            var element = div.firstChild;
                            div.removeChild(element);
                            return element;
                        };
                    })();
                    var st = new Array();
                    st.push('<head><meta  charset="utf-8" />');
                    // $(document).find("link").filter(function() {
                    // 	return $(this).attr("rel").toLowerCase() == "stylesheet";
                    // }).each(function() {
                    // 	st.push('<link type="text/css" rel="stylesheet" href="' + $(this).attr("href") + '" >');
                    // });
                    st.push('</head>');
                    st.push('<body>');
                    st.push(html);
                    st.push('</body>');
                    var iframe;
                    if (vx.msie !== 7) {
                        if (document.getElementById('print')) {
                            iframe = document.getElementById('print');
                        } else {
                            iframe = toElement('<iframe src="javascript:false;" name="print" id="print"></iframe>');
                            iframe.style.display = 'none';
                            window.document.body.appendChild(iframe);
                        }
                        iframe.contentDocument.open();
                        iframe.contentDocument.write(st.join(''));
                        iframe.contentDocument.close();

                        if (vx.msie || (!!window.ActiveXObject || "ActiveXObject" in window)) {
                            iframe.contentDocument.execCommand('Print');
                        } else if (frames['print'].length === 0) { //FF
                            //iframe.contentDocument.execCommand('Print');
                            document.getElementById('print').focus();
                            document.getElementById('print').contentWindow.print();
                        } else {
                            frames['print'].print();
                        }
                    }
                    /*st.push('</html>');*/
                    if (vx.msie && vx.msie == 7) {
                        var ele = toElement(st.join(''));
                        if ($(ele).find(".dzhzdt")) {
                            $(ele).find(".dzhzdt").css("width", "1100px").css("position", "absolute").css("top", "0px").css("left", "0px");
                        }
                        $(ele).printArea({
                            mode: 'popup'
                        });

                        return;
                    }
                    //$(iframe).remove();
                };
            }
        ];
    }


    vx.module('ui.libraries').provider({
        $print: $printProvider
    });
})(window, vx);
