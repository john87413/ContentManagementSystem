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
        <el-select v-model="model.parent">
          <el-option label="無 (作為上級分類)" value=""></el-option>
          <el-option
            v-for="item in parents"
            :key="item._id"
            :label="item.name"
            :value="item._id"
          ></el-option>
        </el-select>
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

const props = defineProps({
  id: String,
});

// Router
const router = useRouter();

// Loading store
const loadingStore = useLoadingStore();

const model = reactive({ parent: null, name: "" });
const parents = reactive([]);
const formRef = ref(null);
const rules = {
  name: [{ required: true, message: "名稱不得空白", trigger: "blur" }],
};

const save = async () => {
  loadingStore.showLoading("儲存中...");

  try {
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
  } catch (error) {
    ElMessage.error(`獲取類別資料失敗: ${error.errorMessage}`);
  }
};

const fetchParents = async () => {
  try {
    const res = await categoryApi.fetchCategories();
    parents.length = 0;
    parents.push(...res.data.filter((c) => c._id !== props.id));
  } catch (error) {
    ElMessage.error(`獲取上級類別資料失敗: ${error.errorMessage}`);
  }
};

const cancel = () => {
  router.push("/categories/list");
};

onMounted(async () => {
  loadingStore.showLoading("加載中...");
  await fetchParents();
  props.id && (await fetchCategory());
  loadingStore.hideLoading();
});
</script>
