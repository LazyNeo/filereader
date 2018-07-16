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
