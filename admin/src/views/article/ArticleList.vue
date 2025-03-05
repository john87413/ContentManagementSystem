<template>
  <GenericList
    title="文章列表"
    searchLabel="文章名稱"
    searchPlaceholder="搜尋文章名稱"
    :fetchItemsApi="fetchArticles"
    :beforeDeleteItem="beforeDeleteArticle"
    :deleteItemApi="deleteArticle"
    editPath="/articles/edit"
    itemsKey="articles"
  >
    <template #table-columns="{ formatDate }">
      <el-table-column
        prop="title"
        label="文章標題"
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
import articleApi from "@/api/articleApi";

const fetchArticles = async (page, limit, nameQuery, sortField, sortOrder) => {
  return await articleApi.fetchArticles(
    page,
    limit,
    nameQuery,
    sortField,
    sortOrder
  );
};

const beforeDeleteArticle = (article) => {
  return `你確定要刪除文章 "${article.title}" 嗎？`;
};

const deleteArticle = async (id) => {
  return await articleApi.deleteArticle(id);
};
</script>
