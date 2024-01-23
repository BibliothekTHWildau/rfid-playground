// Composables
import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Playground from '@/views/Playground.vue'


const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        //component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
        component: Home
      },
    ],
  },
  {
    path: '/playground',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path : "",
        name: 'playground',
        component: Playground
      }
    ]
    
  },
  {
    path: '/konvertierung',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path : "",
        name: 'Konvertierung',
        component: () => import(/* webpackChunkName: "home" */ '@/views/Konvertierung.vue'),
      }
    ]
    
  },
  {
    path: '/settings',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path : "",
        name: 'Settings',
        component: () => import(/* webpackChunkName: "settings" */ '@/views/Settings.vue'),
      }
    ]
    
  },
  {
    path: '/iso28560',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path : "",
        name: 'iso28560',
        component: () => import(/* webpackChunkName: "settings" */ '@/views/ISO28560Creator.vue'),
      }
    ]
    
  },
  
]

const router = createRouter({
  ////history: createWebHistory(process.env.BASE_URL),
  //history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
