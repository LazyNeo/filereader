export const posRouter = [
  {
    path: '/pos',
    component: 'src/components/pos/router',
    children: [
      {
        path: 'home',
        name: 'posHome',
        component:  'src/components/pos/home'
      },
    ]
  }
]
