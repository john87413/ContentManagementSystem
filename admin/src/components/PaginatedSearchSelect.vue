<template>
  <el-select
    :model-value="modelValue"
    @update:model-value="updateValue"
    filterable
    remote
    :remote-method="handleSearch"
    :loading="loading"
    :placeholder="placeholder"
    @visible-change="handleVisibleChange"
    popper-class="paginated-select-dropdown"
  >
    <el-option
      v-for="item in options"
      :key="item[valueKey]"
      :label="item[labelKey]"
      :value="item[valueKey]"
    ></el-option>

    <!-- 載入更多選項 -->
    <div v-if="hasMore" class="load-more-option" @click.stop="loadMoreData">
      <span v-if="!loadingMore">載入更多...</span>
      <span v-else>載入中...</span>
    </div>

    <!-- 無結果提示 -->
    <el-empty v-if="options.length === 0" description="無符合資料"></el-empty>
  </el-select>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";

const props = defineProps({
  modelValue: {
    type: [String, Number, Array, Object],
    default: "",
  },
  placeholder: {
    type: String,
    default: "請選擇",
  },
  fetchMethod: {
    type: Function,
    required: true,
  },
  valueKey: {
    type: String,
    default: "_id",
  },
  labelKey: {
    type: String,
    default: "name",
  },
  pageSize: {
    type: Number,
    default: 10,
  },
  immediate: {
    type: Boolean,
    default: true, // 是否在組件掛載時立即載入第一頁數據
  },
  selectedItemData: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["update:modelValue"]);

// 元件狀態
const loading = ref(false);
const loadingMore = ref(false);
const options = ref([]);
const currentPage = ref(1);
const hasMore = ref(true);
const searchQuery = ref("");
const total = ref(0);

// 載入初始資料
const loadInitialData = async () => {
  loading.value = true;

  try {
    currentPage.value = 1;
    hasMore.value = true;
    const response = await props.fetchMethod(1, props.pageSize, "");

    options.value = response.data;
    total.value = response.total;

    // 判斷是否還有更多數據
    hasMore.value = options.value.length < total.value;
  } catch (error) {
    ElMessage.error(`載入資料失敗: ${error.errorMessage}`);
  } finally {
    loading.value = false;
  }
};

// 載入更多數據
const loadMoreData = async () => {
  if (loadingMore.value || !hasMore.value) return;

  loadingMore.value = true;

  try {
    const nextPage = currentPage.value + 1;
    const response = await props.fetchMethod(
      nextPage,
      props.pageSize,
      searchQuery.value
    );

    // 格式化並添加新數據
    const newOptions = response.data;
    options.value = [...options.value, ...newOptions];

    // 更新頁碼和狀態
    currentPage.value = nextPage;
    total.value = response.total;
    hasMore.value = options.value.length < total.value;
  } catch (error) {
    ElMessage.error(`載入更多資料失敗: ${error.errorMessage}`);
  } finally {
    loadingMore.value = false;
  }
};

// 處理搜尋
const handleSearch = async (query) => {
  searchQuery.value = query;

  if (query === "") {
    // 如果清空搜尋，恢復初始數據
    return loadInitialData();
  }

  loading.value = true;

  try {
    currentPage.value = 1;
    const response = await props.fetchMethod(1, props.pageSize, query);

    options.value = response.data;
    total.value = response.total;
    // 判斷是否有更多搜尋結果
    hasMore.value = options.value.length < total.value;
  } catch (error) {
    ElMessage.error(`搜尋資料失敗: ${error.errorMessage}`);
  } finally {
    loading.value = false;
  }
};

// 處理下拉框顯示變化
const handleVisibleChange = (visible) => {
  if (visible && options.value.length === 0 && !searchQuery.value) {
    loadInitialData();
  }
};

// 處理值更新
const updateValue = (val) => {
  emit("update:modelValue", val);
};

// 監聽 selectedItemData 的變化
watch(() => props.selectedItemData, (newValue) => {
  if (newValue && props.modelValue) {
    // 檢查該項目是否已在選項列表中
    const existingItem = options.value.find(item => item[props.valueKey] === props.modelValue);
    if (!existingItem) {
      options.value = [newValue, ...options.value];
    }
  }
}, { immediate: true });

// 組件掛載時加載初始數據
onMounted(() => {
  if (props.immediate) {
    loadInitialData();
  }
});
</script>

<style>
.paginated-select-dropdown .load-more-option {
  padding: 8px;
  text-align: center;
  color: #409eff;
  cursor: pointer;
  font-size: 1em;
  border-top: 1px solid #e4e7ed;
}

.paginated-select-dropdown .load-more-option:hover {
  background-color: #f5f7fa;
}
</style>
