<template>
  <GenericList
    title="配料列表"
    searchLabel="配料名稱"
    searchPlaceholder="搜尋配料名稱"
    :fetchItemsApi="fetchIngredients"
    :beforeDeleteItem="beforeDeleteIngredient"
    :deleteItemApi="deleteIngredient"
    editPath="/ingredients/edit"
    itemsKey="ingredients"
  >
    <template #table-columns="{ formatDate }">
      <el-table-column prop="name" label="配料名稱"></el-table-column>
      <el-table-column prop="price" label="價格"></el-table-column>
      <el-table-column prop="updatedAt" label="更新時間" width="220">
        <template #default="{ row }">
          {{ formatDate(row.updatedAt) }}
        </template>
      </el-table-column>
    </template>
  </GenericList>
</template>

<script setup>
import GenericList from "@/components/GenericList.vue";
import ingredientApi from "@/api/ingredientApi";

const fetchIngredients = async (page, limit, nameQuery) => {
  return await ingredientApi.fetchIngredients(page, limit, nameQuery);
};

const beforeDeleteIngredient = (ingredient) => {
  return `你確定要刪除 "${ingredient.name}" 嗎？。`;
};

const deleteIngredient = async (id) => {
  return await ingredientApi.deleteIngredient(id);
};
</script>