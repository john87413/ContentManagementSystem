<template>
    <el-select
        style="width: 200px;"
        v-model="selectedValue"
        placeholder="請選擇"
        filterable
        multiple
        :filter-method="debouncedTestFilter"
    >
        <el-option
            v-for="item in categories"
            :key="item.id"
            :label="item.name"
            :value="item.name"
        >
        </el-option>
    </el-select>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from "element-plus";
import categoryApi from "@/api/categoryApi";

const selectedValue = ref([]);
const categories = ref([]);
const loading = ref(false);
const searchName = ref("");
const currentPage = ref(1);
const noValue = ref(false);

const fetchCategories = async (page = 1, nameQuery = "") => {
  try {
    loading.value = true;
    const res = await categoryApi.fetchCategories(page, 10, nameQuery);
    res.data.categories.length < 10 ? noValue.value = true : noValue.value = false
    loading.value = false;
    console.log(res.data.categories.length);
    return res.data.categories
  } catch (error) {
    ElMessage.error("取得資料失敗:" + error.message);
  }
};

// Method to load more data
const loadmore = async () => {
    if (noValue.value) return
    console.log("load more");
    currentPage.value++;
    const result = await fetchCategories(currentPage.value, searchName.value);
    categories.value = [...categories.value, ...result];
};

const  debounce = (fn, delay) => {
    let timeout;
    return function (...args) {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
            fn(...args);
        }, delay);
    };
}

const testFilter = async (val) => {
    if (val && val !== "") {
        categories.value = [];
        noValue.value = false
        searchName.value = val;
        currentPage.value = 1
        const result = await fetchCategories(1, val);
        categories.value = [...result];
    }else if(val === "" && searchName.value !== ""){
        categories.value = [];
        noValue.value = false
        searchName.value = "";
        currentPage.value = 1
        const result = await fetchCategories();
        categories.value = [...result];
    }
}

const debouncedTestFilter = debounce(testFilter, 300); // 300 毫秒的防抖延遲

// Lifecycle hook for initial data load
onMounted(async () => {
    const result = await fetchCategories();
    categories.value = [...result];

    let scrollWrap = document.querySelector('.el-select-dropdown .el-scrollbar .el-select-dropdown__wrap')
    scrollWrap?.addEventListener('scroll', () => {
        if (scrollWrap?.scrollTop + scrollWrap?.clientHeight >= scrollWrap?.scrollHeight) {
            loadmore();
        }
    })
});

</script>
