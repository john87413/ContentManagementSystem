<template>
  <div>
    <h1>{{ id ? "編輯" : "新建" }}文章</h1>
    <el-form
      v-loading="loadingStore.isLoading"
      :element-loading-text="loadingStore.loadingText"
      ref="formRef"
      :model="model"
      :rules="rules"
      label-width="70px"
      @submit.prevent="save"
    >
      <el-form-item label="標題" prop="title">
        <el-input v-model="model.title"></el-input>
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
          :originalImageList="model.image ? [model.image] : []"
          :imageLimit="1"
        />
      </el-form-item>
      <el-form-item label="內容" prop="content">
        <QuillEditor v-model="model.content" ref="quillEditorRef" />
      </el-form-item>
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
import { useLoadingStore } from "@/stores/LoadingStore";

import ImageUpload from "@/components/ImageUpload.vue";
import QuillEditor from "@/components/QuillEditor.vue";

import articleApi from "@/api/articleApi";
import categoryApi from "@/api/categoryApi";

// props
const props = defineProps({
  id: String,
});

// router
const router = useRouter();

// form
const formRef = ref(null);
const uploaderRef = ref(null);
const quillEditorRef = ref(null);
const categories = reactive([]);
const model = reactive({
  title: "",
  category: null,
  content: "",
  image: null,
});
// const rules = {
//   title: { required: true, message: "請輸入文章標題", trigger: "blur" },
//   category: { required: true, message: "請輸入文章類型", trigger: "blur" },
// };

// Loading store
const loadingStore = useLoadingStore();

// methods
const save = async () => {
  loadingStore.showLoading("儲存中...");
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // Run both functions in parallel
        await Promise.all([
          uploadImage(),
          quillEditorRef.value.uploadImageAndReplaceUrl()
        ]);

        // Get content from Quill editor
        model.content = quillEditorRef.value.getContent();

        if (props.id) {
          await articleApi.updateArticle(props.id, model);
        } else {
          await articleApi.createArticle(model);
        }

        loadingStore.hideLoading();
        router.push("/articles/list");

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
    model.image = result[0];
  } catch (error) {
    ElMessage.error(`圖片上傳失敗: ${error.errorMessage}`);
  }
};

const fetchArticle = async () => {
  try {
    const res = await articleApi.fetchArticle(props.id);
    Object.assign(model, res.data);

    quillEditorRef.value && quillEditorRef.value.setContent(model.content);
    uploaderRef.value && uploaderRef.value.setContent(model.image ? [model.image] : []);
  } catch (error) {
    ElMessage.error(`獲取資料失敗: ${error.errorMessage}`);
  }
};

const fetchCategories = async () => {
  try {
    const res = await categoryApi.fetchCategories();
    categories.length = 0;
    categories.push(...res.data.filter((c) => c._id !== props.id));
  } catch (error) {
    ElMessage.error(`獲取資料失敗: ${error.errorMessage}`);
  }
};

const cancel = () => {
  router.push("/articles/list");
};

onMounted(async () => {
  loadingStore.showLoading("處理中...");
  await fetchCategories();
  props.id && (await fetchArticle());
  loadingStore.hideLoading();
});
</script>