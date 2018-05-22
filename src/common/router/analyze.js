export const supplierRouter = [
  {
    path: '/analyze',
    component: r => require.ensure([], () => r(require('src/components/analyze/router')), 'group-analyze-supplier'),
    children: [
      {
          path: 'supplierApply',
          name: 'supplier/apply',
          component: r => require.ensure([], () => r(require('src/components/analyze/supplier/apply')), 'group-analyze-supplier')
      },{
          path: 'supplierAuditList',
          name: 'supplier/audit/list',
          component: r => require.ensure([], () => r(require('src/components/analyze/supplier/auditList')), 'group-analyze-supplier')
      },{
          path: 'supplierAudit',
          name: 'supplier/audit/:sId',
          component: r => require.ensure([], () => r(require('src/components/analyze/supplier/audit')), 'group-analyze-supplier')
      },
      {
          path: 'supplierHome',
          name: 'supplier/home',
          component: r => require.ensure([], () => r(require('src/components/analyze/supplier/supplierHome')), 'group-analyze-supplier')
      }
    ]
  }
]
