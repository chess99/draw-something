import Vue from 'vue'
import Router from 'vue-router'

import Draw from '@/views/Draw'
import Audience from '@/views/Audience'
import Role from '@/views/Role'
import Bixin from '@/views/Bixin'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/draw',
    },
    {
      path: '/role',
      name: 'role',
      component: Role
    },
    {
      path: '/draw',
      name: 'draw',
      component: Draw
    },
    {
      path: '/audience',
      name: 'audience',
      component: Audience
    },
    {
      path: '/bixin',
      name: 'bixin',
      component: Bixin
    }
  ]
})
