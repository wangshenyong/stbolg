import Vue from 'vue'
import App from './App'
import router from './router'
import remote from '../lib/remote.js'
import VueQuillEditor from 'vue-quill-editor'
import Vuex from 'Vuex'
import { showTitle, methods, changeTitle} from '../lib/storeModule.js'

Vue.use(Vuex);
Vue.use(VueQuillEditor);
Vue.config.productionTip = false
Vue.prototype.remote = remote(Vue);
console.log("showTitle："+JSON.stringify(showTitle))
/* eslint-disable no-new */
var bus = new Vue();
window.bus = bus;
// vuex配置
const store = new Vuex.Store({

  modules: {
    // 上传编辑博文弹出层
    showTitle: {
      namespaced: true,
      state: showTitle.state,
      mutations: showTitle.mutations
    },
    methods: {
    	namespaced: true,
    	state: methods.state,
    	mutations: methods.mutations
    },
    changeTitle: {
      namespaced: true,
      state: changeTitle.state,
      mutations: changeTitle.mutations
    }
  }
});
console.log("showTitle："+JSON.stringify(store.state.showTitle.flag))
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
