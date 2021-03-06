import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Hot from '../views/Hot.vue'
import NewPost from '../views/NewPost.vue'
import Follow from '../views/MyFollows.vue'
import HotTopic from '../views/HotTopic.vue'



Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home/hot/post',
  },
  {
    path: '/home',
    component: Home,
    children: [
      {
        path: '',
        redirect: 'hot/post',
      },
      {
        path: 'hot/:type',
        name: 'Hot',
        component: Hot
      }, {
        path: 'hottopic',
        name: 'Hottopic',
        component: HotTopic
      }, {
        path: 'newpost/:type',
        name: 'Newpost',
        component: NewPost
      },
      {
        path: 'myfollow/:type',
        name: 'Myfollow',
        component: Follow
      },
      {
        path: 'product',
        name: 'ProductRecommendation',
        component: HotTopic
      }
    ]
  }, {
    path: '/askanswer/:type',
    name: 'AskAnswer',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/AskAnswer.vue')
  },
  {
    path: '/service',
    name: 'Service',
    component: () => import('../views/Service.vue')
  }, {
    path: '/know',
    name: 'Know',
    component: () => import('../views/Know.vue')
  }, {
    path: '/reg',
    name: 'Register',
    component: () => import(/* webpackChunkName: "Register" */ '../views/Register.vue')
  }, {
    path: '/search',
    name: 'Search',
    component: () => import('../views/Search.vue')
  }, {
    path: '/question',
    name: 'Question',
    component: () => import('../views/Question.vue')
  }, {
    path: '/artdetail/:art_id',
    name: 'ArtDetail',
    component: () => import('../views/ArtDetail.vue'),
  }, {
    path: '/user/:user_id/:type?',
    name: 'User',
    component: () => import('../views/User.vue'),
  },{
    path: '/articlepost',
    name: 'ArticlePost',
    component: () => import('../views/ArtPost.vue')
  },
  {
    path: '*',
    redirect: '/home'
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
// router.beforeEach((to, from, next) => {
//   if (to.matched.length ===0) {  //????????????????????????
//     from.path? next({ path:from.path}) : next('/home');   //????????????????????????????????????????????????????????????????????????????????????????????????
//   } else {
//     next();    //???????????????????????????
//   }
// });
export default router
