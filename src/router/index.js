import Vue from 'vue'
import Router from 'vue-router'
import Draw from '@/views/Draw.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/draw',
    },
    {
      path: '/draw',
      name: 'draw',
      component: Draw
    }
  ]
})
