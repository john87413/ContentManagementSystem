<template>
  <div>
    <h1>{{ id ? "編輯" : "新建" }}分類</h1>
    <el-form
      ref="formRef"
      :rules="rules"
      :model="model"
      label-width="70px"
      @submit.prevent="save"
      v-loading="loading"
    >
      <el-form-item label="上級分類">
        <el-select v-model="model.parent">
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
import categoryApi from "@/api/categoryApi";

const props = defineProps({
  id: String,
});

const router = useRouter();
const model = reactive({ parent: null, name: "" });
const parents = reactive([]);
const loading = ref(false);
const formRef = ref(null);
const rules = {
  name: [{ required: true, message: "名稱不得空白", trigger: "blur" }],
};

const save = async () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (props.id) {
          await categoryApi.updateCategory(props.id, model);
        } else {
          await categoryApi.createCategory(model);
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
};

const fetchCategory = async () => {
  try {
    const res = await categoryApi.fetchCategory(props.id);
    Object.assign(model, res.data);
  } catch (error) {
    ElMessage.error("獲取類別資料失敗: " + error.message);
  }
};

const fetchParents = async () => {
  try {
    const res = await categoryApi.fetchCategories();
    parents.length = 0;
    parents.push(...res.data.filter((c) => c._id !== props.id));
  } catch (error) {
    ElMessage.error("獲取上級類別資料失敗: " + error.message);
  }
};

const cancel = () => {
  router.push("/categories/list");
};

onMounted(async () => {
  loading.value = true;
  await fetchParents();
  props.id && (await fetchCategory());
  loading.value = false;
});
</script>
