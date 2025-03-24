<template>
  <div>
    <h1>{{ id ? "編輯" : "新建" }}分類</h1>
    <el-form
      v-loading="loadingStore.isLoading"
      :element-loading-text="loadingStore.loadingText"
      ref="formRef"
      :model="model"
      :rules="rules"
      style="max-width: 500px"
      label-width="70px"
      @submit.prevent="save"
    >
      <el-form-item label="上級分類">
        <PaginatedSearchSelect
          v-model="model.parent"
          :fetch-method="fetchCategoriesForSelect"
          :selected-item-data="selectedParentCategory"
          placeholder="請選擇或搜尋上級分類"
        />
      </el-form-item>
      <el-form-item label="名稱" prop="name">
        <el-input v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit">儲存</el-button>
        <el-button plain @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";

import { useLoadingStore } from "@/stores/LoadingStore";
import categoryApi from "@/api/categoryApi";

import PaginatedSearchSelect from "@/components/PaginatedSearchSelect.vue";

const props = defineProps({
  id: String,
});

// Router
const router = useRouter();

// Loading store
const loadingStore = useLoadingStore();

const model = reactive({ parent: null, name: "" });
const selectedParentCategory = ref(null);
const formRef = ref(null);
const rules = {
  name: [{ required: true, message: "名稱不得空白", trigger: "blur" }],
};

const save = async () => {
  loadingStore.showLoading("儲存中...");

  try {
    if (model.isProtected) {
      ElMessage.error("系統範例資料不可編輯");
    } else {
      await formRef.value.validate(async (valid) => {
        if (valid) {
          const formData = { ...model };
          if (formData.parent === undefined || formData.parent === "") {
            formData.parent = null;
          }

          try {
            if (props.id) {
              await categoryApi.updateCategory(props.id, formData);
            } else {
              await categoryApi.createCategory(formData);
            }
            router.push("/categories/list");
            ElMessage({ type: "success", message: "儲存成功" });
          } catch (error) {
            ElMessage.error(`儲存失敗: ${error.errorMessage}`);
          }
        } else {
          ElMessage.error("請修正表單中的錯誤");
        }
      });
    }
  } finally {
    loadingStore.hideLoading();
  }
};

const fetchCategory = async () => {
  try {
    const res = await categoryApi.fetchCategory(props.id);
    const categoryData = { ...res.data };
    categoryData.parent = categoryData.parent || "";
    Object.assign(model, categoryData);

    // 如果有父分類，獲取其完整信息
    if (categoryData.parent && typeof categoryData.parent === "string") {
      const parentRes = await categoryApi.fetchCategory(categoryData.parent);
      selectedParentCategory.value = parentRes.data;
    }
  } catch (error) {
    ElMessage.error(`獲取類別資料失敗: ${error.errorMessage}`);
  }
};

const fetchCategoriesForSelect = async (page, limit, query) => {
  try {
    const response = await categoryApi.fetchCategories(page, limit, query);
    // 基本檢查，確保資料存在
    if (!response.data || !response.data.categories) {
      return { data: [], total: 0 };
    }

    // 過濾掉自己 (避免循環引用)
    const filteredCategories = response.data.categories.filter(
      (cat) => cat._id !== props.id
    );

    // 如果是第一頁且沒有搜索詞，添加"無上級分類"選項
    if (page === 1 && !query) {
      return {
        data: [{ _id: "", name: "無 (作為上級分類)" }, ...filteredCategories],
        total: response.data.total + 1, // 總數加1
      };
    }

    // 搜尋模式或非第一頁，只返回過濾後的結果
    return {
      data: filteredCategories,
      total: response.data.total,
    };
  } catch (error) {
    ElMessage.error(`獲取類別資料失敗: ${error.errorMessage}`);
    return { data: [], total: 0 };
  }
};

const cancel = () => {
  router.push("/categories/list");
};

onMounted(async () => {
  loadingStore.showLoading("加載中...");
  props.id && (await fetchCategory());
  loadingStore.hideLoading();
});
</script>
