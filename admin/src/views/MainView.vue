<template>
  <el-container style="height: 100vh">
    <el-aside
      class="sidebar-container"
      :width="sidebarStore.isCollapsed ? '64px' : '200px'"
      style="background-color: rgb(238, 241, 246)"
    >
      <div class="sidebar-header">
        <div class="logo" :class="{ 'logo-hidden': sidebarStore.isCollapsed }">
          CMS
        </div>
        <el-icon
          class="toggle-icon"
          :class="{ 'toggle-centered': sidebarStore.isCollapsed }"
          @click="sidebarStore.toggleSidebar"
        >
          <Fold v-if="!sidebarStore.isCollapsed" />
          <Expand v-else />
        </el-icon>
      </div>
      <el-menu
        router
        unique-opened
        :default-active="$route.path"
        :collapse="sidebarStore.isCollapsed"
      >
        <!-- 內容管理 - 需要 contentManagement 權限 -->
        <el-sub-menu index="1" v-if="hasContentPermission">
          <template #title>
            <el-icon><Document /></el-icon>
            <span>內容管理</span>
          </template>

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

        <!-- 行銷管理 - 需要 marketingManagement 權限 -->
        <el-sub-menu index="2" v-if="hasMarketingPermission">
          <template #title>
            <el-icon><Promotion /></el-icon>
            <span>行銷管理</span>
          </template>

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

        <!-- 系統設置 - 需要 systemSettings 權限 -->
        <el-sub-menu index="3" v-if="hasSystemPermission">
          <template #title>
            <el-icon><Tools /></el-icon>
            <span>系統設置</span>
          </template>

          <el-menu-item-group>
            <template #title>用戶</template>
            <el-menu-item index="/users/create">新建用戶</el-menu-item>
            <el-menu-item index="/users/list">用戶列表</el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header>
        <span style="margin-right: 15px">Hi, {{ currentUserName }}</span>
        <el-button type="danger" @click="logout">登出</el-button>
      </el-header>

      <el-main>
        <RouterView :key="$route.path"></RouterView>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { ElMessageBox, ElMessage } from "element-plus";
import {
  Document,
  Tools,
  Promotion,
  Expand,
  Fold,
} from "@element-plus/icons-vue";

import { useAuthStore } from "@/stores/AuthStore";
import { useSidebarStore } from "@/stores/SidebarStore";

const router = useRouter();
const authStore = useAuthStore();
const sidebarStore = useSidebarStore();

// 獲取當前登錄用戶信息
const currentUser = computed(() => authStore.getUser());
const currentUserName = computed(() => currentUser.value?.username || "");

// 根據用戶角色判斷權限
const hasContentPermission = computed(() => {
  if (!currentUser.value || !currentUser.value.permissions) return false;
  return currentUser.value.permissions.includes("contentManagement");
});

const hasMarketingPermission = computed(() => {
  if (!currentUser.value || !currentUser.value.permissions) return false;
  return currentUser.value.permissions.includes("marketingManagement");
});

const hasSystemPermission = computed(() => {
  if (!currentUser.value || !currentUser.value.permissions) return false;
  return currentUser.value.permissions.includes("systemSettings");
});

// 登出處理
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
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.el-aside {
  color: #333;
}

.el-menu {
  background-color: rgb(238, 241, 246);
  border-right: none;
  transition: width 0.2s !important;
}

.sidebar-container {
  transition: width 0.4s;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 60px;
  border-bottom: 1px solid #e0e0e0;
  position: relative; /* 添加相对定位 */
  overflow: hidden; /* 防止logo溢出 */
}

.logo {
  font-weight: bold;
  opacity: 1;
  transition: opacity 0.3s, transform 0.3s;
  transform: translateX(0);
}

.logo-hidden {
  opacity: 0;
  transform: translateX(-20px);
}

.toggle-icon {
  cursor: pointer;
  font-size: 20px;
  position: absolute;
  right: 20px;
  transition: right 0.3s, transform 0.3s;
}

.toggle-centered {
  right: 50%;
  transform: translateX(50%);
}

.toggle-icon:hover {
  color: #409eff;
}
</style>
