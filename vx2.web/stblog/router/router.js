const util = require('util');
const gestesRoute = require('./gestesRoute');
const adminRoute = require('./adminRoute');
// 全部路由配置
function route_app(){
	var route = {
		gestesRoute,
		adminRoute
	};
	return route;
}

module.exports = route_app();