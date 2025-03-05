<template>
  <div>
    <h1>{{ id ? "編輯" : "新建" }}配料</h1>
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
      <el-form-item label="名稱" prop="name">
        <el-input v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item label="價格" prop="price">
        <el-input-number
          :min="1"
          :max="100"
          v-model="model.price"
          placeholder="1~100"
        ></el-input-number>
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
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";

import { useLoadingStore } from "@/stores/LoadingStore";
import ingredientApi from "@/api/ingredientApi";

const props = defineProps({
  id: String,
});

const router = useRouter();

const loadingStore = useLoadingStore();

const formRef = ref(null);
const model = reactive({
  name: "",
  price: null,
});
const rules = {
  name: { required: true, message: "請輸入配料名稱", trigger: "blur" },
  price: { required: true, message: "請輸入配料價格", trigger: "blur" },
};

const save = async () => {
  loadingStore.showLoading("儲存中...");

  try {
    await formRef.value.validate(async (valid) => {
      if (valid) {
        try {
          if (props.id) {
            await ingredientApi.updateIngredient(props.id, model);
          } else {
            await ingredientApi.createIngredient(model);
          }
          router.push("/ingredients/list");
          ElMessage({
            type: "success",
            message: "儲存成功",
          });
        } catch (error) {
          ElMessage.error(`儲存失敗: ${error.errorMessage}`);
        }
      } else {
        ElMessage({
          type: "warning",
          message: "請依照指示完成表單",
        });
      }
    });
  } finally {
    loadingStore.hideLoading();
  }
};

const fetchIngredient = async () => {
  try {
    const res = await ingredientApi.fetchIngredient(props.id);
    Object.assign(model, res.data);
  } catch (error) {
    ElMessage.error(`獲取配料資料失敗: ${error.errorMessage}`);
  }
};

const cancel = () => {
  router.push("/ingredients/list");
};

onMounted(async () => {
  loadingStore.showLoading("載入中...");
  if (props.id) {
    await fetchIngredient();
  }
  loadingStore.hideLoading();
});
</script>
