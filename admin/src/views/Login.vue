<template>
  <div class="login-container">
    <el-form
      v-loading="loadingStore.isLoading"
      :element-loading-text="loadingStore.loadingText"
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
          :loading="loadingStore.isLoading"
        >
          登入
        </el-button>
      </el-form-item>
      <div class="register-link">
        還沒有帳號？<el-link type="primary" @click="goToRegister"
          >註冊帳號</el-link
        >
      </div>
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
  if (!loginFormRef.value) return;

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
    ElMessage.error(error.errorMessage || "登入失敗");
  } finally {
    loadingStore.hideLoading();
  }
};

const goToRegister = () => {
  router.push("/register");
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

.register-link {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
}
</style>
