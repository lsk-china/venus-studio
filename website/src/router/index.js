import Vue from 'vue'
import Router from 'vue-router'
import index from '../components/index'
import work from '../components/work'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index,
      keepAlive: false
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../components/login')
    },
    {
      path: '/user',
      name: 'user',
      component: () => import('../components/user')
    },
    {
      path: '/work/:wid?',
      name: 'work',
      component: work
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../components/register')
    },
    {
      path: '/doneRegister',
      name: 'doneRegister',
      component: () => import('../components/doneRegister')
    },
    {
      path: '/works',
      name: 'works',
      component: () => import('../components/works')
    }
  ]
})
