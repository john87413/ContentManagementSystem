<template>
  <div>
    <h1>{{ id ? "編輯" : "新建" }}輪播圖</h1>
    <el-form
      v-loading="loadingStore.isLoading"
      :element-loading-text="loadingStore.loadingText"
      ref="formRef"
      :model="model"
      :rules="rules"
      label-width="70px"
      @submit.prevent="save"
    >
      <el-form-item label="名稱" prop="name">
        <el-input v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item label="輪播圖">
        <el-button @click="addArticle"> 增加輪播圖 </el-button>
      </el-form-item>
      <el-row type="flex" style="flex-wrap: wrap; margin: 1rem 1rem 1rem 3rem">
        <el-col :md="12" v-for="(item, i) in model.articles" :key="i">
          <el-form-item
            label="文章"
            :prop="`articles.${i}.article`"
            :rules="{
              required: true,
              message: '請選擇文章',
              trigger: 'blur',
            }"
          >
            <PaginatedSearchSelect
              v-model="item.article"
              :fetch-method="fetchArticlesForSelect"
              :selected-item-data="selectedArticlesInfo[item.article]"
              :label-key="'title'"
              placeholder="請選擇或搜尋文章"
              @update:model-value="(val) => handleArticleChange(i, val)"
            />
          </el-form-item>
          <el-form-item v-if="item.article && selectedArticlesInfo[item.article]" label="文章圖片">
            <img
              class="preview-image"
              :src="selectedArticlesInfo[item.article]?.image?.imgUrl"
              alt=""
            />
          </el-form-item>
          <el-form-item>
            <el-button type="danger" @click="deleteArticle(i)">
              刪除
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
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
import PaginatedSearchSelect from "@/components/PaginatedSearchSelect.vue";
import carouselApi from "@/api/carouselApi";
import articleApi from "@/api/articleApi";

const props = defineProps({
  id: String,
});

const router = useRouter();

const loadingStore = useLoadingStore();

const model = reactive({ name: "", articles: [] });
// 用來儲存選中的文章資訊，包含圖片URL
const selectedArticlesInfo = reactive({});
const formRef = ref(null);
const rules = {
  name: [{ required: true, message: "名稱不得空白", trigger: "blur" }],
};

const addArticle = () => {
  if (model.articles.length >= 6) {
    ElMessage.error("最多新增6個輪播圖");
    return;
  }
  model.articles.push({ article: "" });
};

const deleteArticle = (index) => {
  model.articles.splice(index, 1);
};

const hasDuplicates = () => {
  const ids = model.articles
    .map((item) => item.article)
    .filter((id) => id !== "" && id !== null);
  return new Set(ids).size !== ids.length;
};

const handleArticleChange = async (index, newArticleId) => {
  // 先檢查是否有重複
  if (hasDuplicates()) {
    ElMessage.error("不能選擇重複文章");
    model.articles[index].article = "";
    return;
  }
};

const fetchArticlesForSelect = async (page, limit, query) => {
  try {
    const response = await articleApi.fetchArticles(page, limit, query, "title", "asc");
    
    const articleData = response.data.articles || [];
    
    articleData.forEach(article => {
      if (article._id && !selectedArticlesInfo[article._id]) {
        selectedArticlesInfo[article._id] = article;
      }
    });
    
    return {
      data: articleData,
      total: response.data.total || 0
    };
  } catch (error) {
    ElMessage.error(`獲取文章資料失敗: ${error.errorMessage}`);
    return { data: [], total: 0 };
  }
};

const save = async () => {
  loadingStore.showLoading("儲存中...");

  try {
    if (model.isProtected) {
      ElMessage.error("系統範例資料不可編輯");
    } else {
      await formRef.value.validate(async (valid) => {
        if (valid) {
          try {
            if (props.id) {
              await carouselApi.updateCarousel(props.id, model);
            } else {
              await carouselApi.createCarousel(model);
            }
            router.push("/carousels/list");
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

const fetchCarousel = async () => {
  try {
    const res = await carouselApi.fetchCarousel(props.id);
    Object.assign(model, res.data);
    
    // 載入所有選定文章的詳細資訊
    for (const item of model.articles) {
      if (item.article && !selectedArticlesInfo[item.article]) {
        try {
          loadingStore.showLoading(`載入文章資訊...`);
          const articleRes = await articleApi.fetchArticle(item.article);
          selectedArticlesInfo[item.article] = articleRes.data;
        } catch (err) {
          ElMessage.error(`無法載入文章資訊`);
        } finally {
          loadingStore.hideLoading();
        }
      }
    }
  } catch (error) {
    ElMessage.error(`獲取輪播圖資料失敗: ${error.errorMessage}`);
  }
};

const cancel = () => {
  router.push("/carousels/list");
};

onMounted(async () => {
  loadingStore.showLoading("加載中...");
  props.id && (await fetchCarousel());
  loadingStore.hideLoading();
});
</script>

<style scoped>
.preview-image {
  width: 148px;
  height: 148px;
  object-fit: contain;
}
</style>