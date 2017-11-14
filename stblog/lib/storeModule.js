const showTitle = {
	state: {
		// 隐藏显示
		flag: false,
		// 组名
		title: null,
		// 标题名
		content_title: null,
		// 内容的id
		content_id: null
	},
	mutations: {
		changeFlag(state) {
			state.flag = !state.flag;
		},
		setTitle(state, title) {
			state.title = title;
			console.log("title:"+state.title);
		},
		setContent_title(state, content_title) {
			state.content_title = content_title;
		},
		setContent_id(state, content_id) {
			state.content_id = content_id;
		}
	}
};
const methods = {
	state: {
		// 1是修改,2是创建
		flag: '2'
	},
	mutations: {
		setFlag(state, flag) {
			state.flag = flag;
		}
	}
};
// 修改内容标题
const changeTitle = {
	state: {
		flag:false,
		title: null,
		title_id:null
	},
	mutations: {
		setTitle(state, title) {
			state.title = title;
		},
		changeFlag(state) {
			state.flag = !state.flag;
		},
		setTitle_id(state, title_id) {
			state.title_id = title_id;
		}
	}
}
export {showTitle, methods, changeTitle}