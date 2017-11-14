/*图片上传  开始*/
/**
 * @author wbr
 * 拍照上传base64
 * @param {String} inputId 类型为file的input的id
 * @param {String} picWarpId 可选参数，默认undefined。用于盛放照片缩略图的容器元素id。
 *                           如果没有，则认为不自动显示缩略图，需要手动显示。可配合callback
 * @param {Function} callback 可选参数，默认undefined。照片base64生成完成后的回调函数。
 * @return {Object} 返回对象obj
 *  obj.getList() 返回所有照片的base64和base64Length
 *  obj.clear() 清除所有照片
 * */
(function (window, vx, undefined) {
	'use strict';
	var factory = {};
	factory.$takePhoto = ["$rootScope",
		function ($rootScope) {
			return function (inputId, picWarpId, uploadNum, options, callback) {
				if (typeof picWarpId === 'function') {
					callback = picWarpId;
					picWarpId = undefined;
				}
				var photoList = [];
				var fileInput = document.getElementById(inputId);
				var temp = [];
				temp[0] = "<div class='avatar' id='avatar_";
				temp[1] = "'><img /><span class='close' id='avatar_close_";
				temp[2] = "'></span></div>";
				//图片id和计数
				var count = 0;
				var r = Math.random().toString().split(".")[1];
				//用于计算删除次数。配合count来正确photoList.splice()
				var delList = [];
				var delTimesLittleThan = function (num) {
					var times = 0;
					for (var i = 0; i < delList.length; i++) {
						if (delList[i] < num) {
							times++;
						}
					}
					return times;
				};
				fileInput.onchange = function () {
					if (!this.files[0]) {
						return false;
					}
					//多张图片
					if (this.files[0].size > 5 * 1024 * 1024) {//图片大小不超过5M
						NativeCall.showErr("请上传不大于5M的图片");
						return;
					}
					//图片类型
					if ((this.files[0].type.split("/")[1] != 'jpg') && (this.files[0].type.split("/")[1] != 'jpeg') && (this.files[0].type.split("/")[1] != 'png')) {
						NativeCall.showErr("请上传jpg,png,jpeg类型的图片");
						return;
					}
					$("#AJAXMASK").show();
					//如果自动显示，则添加dom及相应绑定事件
					//if (!vx.isEmpty(picWarpId)) {
					if (picWarpId) {
						if (photoList.length > (parseInt(uploadNum) - 1)) {
							NativeCall.showErr("评论图片最多上传" + uploadNum + "张");
							return;
						}
						var avatar = temp[0] + r + "_" + count + temp[1] + r + "_" + count + temp[2];
						$("#" + picWarpId).append(avatar);
						var $avatarImg = $("#avatar_" + r + "_" + count).find("img");
						var $avatarBtn = $("#avatar_close_" + r + "_" + count);
						$avatarBtn.on('click', function () {
							var count = this.id.split("_")[3];
							count = parseInt(count, 10);
							delList.push(count);
							var delTimes = delTimesLittleThan(count);
							photoList.splice(count - delTimes, 1);
							//清空图片名，防止误删除选同样文件不触发change事件
							fileInput.value = "";
							$("#avatar_" + r + "_" + count).remove();
							//删除单张图片后显示上传器
							$("#picUpload").show();
						});
						count++;
					}

					/*
					 [options] 这个参数允许忽略
					 width {Number} 图片最大不超过的宽度，默认为原图宽度，高度不设时会适应宽度。
					 height {Number} 同上
					 quality {Number} 图片压缩质量，取值 0 - 1，默认为0.7
					 fieldName {String} 后端接收的字段名，默认：file
					 */
					lrz(this.files[0], vx.extend({
						width: 800,
						quality: 0.5
					}, options)).then(function (rst) {
						//var obj = {};
						//obj.base64 = rst.base64.split(",")[1];
						//obj.base64Length = obj.base64.length;
						var str = [];//转换为字符串形式
						str = rst.base64.split(",")[1];
						photoList.push(str);
						//图片上传时上传X张后隐藏上传器
						if (photoList.length == uploadNum) {
							$("#picUpload").hide();
						}
						//if (!vx.isEmpty(picWarpId)) {
						if (picWarpId) {
							$avatarImg.attr("src", rst.base64);
						}
						if (typeof callback === 'function') {
							callback(inputId);
						}
						$("#AJAXMASK").hide();
					}).catch(function (err) {
						$("#AJAXMASK").hide();
						NativeCall.showErr(err);
					});
				};
				return {
					getList: function () {
						return photoList;
					},
					clear: function () {
						photoList = [];
						//if (!vx.isEmpty(picWarpId)) {
						if (picWarpId) {
							$("#" + picWarpId).find(".avatar").remove();
						}
					}
				};
			};
		}];
	vx.module('ibsapp').factory(factory);

})(window, window.vx);