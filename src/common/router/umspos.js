export const umsposRouter = [
  {
    path: '/umspos',
    component:  r => require.ensure([], () => r(require('src/components/umspos/router')), 'group-umspos'),
    children: [
      {
        path: 'welcome',
        name: 'umsposWelcome',
        component:  r => require.ensure([], () => r(require('src/components/umspos/welcome')), 'group-umspos')
      },
      {
        path: 'guide',
        name: 'umsposGuide',
        component:  r => require.ensure([], () => r(require('src/components/umspos/guide')), 'group-umspos')
      },
      {
        path: 'home',
        name: 'umsposHome',
        component:  r => require.ensure([], () => r(require('src/components/umspos/home')), 'group-umspos')
      },
      {
        path: 'pay',
        name: 'umsposPay',
        component:  r => require.ensure([], () => r(require('src/components/umspos/pay')), 'group-umspos')
      },
      {
        path: 'log',
        name: 'umsposLog',
        component:  r => require.ensure([], () => r(require('src/components/umspos/log')), 'group-umspos')
      },
      {
        path: 'pay/result',
        name: 'umsposPayResult',
        component:  r => require.ensure([], () => r(require('src/components/umspos/payResult')), 'group-umspos')
      }
    ]
  }
]
