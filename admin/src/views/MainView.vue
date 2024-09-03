<script setup>
</script>

<template>
  <el-container style="height: 100vh">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <el-menu router unique-opened :default-active="$route.path">
        <el-sub-menu index="1">
          <template #title>
            <i class="el-icon-message"></i>內容管理
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
            <el-menu-item index="/drink/create">新建飲品</el-menu-item>
            <el-menu-item index="/drink/list">飲品列表</el-menu-item>
          </el-menu-item-group>

        </el-sub-menu>

        <el-sub-menu index="2">
          <template #title> <i class="el-icon-message"></i>行銷管理 </template>

          <el-menu-item-group>
            <template #title>輪播圖</template>
            <el-menu-item index="/articles/create">新建輪播圖</el-menu-item>
            <el-menu-item index="/articles/list">輪播圖列表</el-menu-item>
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
            <template #title>管理員</template>
            <el-menu-item index="/users/create">新建管理員</el-menu-item>
            <el-menu-item index="/users/list">管理員列表</el-menu-item>
          </el-menu-item-group>

          <!-- <el-menu-item-group>
            <template #title>系統</template>
            <el-menu-item index="/login">登出</el-menu-item>
          </el-menu-item-group> -->
        </el-sub-menu>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header style="text-align: right; font-size: 12px"></el-header>

      <el-main>
        <RouterView :key="$route.path"></RouterView>
      </el-main>
    </el-container>
  </el-container>
</template>

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
