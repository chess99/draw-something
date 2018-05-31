import Vue from 'vue'
import Router from 'vue-router'
// import Home from './views/Home.vue'
import About from './views/About.vue'
import Draw from './views/Draw.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/draw',
      // component: Home
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },
    {
      path: '/draw',
      name: 'draw',
      component: Draw
    }
  ]
})
