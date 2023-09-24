import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import {AuthAPI} from "@/api/api";

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    redirect: '/chats',
  },
  {
    path: '/sing-up',
    name: 'sing-up',
    meta: { auth: false },
    component: () => import('@/views/SingUp/SingUp')
  },
  {
    path: '/login',
    name: 'login',
    meta: { auth: false },
    component: () => import('@/views/Login/Login')
  },
  {
    path: '/chats',
    name: 'chats',
    meta: { auth: true },
    component: () => import('@/views/Chats/Chats')
  },
  {
    path: '*',
    name: 'PageNotFound',
    meta: { auth: false },
    component: () => import('@/views/PageNotFound/PageNotFound')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach(async (to, from, next) => {
  if (to.meta?.auth) {
    try {
      await AuthAPI.getUser()
      next()
    } catch (e) {
      next('/login')
    }
  } else {
    next()
  }
})

router.afterEach((to) => {
  const storageMetrics = localStorage.getItem('metrics')
  if (storageMetrics) {
    const metrics = JSON.parse(storageMetrics)
    if (!metrics.visitedPages.includes(to.fullPath)) {
      metrics.visitedPages.push(to.fullPath)
      localStorage.setItem('metrics', JSON.stringify(metrics))
    }
  } else {
    const metrics = {
      visitedPages: [to.fullPath]
    }
    localStorage.setItem('metrics', JSON.stringify(metrics))
  }
})

export default router
