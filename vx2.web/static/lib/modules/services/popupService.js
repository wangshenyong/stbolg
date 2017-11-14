(function(window, vx, undefiend) {
	var services = {};

	services.$popupService = ['$log',
	function($log) {
		
		var toElement = (function() {
			var div = document.createElement('div');
			return function(html) {
				div.innerHTML = html;
				var element = div.firstChild;
				div.removeChild(element);
				return element;
			};
		})();
		var popupDiv,shadowDiv=toElement('<div class="zzc"></div>');
		return {
			open : function(divId, width, height) {
				popupDiv = $('#' + divId);
				popupDiv.addClass('tcc');
				if(width !=null){
					popupDiv.css('width',width);
					popupDiv.css("left",(816-width)/2);
				}
				if(height !=null){
					popupDiv.css('height',height);
					popupDiv.css('top',(417-height)/2);
				}
				;
				if($('.zzc').length==0){
					var wrapper = popupDiv.parent();
					wrapper.append(shadowDiv);
					shadowDiv=$('.zzc');
				}
				var closeBtn = '<i class="icon-remove"></i>';
				popupDiv.append(closeBtn);
				popupDiv.find('i').bind('click', function() {
					popupDiv.hide();
					shadowDiv.hide();
				});
				shadowDiv.show();
				popupDiv.show();}
			,
			close : function() {
				popupDiv.hide();
				shadowDiv.hide();
			}
		};
	}];

	vx.module('ui.libraries').factory(services);

})(window, vx);
