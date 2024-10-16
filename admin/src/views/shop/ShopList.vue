<template>
  <GenericList
    title="門市列表"
    searchLabel="門市名稱"
    searchPlaceholder="搜尋門市名稱"
    :fetchItemsApi="fetchShops"
    :beforeDeleteItem="beforeDeleteShop"
    :deleteItemApi="deleteShop"
    editPath="/shops/edit"
    itemsKey="shops"
  >
    <template #table-columns="{ formatDate }">
      <el-table-column prop="name" label="門市名稱"></el-table-column>
      <el-table-column prop="city" label="縣市"></el-table-column>
      <el-table-column prop="district" label="區域"></el-table-column>
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
import shopApi from "@/api/shopApi";

const fetchShops = async (page, limit, nameQuery) => {
  return await shopApi.fetchShops(page, limit, nameQuery);
};

const beforeDeleteShop = (shop) => {
  return `你確定要刪除門市 "${shop.name}" 嗎？`;
};

const deleteShop = async (id) => {
  return await shopApi.deleteShop(id);
};
</script>