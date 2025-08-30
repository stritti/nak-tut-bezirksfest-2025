import { createRouter, createWebHistory } from 'vue-router'

// Define a Home component that just renders the main App content
const Home = { template: '<div class="home-wrapper"><slot></slot></div>' }

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    }
  ]
})

export default router
