import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // base 
  routes: [
    {
      path: '/',
      name: 'main',
      component: () => import('../views/MainView.vue')
    },
    {
      path: '/monthly',
      name: 'monthly',
      component: () => import('../views/MonthlyView.vue')
    },
    {
      path: '/yearly',
      name: 'yearly',
      component: () => import('../views/YearlyView.vue')
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router
