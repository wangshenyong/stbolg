'use strict';
vx.module('ibsapp').directive('uiImgpreview', ['$window',
function($window) {
	var helper = {
		support : !!($window.FileReader && $window.CanvasRenderingContext2D),
		isFile : function(item) {
			return vx.isObject(item) && item instanceof $window.File;
		},
		isImage : function(file) {
			var type = '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
			return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
		}
	};
	return {
		restrict : 'A',
		link : function(scope, element, attributes) {
			var params = scope.$eval(attributes.uiImgpreview);
			if (!helper.support) {

				var filepath = params.file && params.file[0] && params.file[0].value;
				if ('|jpg|png|jpeg|bmp|gif|'.indexOf(filepath.substr(-3)) === -1) {
					return;
				}

				var file_upl = params.file[0];
				file_upl.style.display = "block";
				file_upl.select();
				if (top != self) {
					window.parent.document.body.focus();
				} else {
					file_upl.blur()
				}
				var realpath = document.selection.createRange().text;
				document.selection.empty();
				var divDom = $("<div><img /></div>");

				element.append(divDom);

				divDom.css({
					'filter' : 'progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)',
					'height' : params.height,
					'width' : params.width
				});
				divDom[0].filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = realpath;
				file_upl.style.display = "none";
				//return;
			} else {
				if (!helper.isFile(params.file))
					return;
				if (!helper.isImage(params.file))
					return;
				var canvas = document.createElement('canvas');
				element.append(canvas);
				var reader = new FileReader();

				reader.onload = function(event) {
					var img = new Image();
					img.onload = onLoadImage;
					img.src = event.target.result;
				}
				reader.readAsDataURL(params.file);
				var onLoadImage = function onLoadImage() {
					var width = params.width || this.width / this.height * params.height;
					var height = params.height || this.height / this.width * params.width;
					$(canvas).attr({
						width : width,
						height : height
					});
					canvas.getContext('2d').drawImage(this, 0, 0, width, height);
				}
			}
		}
	};
}]); 