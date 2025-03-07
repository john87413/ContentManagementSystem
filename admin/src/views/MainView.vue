<template>
  <el-container style="height: 100vh">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <el-menu router unique-opened :default-active="$route.path">
        <el-sub-menu index="1">
          <template #title> <i class="el-icon-message"></i>內容管理 </template>

          <el-menu-item-group>
            <template #title>分類</template>
            <el-menu-item index="/categories/create">新建分類</el-menu-item>
            <el-menu-item index="/categories/list">分類列表</el-menu-item>
          </el-menu-item-group>

          <el-menu-item-group>
            <template #title>配料</template>
            <el-menu-item index="/ingredients/create">新建配料</el-menu-item>
            <el-menu-item index="/ingredients/list">配料列表</el-menu-item>
          </el-menu-item-group>

          <el-menu-item-group>
            <template #title>飲品</template>
            <el-menu-item index="/drinks/create">新建飲品</el-menu-item>
            <el-menu-item index="/drinks/list">飲品列表</el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>

        <el-sub-menu index="2">
          <template #title> <i class="el-icon-message"></i>行銷管理 </template>

          <el-menu-item-group>
            <template #title>輪播圖</template>
            <el-menu-item index="/carousels/create">新建輪播圖</el-menu-item>
            <el-menu-item index="/carousels/list">輪播圖列表</el-menu-item>
          </el-menu-item-group>

          <el-menu-item-group>
            <template #title>文章</template>
            <el-menu-item index="/articles/create">新建文章</el-menu-item>
            <el-menu-item index="/articles/list">文章列表</el-menu-item>
          </el-menu-item-group>

          <el-menu-item-group>
            <template #title>門市</template>
            <el-menu-item index="/shops/create">新建門市</el-menu-item>
            <el-menu-item index="/shops/list">門市列表</el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>

        <el-sub-menu index="3">
          <template #title> <i class="el-icon-message"></i>系統設置</template>

          <el-menu-item-group>
            <template #title>用戶</template>
            <el-menu-item index="/users/create">新建用戶</el-menu-item>
            <el-menu-item index="/users/list">用戶列表</el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header style="text-align: right; font-size: 12px">
        <el-button type="danger" @click="logout">登出</el-button>
      </el-header>

      <el-main>
        <RouterView :key="$route.path"></RouterView>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ElMessageBox, ElMessage } from 'element-plus';

import { useAuthStore } from '@/stores/AuthStore';

const router = useRouter();
const authStore = useAuthStore();

const logout = async () => {
  try {
    await ElMessageBox.confirm("確定要登出系統嗎？", "提示", {
      confirmButtonText: "確定",
      cancelButtonText: "取消",
      type: "warning",
    });

    // 呼叫 store 的登出方法
    authStore.logout();

    // 提示
    ElMessage.success("已成功登出");

    // 導向登入頁
    router.push("/login");
  } catch (error) {
    // 用戶取消登出
  }
};
</script>

<style>
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}
</style>
