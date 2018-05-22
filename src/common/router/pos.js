export const posRouter = [
  {
    path: '/pos',
    component:  r => require.ensure([], () => r(require('src/components/pos/router')), 'group-pos'),
    children: [
      {
        path: 'home',
        name: 'posHome',
        component:  r => require.ensure([], () => r(require('src/components/pos/home')), 'group-pos')
      },
      {
        path: 'pay',
        name: 'posPay',
        component:  r => require.ensure([], () => r(require('src/components/pos/pay')), 'group-pos')
      },
      {
        path: 'pay/result',
        name: 'posPayResult',
        component:  r => require.ensure([], () => r(require('src/components/pos/payResult')), 'group-pos')
      }
    ]
  }
]
