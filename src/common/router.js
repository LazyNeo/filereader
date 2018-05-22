import {umsposRouter} from './router/umspos'
import {posRouter} from './router/pos'
export const routes = [
  {
  	path: '/',
    name: 'index',
    // 重定向至登陆页面
    redirect: '/chenshidan/home'
  },
  {
    path: '/chenshidan',
    component: r => require.ensure([], () => r(require('src/components/chenshidan/router')), 'group-sync'),
    children: [
      {
        path: 'home',
        name: 'chenshidanHome',
        component:  r => require.ensure([], () => r(require('src/components/chenshidan/home')), 'group-sync')
      },
      {
        path: 'item',
        name: 'chenshidanItem',
        component:  r => require.ensure([], () => r(require('src/components/chenshidan/item')), 'group-sync')
      }
    ]
  },
  {
  	path: '/admin/login',
    name: 'adminLogin',
    component: r => require.ensure([], () => r(require('src/components/login')), 'group-base'),
    meta: {
      // 标记不需要登陆
      notRequiresAuth: true
    }
  },
  {
  	path: '/admin/autoLogin',
    name: 'adminAutoLogin',
    component: r => require.ensure([], () => r(require('src/components/autoLogin')), 'group-base'),
    meta: {
      // 标记不需要登陆
      notRequiresAuth: true
    }
  },
  {
  	path: '/set',
    name: 'setHome',
    component: r => require.ensure([], () => r(require('src/components/set/home')), 'set-base'),
    meta: {
      // 标记不需要登陆
      notRequiresAuth: true
    }
  },
  {
  	path: '/home',
    name: 'generalHome',
    component: r => require.ensure([], () => r(require('src/components/home')), 'group-base'),
    meta: {
      // 标记不需要登陆
      notRequiresAuth: true
    }
  },
  {
  	path: '/submit',
    name: 'submitAuth',
    component: r => require.ensure([], () => r(require('src/components/submit')), 'group-base'),
    meta: {
      // 标记不需要登陆
      notRequiresAuth: true
    }
  },
  {
    path: '/plugin/alert',
    name: 'pluginAlert',
    component: r => require.ensure([], () => r(require('src/components/plugin/alert')), 'group-base-outer'),
    meta: {
      notRequiresAuth: true
    }
  },
  {
    path: '/plugin/confirm',
    name: 'pluginConfirm',
    component: r => require.ensure([], () => r(require('src/components/plugin/confirm')), 'group-base-outer'),
    meta: {
      notRequiresAuth: true
    }
  },
  // ...feedRouter,
  // ...feedAdminRouter,
  {
    path: '/hint',
    name: 'hint',
    component: r => require.ensure([], () => r(require('src/components/hint')), 'group-base-outer'),
    meta: {
      notRequiresAuth: true
    }
  },
  {
    path: '/error',
    name: 'error',
    component: r => require.ensure([], () => r(require('src/components/error')), 'group-base'),
    meta: {
      notRequiresAuth: true
    }
  },
  ...posRouter,
  ...umsposRouter,
  {
    path: '/*',
    name: 'notFound',
    component: r => require.ensure([], () => r(require('src/components/error')), 'group-base'),
    meta: {
      notRequiresAuth: true
    }}
]
