function remote() {
  var remote = {};
  var xmlHttp = null;

  // 创建xmlHttp
  try {
    xmlHttp = new XMLHttpRequest();
  } catch (e) {
    try {
      xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {

      try {
        xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
      } catch (e) {
        return null;
      }
    }
  }
  if(xmlHttp)
  // remote执行前执行
  remote.before = function(goback, params) {
  	if(goback) {
  			goback(params);
  	}
  };
// remote执行后
  remote.after = function(goback, params) {
  	if(goback) {
  		goback(params);
  	}
  }
// remote执行体
	remote.run = function(url, params, goback, methods) {
		remote.before();
      	xmlHttp.open(methods, url, true);
        xmlHttp.setRequestHeader("Content-Type", "application/json");
       // xmlHttp.setRequestHeader('X-Custom-Header', 'application/json');
        // xmlHttp.withCredentials = true;
        // var temp = {name:"wang",passoword:"password"};
        xmlHttp.send(params);
      	xmlHttp.onreadystatechange = function() {
      		if(xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      			remote.after();
            // console.log("json: "+xmlHttp.responseText)
      			goback(xmlHttp.responseText);
      		}
      	};
	}
// 如果xml存在初始化remote
  if(xmlHttp) {
      remote.get = function(url, params, goback) {
      	remote.run(url,null, goback, 'GET');
      };
      remote.post = function(url, params, goback) {
      	remote.run(url, params, goback, 'POST');
      }
  }
  return remote;
}

