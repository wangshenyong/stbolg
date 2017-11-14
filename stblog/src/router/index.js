import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import gestesIndex from '@/components/gestes/gestesIndex'
import admin from '@/components/admin/adminIndex'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/gestesIndex',
      name: 'gestesIndex',
      component: gestesIndex
    },
    {
      path: '/admin',
      name: 'admin',
      component: admin
    }
  ]
})
