import { createRouter, createWebHistory } from 'vue-router'
import MainView from '@/views/MainView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/',
    //   name: 'home',
    //   component: HomeView
    // },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue')
    // },
    {
      path: '/',
      name: 'main',
      component: MainView,
      children: [
        { path: '/categories/create', component: () => import('@/views/category/CategoryEdit.vue') },
        { path: '/categories/edit/:id', component: () => import('@/views/category/CategoryEdit.vue'), props: true },
        { path: '/categories/list', component: () => import('@/views/category/CategoryList.vue') },

        { path: '/ingredients/create', component: () => import('@/views/ingredient/IngredientEdit.vue') },
        { path: '/ingredients/edit/:id', component: () => import('@/views/ingredient/IngredientEdit.vue'), props: true },
        { path: '/ingredients/list', component: () => import('@/views/ingredient/IngredientList.vue') },

        { path: '/drink/create', component: () => import('@/views/drink/DrinkEdit.vue') },
        { path: '/drink/edit/:id', component: () => import('@/views/drink/DrinkEdit.vue'), props: true },
        { path: '/drink/list', component: () => import('@/views/drink/DrinkList.vue') },

        { path: '/articles/create', component: () => import('@/views/article/ArticleEdit.vue') },
        { path: '/articles/edit/:id', component: () => import('@/views/article/ArticleEdit.vue'), props: true },
        { path: '/articles/list', component: () => import('@/views/article/ArticleList.vue') },

        { path: '/stores/create', component: () => import('@/views/store/StoreEdit.vue') },
        { path: '/stores/edit/:id', component: () => import('@/views/store/StoreEdit.vue'), props: true },
        { path: '/stores/list', component: () => import('@/views/store/StoreList.vue') },

        { path: '/users/create', component: () => import('@/views/user/UserEdit.vue') },
        { path: '/users/edit/:id', component: () => import('@/views/user/UserEdit.vue'), props: true },
        { path: '/users/list', component: () => import('@/views/user/UserList.vue') },
      ]
    }
  ]
})

export default router
