import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus';

import MainView from '@/views/MainView.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'

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
      path: '/register',
      name: 'register',
      component: Register,
      meta: { noAuth: true }
    },
    {
      path: '/',
      name: 'main',
      component: MainView,
      children: [
        { path: '/categories/create', component: () => import('@/views/category/CategoryEdit.vue'), meta: { requiredPermissions: ['contentManagement'] } },
        { path: '/categories/edit/:id', component: () => import('@/views/category/CategoryEdit.vue'), props: true, meta: { requiredPermissions: ['contentManagement'] } },
        { path: '/categories/list', component: () => import('@/views/category/CategoryList.vue'), meta: { requiredPermissions: ['contentManagement'] } },

        { path: '/ingredients/create', component: () => import('@/views/ingredient/IngredientEdit.vue'), meta: { requiredPermissions: ['contentManagement'] } },
        { path: '/ingredients/edit/:id', component: () => import('@/views/ingredient/IngredientEdit.vue'), props: true, meta: { requiredPermissions: ['contentManagement'] } },
        { path: '/ingredients/list', component: () => import('@/views/ingredient/IngredientList.vue'), meta: { requiredPermissions: ['contentManagement'] } },

        { path: '/drinks/create', component: () => import('@/views/drink/DrinkEdit.vue'), meta: { requiredPermissions: ['contentManagement'] } },
        { path: '/drinks/edit/:id', component: () => import('@/views/drink/DrinkEdit.vue'), props: true, meta: { requiredPermissions: ['contentManagement'] } },
        { path: '/drinks/list', component: () => import('@/views/drink/DrinkList.vue'), meta: { requiredPermissions: ['contentManagement'] } },

        { path: '/articles/create', component: () => import('@/views/article/ArticleEdit.vue'), meta: { requiredPermissions: ['marketingManagement'] } },
        { path: '/articles/edit/:id', component: () => import('@/views/article/ArticleEdit.vue'), props: true, meta: { requiredPermissions: ['marketingManagement'] } },
        { path: '/articles/list', component: () => import('@/views/article/ArticleList.vue'), meta: { requiredPermissions: ['marketingManagement'] } },

        { path: '/carousels/create', component: () => import('@/views/carousel/CarouselEdit.vue'), meta: { requiredPermissions: ['marketingManagement'] } },
        { path: '/carousels/edit/:id', component: () => import('@/views/carousel/CarouselEdit.vue'), props: true, meta: { requiredPermissions: ['marketingManagement'] } },
        { path: '/carousels/list', component: () => import('@/views/carousel/CarouselList.vue'), meta: { requiredPermissions: ['marketingManagement'] } },

        { path: '/shops/create', component: () => import('@/views/shop/ShopEdit.vue'), meta: { requiredPermissions: ['marketingManagement'] } },
        { path: '/shops/edit/:id', component: () => import('@/views/shop/ShopEdit.vue'), props: true, meta: { requiredPermissions: ['marketingManagement'] } },
        { path: '/shops/list', component: () => import('@/views/shop/ShopList.vue'), meta: { requiredPermissions: ['marketingManagement'] } },

        { path: '/users/create', component: () => import('@/views/user/UserEdit.vue'), meta: { requiredPermissions: ['systemSettings'] } },
        { path: '/users/edit/:id', component: () => import('@/views/user/UserEdit.vue'), props: true, meta: { requiredPermissions: ['systemSettings'] } },
        { path: '/users/list', component: () => import('@/views/user/UserList.vue'), meta: { requiredPermissions: ['systemSettings'] } },
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
  if (to.meta.requiredPermissions) {
    const hasPermission = to.meta.requiredPermissions.some(
      permission => user.permissions.includes(permission)
    )

    if (!hasPermission) {
      ElMessage.error('您沒有權限訪問此頁面')
      next(from.path)
      return
    }
  }

  next()
})

export default router
