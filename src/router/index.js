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
    redirect: '/home/hot',
  },
  {
    path: '/home',
    // name: 'Home',
    component: Home,
    children: [
      { 
        path: '', 
        redirect: 'hot',
      },
      {
        path: 'hot',
        component: Hot
      },
      {
        path: 'newpost',
        component: NewPost
      },
      {
        path: 'myfollow',
        component: Follow
      },
      {
        path: 'hottopic',
        component: HotTopic
      }
    ]
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },{
    path: '/reg',
    name: 'Register',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "Register" */ '../views/Register.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
