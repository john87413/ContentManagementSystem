<template>
  <GenericList
    title="分類列表"
    searchLabel="分類名稱"
    searchPlaceholder="搜尋分類名稱"
    :fetchItemsApi="fetchCategories"
    :beforeDeleteItem="beforeDeleteCategory"
    :deleteItemApi="deleteCategory"
    editPath="/categories/edit"
    itemsKey="categories"
  >
    <template #table-columns="{ formatDate }">
      <el-table-column
        prop="name"
        label="分類名稱"
        sortable="custom"
      ></el-table-column>
      <el-table-column
        prop="parent.name"
        label="上級分類"
        sortable="custom"
      ></el-table-column>
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
import categoryApi from "@/api/categoryApi";

const fetchCategories = async (page, limit, nameQuery, sortField, sortOrder) => {
  return await categoryApi.fetchCategories(page, limit, nameQuery, sortField, sortOrder);
};

const beforeDeleteCategory = (category) => {
  return `你確定要刪除 "${category.name}" 嗎？`;
};

const deleteCategory = async (id) => {
  return await categoryApi.deleteCategory(id);
};
</script>
