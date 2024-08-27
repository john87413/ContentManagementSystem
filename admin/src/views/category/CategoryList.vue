<template>
  <div>
    <h1>分類列表</h1>
    <el-table :data="categories">
      <el-table-column prop="_id" label="ID" width="220"></el-table-column>
      <el-table-column prop="parent.name" label="上級分類"></el-table-column>
      <el-table-column prop="name" label="分類名稱"></el-table-column>
      <el-table-column fixed="right" label="更動" width="200">
        <template #default="{ row, $index }">
          <el-button type="primary">編輯</el-button>
          <el-button type="primary">刪除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { useCategoryStore } from "@/stores/categoryStore";

const categoryStore = useCategoryStore();
const categories = ref([]);

const fetchCategories = async () => {
  try {
    await categoryStore.loadCategories();
    categories.value = categoryStore.categories;
  } catch (error) {
    ElMessage.error("取得資料失敗:" + error.message);
  }
};

onMounted(async () => {
  await fetchCategories();
});
</script>
