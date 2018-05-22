export const feedRouter = [
  {
    path: '/feed',
    component: r => require.ensure([], () => r(require('src/components/feed/router')), 'group-feed'),
    children: [
      {
        path: 'home',
        name: 'feedHome',
        component: r => require.ensure([], () => r(require('src/components/feed/home')), 'group-feed'),
        meta: {
          scene: 'normal'
        }
      },
      {
        path: 'home2',
        name: 'feedHome2',
        component: r => require.ensure([], () => r(require('src/components/feed/home')), 'group-feed'),
        meta: {
          scene: 'share'
        }
      },
      {
        path: 'share/home/:vId',
        name: 'feedShareHome',
        component: r => require.ensure([], () => r(require('src/components/feed/ShareHome')), 'group-feed'),
        meta: {
          scene: 'shareVoice'
        }
      },
      {
        path: 'share/food/user/:uId',
        name: 'feedShareFood',
        component: r => require.ensure([], () => r(require('src/components/feed/home')), 'group-feed'),
        meta: {
          scene: 'shareFood'
        }
      },
      {
        path: 'share/food/details',
        name: 'feedShareFoodDetails',
        component: r => require.ensure([], () => r(require('src/components/feed/personal/shareFoodDetails')), 'group-feed')
      },
      {
        path: 'share/food/getHelpList',
        name: 'shareFoodGetHelpList',
        component: r => require.ensure([], () => r(require('src/components/admin/feed/shareFoodGetHelpList')), 'group-feed')
      },
      {
        path: 'steal/openDoor/:uId',
        name: 'feedStealOpenDoor',
        component: r => require.ensure([], () => r(require('src/components/feed/stealOpenDoor')), 'group-feed')
      },
      {
        path: 'order/:type',
        name: 'feedOrder',
        component: r => require.ensure([], () => r(require('src/components/feed/purchase/order')), 'group-feed')
      },
      {
          path: 'strategy',
          name: 'feedStrategy',
          component: r => require.ensure([], () => r(require('src/components/feed/scene/strategy')), 'group-feed')
      },
      {
          path: 'buyProduct',
          name: 'feedBuyProduct',
          component: r => require.ensure([], () => r(require('src/components/feed/purchase/buyProduct')), 'group-feed')
      },
      {
          path: 'sponsor',
          name: 'feedSponsor',
          component: r => require.ensure([], () => r(require('src/components/feed/purchase/sponsor')), 'group-feed')
      },
      {
          path: 'sponsorHistory',
          name: 'feedSponsorHistory',
          component: r => require.ensure([], () => r(require('src/components/feed/purchase/sponsorHistory')), 'group-feed')
      },
      {
          path: 'sponsorHistory/:type',
          name: 'feedSponsorHistory2',
          component: r => require.ensure([], () => r(require('src/components/feed/purchase/sponsorHistory')), 'group-feed')
      },
      {
          path: 'personal/sponsor/get/:sId',
          name: 'feedSponsorGetHistory',
          component: r => require.ensure([], () => r(require('src/components/feed/purchase/sponsorGetHistory')), 'group-feed')
      },
      {
          path: 'personal/withdraw',
          name: 'feedPersonalWithdraw',
          component: r => require.ensure([], () => r(require('src/components/feed/personal/withdraw')), 'group-feed')
      },
      {
          path: 'personal/rewardHistory/:type',
          name: 'feedPersonalRewardHistory',
          component: r => require.ensure([], () => r(require('src/components/feed/personal/rewardHistory')), 'group-feed')
      },
      {
          path: 'personal/rewardHistory/:type/:vId',
          name: 'feedPersonalRewardHistory2',
          component: r => require.ensure([], () => r(require('src/components/feed/personal/rewardHistory')), 'group-feed')
      },
      {
          path: 'personal/orderList',
          name: 'feedPersonalOrderList',
          component: r => require.ensure([], () => r(require('src/components/feed/personal/orderList')), 'group-feed')
      },
      {
          path: 'sponsorResult',
          name: 'feedSponsorOk',
          component: r => require.ensure([], () => r(require('src/components/feed/purchase/sponsorResult')), 'group-feed')
      },
      {
          path: 'tipPay/:vId',
          name: 'feedTipPay',
          component: r => require.ensure([], () => r(require('src/components/feed/purchase/tipPay')), 'group-feed')
      },
      {
          path: 'rankingList',
          name: 'feedRankingList',
          component: r => require.ensure([], () => r(require('src/components/feed/personal/rankingList')), 'group-feed'),
          meta: {
            // 标记不需要登陆
            notRequiresAuth: true
          }
      },
      {
          path: 'steal/serach',
          name: 'feedStealSearch',
          component: r => require.ensure([], () => r(require('src/components/feed/steal/searchWechat')), 'group-feed')
      },
      {
          path: 'steal/history/:type',
          name: 'feedStealHistory',
          component: r => require.ensure([], () => r(require('src/components/feed/steal/stealHistory')), 'group-feed')
      }
    ]
  }
]
export const feedAdminRouter = [
  {
    path: '/admin/feed/voiceList',
    name: 'adminFeedVoiceList',
    component: r => require.ensure([], () => r(require('src/components/admin/feed/voiceList')), 'group-feed-admin')
  },
  {
    path: '/admin/feed/voice/share/:vId',
    name: 'adminFeedVoiceItemShare',
    component: r => require.ensure([], () => r(require('src/components/admin/feed/shareItem')), 'group-feed-admin')
  },
  {
    path: '/admin/feed/auditList',
    name: 'adminFeedAuditList',
    component: r => require.ensure([], () => r(require('src/components/admin/feed/auditList')), 'group-feed-admin')
  },
  {
    path: '/admin/feed/auditHistory/:type',
    name: 'adminFeedAuditHistory',
    component: r => require.ensure([], () => r(require('src/components/admin/feed/auditHistory')), 'group-feed-admin')
  },
  {
    path: '/admin/feed/thumbsUpList/:id',
    name: 'adminFeedThumbsUpList',
    component: r => require.ensure([], () => r(require('src/components/admin/feed/thumbsUpList')), 'group-feed-admin')
  },
]
