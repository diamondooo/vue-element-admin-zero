import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

// Layout
import Layout from '@/layout';

const routes = [
  {
    path:"/login",
    component:()=>import('@/views/login/index')
  },
  {
    path:"/auth-redirect",
    component:()=>import('@/views/login/auth-redirect')
  },
  {
    path: '/',
    component: Layout,
    redirect:"/dashboard",
    children:[{
      path:"dashboard",
      component:()=>import('@/views/dashboard/index'),
      name:"Dashboard",
    }],
  },{
    path:"/documentation",
    component:Layout,
    children:[
      {
        path:"index",
        component:()=>import('@/views/documentation/index'),
        name:"Documentation",
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
