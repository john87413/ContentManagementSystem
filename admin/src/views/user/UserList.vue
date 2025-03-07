<template>
  <GenericList
    title="用戶列表"
    searchLabel="用戶名稱"
    searchPlaceholder="搜尋用戶名稱"
    :fetchItemsApi="fetchUsers"
    :beforeDeleteItem="beforeDeleteUser"
    :deleteItemApi="deleteUser"
    editPath="/users/edit"
    itemsKey="users"
    :hasDelete="true"
  >
    <template #table-columns="{ formatDate }">
      <el-table-column
        prop="username"
        label="用戶"
        sortable="custom"
      ></el-table-column>
      <el-table-column prop="role" label="角色" sortable="custom">
        <template #default="{ row }">
          {{ formatRole(row.role) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="updatedAt"
        label="更新時間"
        width="220"
        sortable="custom"
      >
        <template #default="{ row }">
          {{ formatDate(row.updatedAt) }}
        </template>
      </el-table-column>
    </template>
  </GenericList>
</template>

<script setup>
import GenericList from "@/components/GenericList.vue";
import userApi from "@/api/userApi";

const fetchUsers = async (page, limit, nameQuery, sortField, sortOrder) => {
  return await userApi.fetchUsers(page, limit, nameQuery, sortField, sortOrder);
};

const beforeDeleteUser = (user) => {
  return `你確定要刪除帳號 "${user.username}" 嗎？`;
};

const deleteUser = async (id) => {
  return await userApi.deleteUser(id);
};

const formatRole = (role) => {
  return role === "admin" ? "管理員" : "編輯";
};
</script>
