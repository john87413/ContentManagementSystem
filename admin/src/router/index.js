import { createRouter, createWebHistory } from 'vue-router'
import MainView from '@/views/MainView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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

        { path: '/drinks/create', component: () => import('@/views/drink/DrinkEdit.vue') },
        { path: '/drinks/edit/:id', component: () => import('@/views/drink/DrinkEdit.vue'), props: true },
        { path: '/drinks/list', component: () => import('@/views/drink/DrinkList.vue') },

        { path: '/articles/create', component: () => import('@/views/article/ArticleEdit.vue') },
        { path: '/articles/edit/:id', component: () => import('@/views/article/ArticleEdit.vue'), props: true },
        { path: '/articles/list', component: () => import('@/views/article/ArticleList.vue') },

        { path: '/shops/create', component: () => import('@/views/shop/ShopEdit.vue') },
        { path: '/shops/edit/:id', component: () => import('@/views/shop/ShopEdit.vue'), props: true },
        { path: '/shops/list', component: () => import('@/views/shop/ShopList.vue') },

        { path: '/users/create', component: () => import('@/views/user/UserEdit.vue') },
        { path: '/users/edit/:id', component: () => import('@/views/user/UserEdit.vue'), props: true },
        { path: '/users/list', component: () => import('@/views/user/UserList.vue') },
      ]
    }
  ]
})

export default router
