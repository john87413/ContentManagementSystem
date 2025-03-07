import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus';

import MainView from '@/views/MainView.vue'
import Login from '@/views/Login.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { noAuth: true }
    },
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

        { path: '/carousels/create', component: () => import('@/views/carousel/CarouselEdit.vue') },
        { path: '/carousels/edit/:id', component: () => import('@/views/carousel/CarouselEdit.vue'), props: true },
        { path: '/carousels/list', component: () => import('@/views/carousel/CarouselList.vue') },

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

// 路由守衛
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user'))

  // 不需要認證的頁面直接放行
  if (to.meta.noAuth) {
    next()
    return
  }

  // 未登錄直接跳轉登錄
  if (!token) {
    next('/login')
    return
  }

  // 檢查權限
  if (to.meta.requiredRoles && !to.meta.requiredRoles.includes(user.role)) {
    ElMessage.error('您沒有權限訪問此頁面')
    next(from.path)
    return
  }

  next()
})

export default router
