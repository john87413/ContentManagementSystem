// stores/authStore.js
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import userApi from "@/api/userApi";

export const useAuthStore = defineStore("auth", () => {
    const user = ref(JSON.parse(localStorage.getItem('user') || 'null'));

    // 計算屬性：是否已登入
    const isAuthenticated = computed(() => !!user.value);

    // 登入方法
    const login = async (credentials) => {
        const res = await userApi.login(credentials);
        user.value = res.data.user;

        // 儲存 token 和用戶信息
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        console.log(res);
        return res;
    };

    // 登出方法
    const logout = () => {
        user.value = null;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    };

    // 獲取目前使用者
    const getUser = () => {
        return user.value;
    };

    return {
        user,
        isAuthenticated,
        login,
        logout,
        getUser
    };
});