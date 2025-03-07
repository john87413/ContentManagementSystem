<template>
  <div class="login-container">
    <el-form
      ref="loginFormRef"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      @submit.prevent="handleLogin"
    >
      <h2 class="login-title">管理系統登入</h2>
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" placeholder="帳號">
          <template #prefix>
            <el-icon><User /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          placeholder="密碼"
          show-password
        >
          <template #prefix>
            <el-icon><Lock /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          native-type="submit"
          class="login-button"
          :loading="loading"
        >
          登入
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { User, Lock } from "@element-plus/icons-vue";

import { useLoadingStore } from "@/stores/LoadingStore";
import { useAuthStore } from "@/stores/AuthStore";

const router = useRouter();
const loadingStore = useLoadingStore();
const authStore = useAuthStore();

const loginFormRef = ref(null);
const loading = ref(false);

const loginForm = reactive({
  username: "",
  password: "",
});

const loginRules = {
  username: [
    {
      required: true,
      message: "請輸入帳號",
      trigger: "blur",
    },
  ],
  password: [
    {
      required: true,
      message: "請輸入密碼",
      trigger: "blur",
    },
  ],
};

const handleLogin = async () => {
  if (!loginFormRef.value) return; // why need this line?

  try {
    await loginFormRef.value.validate(async (valid) => {
      if (valid) {
        loadingStore.showLoading("登入中...");
        await authStore.login(loginForm);

        ElMessage.success("登入成功");
        router.push("/");
      }
    });
  } catch (error) {
    console.log(error);
    ElMessage.error(error.errorMessage || "登入失敗");
  } finally {
    loadingStore.hideLoading();
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.login-form {
  width: 400px;
  padding: 30px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.login-title {
  text-align: center;
  margin-bottom: 20px;
}

.login-button {
  width: 100%;
}
</style>
