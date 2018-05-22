export const scanRouter = [
  {
    path: '/scan',
    component: r => require.ensure([], () => r(require('src/components/scan/home')), 'group-scan'),
    children: [
      {
          path: 'actvList',
          name: 'scanActivityList',
          component: r => require.ensure([], () => r(require('src/components/scan/activityList')), 'group-scan')
      },{
          path: 'scanner',
          name: 'scanner',
          component: r => require.ensure([], () => r(require('src/components/scan/scanner')), 'group-scan')
      },{
          path: 'checkList',
          name: 'scanCheckList',
          component: r => require.ensure([], () => r(require('src/components/scan/checkList')), 'group-scan')
      },
      {
          path: 'checkDiffDetail',
          name: 'scanCheckDiffDetail',
          component: r => require.ensure([], () => r(require('src/components/scan/checkDiffDetail')), 'group-scan')
      },
      {
          path: 'edit',
          name: 'scanEdit',
          component: r => require.ensure([], () => r(require('src/components/scan/edit')), 'group-scan')
      }
    ]
  }
]
