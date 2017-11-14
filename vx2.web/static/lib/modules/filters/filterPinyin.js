(function (window, vx) {
	vx.module('ui.libraries').filter('filterPinyin', function () {
		return function (inputArray, key, value) {
			var array = []; //定义返回的新数组；
			if (value == undefined || value == null) {
				array = inputArray; //当过滤条件为空的时候返回全部的内容；
			} else {
				for (var i = 0; i < inputArray.length; i++) {
					var temp = inputArray[i];
					if (temp[key].indexOf(value) != -1) {
						array.push(temp);//过滤第一个字段，如果不符合条件则判断第二个字段
					} else {
						if (window.CC2PY && /^[A-z]+$/.test(value)) {
							var pinyin = window.CC2PY(temp[key]);
							var pinyinStr = pinyin[0];
							if (pinyinStr.indexOf(value.toUpperCase()) == 0) {
								array.push(temp);
							}
						}
					}
				}
			}
			return array;
		}
	});
})(window, vx);