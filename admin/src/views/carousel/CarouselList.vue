<template>
  <GenericList
    title="輪播圖列表"
    searchLabel="輪播圖名稱"
    searchPlaceholder="搜尋輪播圖名稱"
    :fetchItemsApi="fetchCarousels"
    :beforeDeleteItem="beforeDeleteCarousel"
    :deleteItemApi="deleteCarousel"
    editPath="/carousels/edit"
    itemsKey="carousels"
  >
    <template #table-columns="{ formatDate }">
      <el-table-column
        prop="name"
        label="輪播圖名稱"
        sortable="custom"
      ></el-table-column>
      <el-table-column
        prop="updatedAt"
        label="更新時間"
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
import carouselApi from "@/api/carouselApi";

const fetchCarousels = async (page, limit, nameQuery, sortField, sortOrder) => {
  return await carouselApi.fetchCarousels(
    page,
    limit,
    nameQuery,
    sortField,
    sortOrder
  );
};

const beforeDeleteCarousel = (carousel) => {
  return `你確定要刪除輪播圖 "${carousel.name}" 嗎？`;
};

const deleteCarousel = async (id) => {
  return await carouselApi.deleteCarousel(id);
};
</script>
