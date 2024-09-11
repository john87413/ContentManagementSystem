<template>
  <div>
    <h1>門市列表</h1>
    <el-form
      :model="searchForm"
      :inline="true"
      style="margin-bottom: 1rem"
      @submit.prevent="handleSearch"
    >
      <el-form-item label="門市名稱">
        <el-input
          v-model="searchForm.name"
          placeholder="搜尋門市名稱"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">搜尋</el-button>
        <el-button type="primary" @click="ClearSearch">清除搜尋</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="shops" v-loading="loading">
      <el-table-column prop="name" label="門市名稱"> </el-table-column>
      <el-table-column prop="city" label="縣市"> </el-table-column>
      <el-table-column prop="district" label="區域"> </el-table-column>
      <el-table-column prop="updatedAt" label="更新時間" width="220">
        <template #default="{ row }">
          {{ formatDate(row.updatedAt) }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template #default="{ row }">
          <el-button type="primary" @click="editShop(row._id)">編輯</el-button>
          <el-button type="primary" @click="deleteShop(row._id, row.name)"
            >刪除</el-button
          >
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
import shopApi from "@/api/shopApi";

// router
const router = useRouter();

// pagination list
const shops = ref([]);
const loading = ref(false);
const currentPage = ref(1);
const totalItems = ref(0);
const pageSize = ref(10);

// search
const searchForm = ref({
  name: "",
});

const fetchShops = async (page = 1, limit = 10, nameQuery = "") => {
  try {
    loading.value = true;
    const res = await shopApi.fetchShops(page, limit, nameQuery);
    shops.value = res.data.shops;
    totalItems.value = res.data.total;
    loading.value = false;
  } catch (error) {
    ElMessage.error("取得資料失敗:" + error.message);
  }
};

const editShop = (id) => {
  router.push({ path: `/shops/edit/${id}` });
};

const deleteShop = async (id, name) => {
  try {
    await ElMessageBox.confirm(`你確定要刪除 "${name}" 嗎？`, "警告", {
      confirmButtonText: "確定",
      cancelButtonText: "取消",
      type: "warning",
    });
    await shopApi.deleteShop(id);
    ElMessage.success("刪除成功");
    await fetchShops(currentPage.value, pageSize.value);
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("刪除失敗: " + error.message);
    }
  }
};

const handlePageChange = (newPage) => {
  currentPage.value = newPage;
  fetchShops(currentPage.value, pageSize.value, searchForm.value.name);
};

const handleSearch = () => {
  currentPage.value = 1;
  fetchShops(currentPage.value, pageSize.value, searchForm.value.name);
};

const ClearSearch = () => {
  searchForm.value.parent = "";
  searchForm.value.name = "";
  currentPage.value = 1;
  fetchShops(currentPage.value, pageSize.value);
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
  await fetchShops();
});
</script>
