// stores/loadingStore.js
import { defineStore } from "pinia";
import { ref } from "vue";

export const useLoadingStore = defineStore("loading", () => {
    const isLoading = ref(false);
    const loadingText = ref("處理中...");

    const showLoading = (text = "處理中...") => {
        isLoading.value = true;
        loadingText.value = text;
    };

    const hideLoading = () => {
        isLoading.value = false;
        loadingText.value = "";
    };

    return {
        isLoading,
        loadingText,
        showLoading,
        hideLoading,
    };
});
