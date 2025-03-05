<template>
  <div>
    <h1>{{ title }}</h1>
    <el-form
      :model="searchForm"
      :inline="true"
      style="margin-bottom: 1rem"
      @submit.prevent="handleSearch"
    >
      <el-form-item :label="searchLabel">
        <el-input
          v-model="searchForm.name"
          :placeholder="searchPlaceholder"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">搜尋</el-button>
        <el-button type="primary" @click="clearSearch">清除搜尋</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="items"
      v-loading="loadingStore.isLoading"
      :element-loading-text="loadingStore.loadingText"
      @sort-change="handleSortChange"
    >
      <slot name="table-columns" :formatDate="formatDate"></slot>
      <el-table-column fixed="right" label="操作" width="200">
        <template #default="{ row }">
          <el-button type="primary" @click="editItem(row._id)">編輯</el-button>
          <el-button type="primary" @click="deleteItem(row)">刪除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top: 2rem"
      background
      size="default"
      layout="prev, pager, next, total"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="totalItems"
      @current-change="handlePageChange"
    >
    </el-pagination>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";

import { useLoadingStore } from "@/stores/LoadingStore";

const props = defineProps({
  title: String,
  searchLabel: String,
  searchPlaceholder: String,
  fetchItemsApi: Function,
  beforeDeleteItem: Function,
  deleteItemApi: Function,
  editPath: String,
  itemsKey: String,
});

const router = useRouter();

const items = ref([]);
const currentPage = ref(1);
const totalItems = ref(0);
const pageSize = ref(10);
const searchForm = ref({
  name: "",
});
const sortParams = ref({
  prop: "",
  order: "",
});
const loadingStore = useLoadingStore();

const fetchData = async (page = 1, limit = 10, nameQuery = "") => {
  try {
    loadingStore.showLoading("加載中...");
    const res = await props.fetchItemsApi(
      page,
      limit,
      nameQuery,
      sortParams.value.prop,
      sortParams.value.order
    );
    console.log(res.data[props.itemsKey]);
    items.value = res.data[props.itemsKey];
    totalItems.value = res.data.total;
  } catch (error) {
    ElMessage.error(`取得資料失敗: ${error.errorMessage}`);
  } finally {
    loadingStore.hideLoading();
  }
};

const editItem = (id) => {
  router.push({ path: `${props.editPath}/${id}` });
};

const deleteItem = async (item) => {
  try {
    await ElMessageBox.confirm(props.beforeDeleteItem(item), "警告", {
      confirmButtonText: "確定",
      cancelButtonText: "取消",
      type: "warning",
    });

    loadingStore.showLoading("處理中...");
    await props.deleteItemApi(item._id);
    ElMessage.success("刪除成功");
    await fetchData(currentPage.value, pageSize.value, searchForm.value.name);
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error(`刪除失敗: ${error.errorMessage}`);
    }
  } finally {
    loadingStore.hideLoading();
  }
};

const handlePageChange = (newPage) => {
  currentPage.value = newPage;
  fetchData(currentPage.value, pageSize.value, searchForm.value.name);
};

const handleSearch = () => {
  currentPage.value = 1;
  fetchData(currentPage.value, pageSize.value, searchForm.value.name);
};

const clearSearch = () => {
  searchForm.value.name = "";
  currentPage.value = 1;
  fetchData(currentPage.value, pageSize.value);
};

const handleSortChange = ({ prop, order }) => {
  sortParams.value.prop = prop;
  sortParams.value.order =
    order === "ascending" ? "asc" : order === "descending" ? "desc" : "";

  fetchData(currentPage.value, pageSize.value, searchForm.value.name);
};

const formatDate = (date) => {
  if (!date) return "";
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };
  return new Intl.DateTimeFormat("zh-TW", options).format(new Date(date));
};

onMounted(async () => {
  await fetchData();
});
</script>
