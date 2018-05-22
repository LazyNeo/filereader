export const questionAdminRouter = [
  {
    path: '/admin/question',
    component:  r => require.ensure([], () => r(require('src/components/admin/question/router')), 'group-question-admin'),
    children: [
      {
        path: 'index',
        name: 'adminQuestionIndex',
        component:  r => require.ensure([], () => r(require('src/components/admin/question/index')), 'group-question-admin')
      },
      {
        path: 'home',
        name: 'adminQuestionHome',
        component:  r => require.ensure([], () => r(require('src/components/admin/question/home')), 'group-question-admin')
      },
      {
        path: 'actv',
        name: 'adminQuestionActv',
        component:  r => require.ensure([], () => r(require('src/components/admin/question/questionlist')), 'group-question-admin')
      },
      {
        path: 'group',
        name: 'adminQuestionGroup',
        component:  r => require.ensure([], () => r(require('src/components/admin/question/group')), 'group-question-admin')
      },
      {
        path: 'assess',
        name: 'adminQuestionAssess',
        component:  r => require.ensure([], () => r(require('src/components/admin/question/assess')), 'group-question-admin')
      },
      {
        path: 'group/edit/:id',
        name: 'adminQuestionGroupEdit',
        component:  r => require.ensure([], () => r(require('src/components/admin/question/groupEdit')), 'group-question-admin')
      },
      {
        path: 'assess/edit/:id',
        name: 'adminQuestionAssessEdit',
        component:  r => require.ensure([], () => r(require('src/components/admin/question/assessEdit')), 'group-question-admin')
      },
      {
      	path: 'questionlist/:type/:status',
        name: 'adminQuestionlist',
        component:  r => require.ensure([], () => r(require('src/components/admin/question/questionlist')), 'group-question-admin')
      },
      {
        path: 'searchQuestion',
        name: 'adminQuestionSearch',
        component:  r => require.ensure([], () => r(require('src/components/admin/question/searchQuestion')), 'group-question-admin')
      },
    ]
  },
  {
    path: '/application/shake',
    name: 'applicationShake',
    component:  r => require.ensure([], () => r(require('src/components/application/shake')), 'group-question-admin')
  },
  {
    path: '/application/shake/:type',
    name: 'applicationShakeType',
    component:  r => require.ensure([], () => r(require('src/components/application/shake')), 'group-question-admin')
  },
  {
    path: '/application/activity/:aId',
    name: 'applicationActivity',
    component:  r => require.ensure([], () => r(require('src/components/application/activity')), 'group-question-admin')
  },
  {
    path: '/application/assess/:eId',
    name: 'applicationAssess',
    component:  r => require.ensure([], () => r(require('src/components/application/assess')), 'group-question-admin')
  },
  {
    path: '/application/personal',
    name: 'applicationPersonal',
    component:  r => require.ensure([], () => r(require('src/components/application/personal')), 'group-question-admin')
  },
  {
    path: '/application/personalHistoryList/:type/',
    name: 'applicationPersonalHistoryList',
    component:  r => require.ensure([], () => r(require('src/components/application/personalHistoryList')), 'group-question-admin')
  }
]
