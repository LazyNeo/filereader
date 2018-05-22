import {posRouter} from './router/pos'
export const routes = [
  {
  	path: '/',
    name: 'index',
    // 重定向至登陆页面
    redirect: '/sync/home'
  },
  {
    path: '/sync',
    component: 'src/components/sync/router',
    children: [
      {
        path: 'home',
        name: 'syncHome',
        component:  'src/components/sync/home',
      },
      {
        path: 'print',
        name: 'syncPrintList',
        component:  'src/components/sync/printList',
      }
    ]
  },
  {
  	path: '/admin/login',
    name: 'adminLogin',
    component: 'src/components/login',
    meta: {
      // 标记不需要登陆
      notRequiresAuth: true
    }
  },
  {
  	path: '/update',
    name: 'update',
    component: 'src/components/update',
    meta: {
      // 标记不需要登陆
      notRequiresAuth: true
    }
  },
  {
  	path: '/admin/autoLogin',
    name: 'adminAutoLogin',
    component: 'src/components/autoLogin',
    meta: {
      // 标记不需要登陆
      notRequiresAuth: true
    }
  },
  {
  	path: '/set',
    name: 'setHome',
    component: 'src/components/set/home',
    meta: {
      // 标记不需要登陆
      notRequiresAuth: true
    }
  },
  {
  	path: '/home',
    name: 'generalHome',
    component: 'src/components/home',
    meta: {
      // 标记不需要登陆
      notRequiresAuth: true
    }
  },
  {
  	path: '/submit',
    name: 'submitAuth',
    component: 'src/components/submit',
    meta: {
      // 标记不需要登陆
      notRequiresAuth: true
    }
  },
  {
    path: '/plugin/alert',
    name: 'pluginAlert',
    component: 'src/components/plugin/alert',
    meta: {
      notRequiresAuth: true
    }
  },
  {
    path: '/plugin/confirm',
    name: 'pluginConfirm',
    component: 'src/components/plugin/confirm',
    meta: {
      notRequiresAuth: true
    }
  },
  {
    path: '/hint',
    name: 'hint',
    component: 'src/components/hint',
    meta: {
      notRequiresAuth: true
    }
  },
  {
    path: '/error',
    name: 'error',
    component: 'src/components/error',
    meta: {
      notRequiresAuth: true
    }
  },
  // ...posRouter,
  {
    path: '/*',
    name: 'notFound',
    component: 'src/components/error',
    meta: {
      notRequiresAuth: true
    }}
]
