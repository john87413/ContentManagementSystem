<template>
  <GenericList
    title="飲品列表"
    searchLabel="飲品名稱"
    searchPlaceholder="搜尋飲品名稱"
    :fetchItemsApi="fetchDrinks"
    :beforeDeleteItem="beforeDeleteDrink"
    :deleteItemApi="deleteDrink"
    editPath="/drinks/edit"
    itemsKey="drinks"
  >
    <template #table-columns="{ formatDate }">
      <el-table-column
        prop="name"
        label="飲品名稱"
        sortable="custom"
      ></el-table-column>
      <el-table-column
        prop="price"
        label="價格"
        sortable="custom"
      ></el-table-column>
      <el-table-column prop="image" label="圖片">
        <template #default="{ row }">
          <img
            :src="row.images.length > 0 ? row.images[0].imgUrl : ''"
            style="height: 6rem"
          />
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
import drinkApi from "@/api/drinkApi";

const fetchDrinks = async (page, limit, nameQuery, sortField, sortOrder) => {
  return await drinkApi.fetchDrinks(
    page,
    limit,
    nameQuery,
    sortField,
    sortOrder
  );
};

const beforeDeleteDrink = (drink) => {
  return `你確定要刪除飲品 "${drink.name}" 嗎？`;
};

const deleteDrink = async (id) => {
  return await drinkApi.deleteDrink(id);
};
</script>
