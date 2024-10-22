<template>
  <div>
    <h1>{{ id ? "編輯" : "新建" }}飲品</h1>
    <el-form
      v-loading="loadingStore.isLoading"
      :element-loading-text="loadingStore.loadingText"
      ref="formRef"
      :model="model"
      :rules="rules"
      label-width="auto"
      @submit.prevent="save"
    >
      <el-tabs type="border-card" v-model="activeTab">
        <el-tab-pane label="基本資訊" name="basic">
          <el-form-item label="名稱" prop="name">
            <el-input v-model="model.name"></el-input>
          </el-form-item>
          <el-form-item label="價格" prop="price">
            <el-input-number
              :min="1"
              :max="150"
              v-model="model.price"
              placeholder="1~150"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="類型" prop="category">
            <el-select v-model="model.category">
              <el-option
                v-for="item in categories"
                :key="item._id"
                :label="item.name"
                :value="item._id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上傳圖片">
            <ImageUpload
              ref="uploaderRef"
              :originalImageList="model.images"
              :imageLimit="2"
            />
          </el-form-item>
          <el-form-item label="冷熱飲" prop="hotCold">
            <el-radio-group v-model="model.hotCold">
              <el-radio :value="'冷'">只做冷飲</el-radio>
              <el-radio :value="'熱'">只做熱飲</el-radio>
              <el-radio :value="'冷,熱'">冷熱皆可</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="大小" prop="size">
            <el-radio-group v-model="model.size">
              <el-radio :value="'中'">只做中杯</el-radio>
              <el-radio :value="'大'">只做大杯</el-radio>
              <el-radio :value="'中,大'">中杯大杯皆有</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="販賣中" prop="selling">
            <el-switch v-model="model.selling" class="ml-2" />
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="其他" name="others">
          <el-form-item label="中杯熱量" prop="kal">
            <el-input-number
              v-model="model.kal"
              :precision="1"
              :step="1"
              :max="1000"
            />
          </el-form-item>
          <el-form-item label="口碑推薦">
            <el-rate
              style="margin-top: 0.6rem"
              :max="9"
              show-score
              v-model="model.scores.wom"
            ></el-rate>
          </el-form-item>
          <el-form-item label="店家推薦">
            <el-rate
              style="margin-top: 0.6rem"
              :max="9"
              show-score
              v-model="model.scores.store"
            ></el-rate>
          </el-form-item>
          <el-form-item label="飲品介紹">
            <el-input type="textarea" v-model="model.introduction"></el-input>
          </el-form-item>
          <el-form-item label="注意事項">
            <el-input type="textarea" v-model="model.alert"></el-input>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
      <el-form-item style="margin-top: 2rem">
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

import ImageUpload from "@/components/ImageUpload.vue";

import drinkApi from "@/api/drinkApi";
import categoryApi from "@/api/categoryApi";
import { useLoadingStore } from "@/stores/LoadingStore";

// props
const props = defineProps({
  id: String,
});

// router
const router = useRouter();

// form
const formRef = ref(null);
const uploaderRef = ref(null);
const activeTab = ref("basic");
const categories = reactive([]);
const model = reactive({
  name: "",
  price: null,
  category: null,
  images: [],
  hotCold: "冷,熱",
  size: "中,大",
  selling: true,
  kal: 0,
  scores: {
    wom: 0,
    store: 0,
  },
  introduction: "",
  alert: "",
});
const rules = {
  name: { required: true, message: "請輸入飲品名稱", trigger: "blur" },
  price: { required: true, message: "請輸入飲品價格", trigger: "blur" },
  category: { required: true, message: "請輸入飲品類型", trigger: "blur" },
  hotCold: { required: true, message: "請輸入飲品冷熱", trigger: "blur" },
  size: { required: true, message: "請輸入飲品大小", trigger: "blur" },
  selling: { required: true, message: "請輸入是否販賣中", trigger: "blur" },
  kal: { required: true, message: "請輸入中杯熱量", trigger: "blur" },
};

// Loading store
const loadingStore = useLoadingStore();

// methods
const save = async () => {
  loadingStore.showLoading("儲存中...");
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        await uploadImage();

        if (props.id) {
          await drinkApi.updateDrink(props.id, model);
        } else {
          await drinkApi.createDrink(model);
        }

        loadingStore.hideLoading();
        router.push("/drinks/list");

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
  loadingStore.hideLoading();
};

const uploadImage = async () => {
  try {
    const result = await uploaderRef.value.uploadImages();
    model.images = [...result];
  } catch (error) {
    ElMessage.error(`圖片上傳失敗: ${error.errorMessage}`);
  }
};

const fetchDrink = async () => {
  try {
    const res = await drinkApi.fetchDrink(props.id);
    Object.assign(model, res.data);

    uploaderRef.value && uploaderRef.value.setContent(model.images);
  } catch (error) {
    ElMessage.error(`獲取資料失敗: ${error.errorMessage}`);
  }
};

const fetchCategories = async () => {
  try {
    const res = await categoryApi.fetchCategories();
    categories.length = 0;
    categories.push(...res.data);
  } catch (error) {
    ElMessage.error(`獲取類別資料失敗: ${error.errorMessage}`);
  }
};

const cancel = () => {
  router.push("/drinks/list");
};

onMounted(async () => {
  loadingStore.showLoading("處理中...");
  await fetchCategories();
  props.id && (await fetchDrink());
  loadingStore.hideLoading();
});
</script>
