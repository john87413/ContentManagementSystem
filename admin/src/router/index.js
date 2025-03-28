import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus';

import MainView from '@/views/MainView.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'

// Prefetch components for better performance
const CategoryEdit = () => import(/* webpackChunkName: "category" */ '@/views/category/CategoryEdit.vue')
const CategoryList = () => import(/* webpackChunkName: "category" */ '@/views/category/CategoryList.vue')
const IngredientEdit = () => import(/* webpackChunkName: "ingredient" */ '@/views/ingredient/IngredientEdit.vue')
const IngredientList = () => import(/* webpackChunkName: "ingredient" */ '@/views/ingredient/IngredientList.vue')
const DrinkEdit = () => import(/* webpackChunkName: "drink" */ '@/views/drink/DrinkEdit.vue')
const DrinkList = () => import(/* webpackChunkName: "drink" */ '@/views/drink/DrinkList.vue')
const ArticleEdit = () => import(/* webpackChunkName: "article" */ '@/views/article/ArticleEdit.vue')
const ArticleList = () => import(/* webpackChunkName: "article" */ '@/views/article/ArticleList.vue')
const CarouselEdit = () => import(/* webpackChunkName: "carousel" */ '@/views/carousel/CarouselEdit.vue')
const CarouselList = () => import(/* webpackChunkName: "carousel" */ '@/views/carousel/CarouselList.vue')
const ShopEdit = () => import(/* webpackChunkName: "shop" */ '@/views/shop/ShopEdit.vue')
const ShopList = () => import(/* webpackChunkName: "shop" */ '@/views/shop/ShopList.vue')
const UserEdit = () => import(/* webpackChunkName: "user" */ '@/views/user/UserEdit.vue')
const UserList = () => import(/* webpackChunkName: "user" */ '@/views/user/UserList.vue')

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
        { path: '/categories/create', component: CategoryEdit, meta: { requiredPermissions: ['contentManagement'] } },
        { path: '/categories/edit/:id', component: CategoryEdit, props: true, meta: { requiredPermissions: ['contentManagement'] } },
        { path: '/categories/list', component: CategoryList, meta: { requiredPermissions: ['contentManagement'] } },

        { path: '/ingredients/create', component: IngredientEdit, meta: { requiredPermissions: ['contentManagement'] } },
        { path: '/ingredients/edit/:id', component: IngredientEdit, props: true, meta: { requiredPermissions: ['contentManagement'] } },
        { path: '/ingredients/list', component: IngredientList, meta: { requiredPermissions: ['contentManagement'] } },

        { path: '/drinks/create', component: DrinkEdit, meta: { requiredPermissions: ['contentManagement'] } },
        { path: '/drinks/edit/:id', component: DrinkEdit, props: true, meta: { requiredPermissions: ['contentManagement'] } },
        { path: '/drinks/list', component: DrinkList, meta: { requiredPermissions: ['contentManagement'] } },

        { path: '/articles/create', component: ArticleEdit, meta: { requiredPermissions: ['marketingManagement'] } },
        { path: '/articles/edit/:id', component: ArticleEdit, props: true, meta: { requiredPermissions: ['marketingManagement'] } },
        { path: '/articles/list', component: ArticleList, meta: { requiredPermissions: ['marketingManagement'] } },

        { path: '/carousels/create', component: CarouselEdit, meta: { requiredPermissions: ['marketingManagement'] } },
        { path: '/carousels/edit/:id', component: CarouselEdit, props: true, meta: { requiredPermissions: ['marketingManagement'] } },
        { path: '/carousels/list', component: CarouselList, meta: { requiredPermissions: ['marketingManagement'] } },

        { path: '/shops/create', component: ShopEdit, meta: { requiredPermissions: ['marketingManagement'] } },
        { path: '/shops/edit/:id', component: ShopEdit, props: true, meta: { requiredPermissions: ['marketingManagement'] } },
        { path: '/shops/list', component: ShopList, meta: { requiredPermissions: ['marketingManagement'] } },

        { path: '/users/create', component: UserEdit, meta: { requiredPermissions: ['systemSettings'] } },
        { path: '/users/edit/:id', component: UserEdit, props: true, meta: { requiredPermissions: ['systemSettings'] } },
        { path: '/users/list', component: UserList, meta: { requiredPermissions: ['systemSettings'] } },
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
