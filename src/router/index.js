import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'start',
    component: () => import('@/views/StartView.vue')
  },
  {
    path: '/selfie',
    name: 'selfie',
    component: () => import('@/views/SelfieView.vue')
  },
  {
    path: '/passport-main',
    name: 'passport-main',
    component: () => import('@/views/PassportMainView.vue')
  },
  {
    path: '/passport-registration',
    name: 'passport-registration',
    component: () => import('@/views/PassportRegistrationView.vue')
  },
  {
    path: '/verifying',
    name: 'verifying',
    component: () => import('@/views/VerifyingView.vue')
  },
  {
    path: '/results',
    name: 'results',
    component: () => import('@/views/ResultsView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router