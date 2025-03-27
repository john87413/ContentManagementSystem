<template>
  <div class="register-container">
    <el-form
      v-loading="loadingStore.isLoading"
      :element-loading-text="loadingStore.loadingText"
      ref="registerFormRef"
      :model="registerForm"
      :rules="registerRules"
      class="register-form"
      @submit.prevent="handleRegister"
    >
      <h2 class="register-title">註冊帳號</h2>
      <el-form-item prop="username">
        <el-input v-model="registerForm.username" placeholder="帳號">
          <template #prefix>
            <el-icon><User /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="registerForm.password"
          type="password"
          placeholder="密碼"
          show-password
        >
          <template #prefix>
            <el-icon><Lock /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="confirmPassword">
        <el-input
          v-model="registerForm.confirmPassword"
          type="password"
          placeholder="確認密碼"
          show-password
        >
          <template #prefix>
            <el-icon><Lock /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="role">
        <el-select
          v-model="registerForm.role"
          placeholder="選擇角色"
          class="role-select"
        >
          <el-option label="內容管理員" value="contentManager"></el-option>
          <el-option label="行銷管理員" value="marketingManager"></el-option>
          <el-option label="系統管理員" value="systemAdmin"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          native-type="submit"
          class="register-button"
          :loading="loadingStore.isLoading"
        >
          註冊
        </el-button>
      </el-form-item>
      <div class="login-link">
        已有帳號？<el-link type="primary" @click="goToLogin">登入</el-link>
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
import userApi from "@/api/userApi";

const router = useRouter();
const loadingStore = useLoadingStore();

const registerFormRef = ref(null);

const registerForm = reactive({
  username: "",
  password: "",
  confirmPassword: "",
  role: "contentManager",
});

// 密碼確認的驗證方法
const validateConfirmPassword = (rule, value, callback) => {
  if (value !== registerForm.password) {
    callback(new Error("兩次輸入的密碼不一致"));
  } else {
    callback();
  }
};

const registerRules = {
  username: [
    { required: true, message: "請輸入帳號", trigger: "blur" },
    { min: 3, max: 20, message: "帳號長度在3到20個字符之間", trigger: "blur" },
  ],
  password: [
    { required: true, message: "請輸入密碼", trigger: "blur" },
    { min: 6, message: "密碼至少需要6個字符", trigger: "blur" },
  ],
  confirmPassword: [
    { required: true, message: "請確認密碼", trigger: "blur" },
    { validator: validateConfirmPassword, trigger: "blur" },
  ],
  role: [{ required: true, message: "請選擇角色", trigger: "change" }],
};

const handleRegister = async () => {
  if (!registerFormRef.value) return;

  try {
    await registerFormRef.value.validate(async (valid) => {
      if (valid) {
        loadingStore.showLoading("註冊中...");

        try {
          // 準備要發送的數據
          const userData = {
            username: registerForm.username,
            password: registerForm.password,
            role: registerForm.role,
          };

          // 呼叫 API 創建用戶
          await userApi.createUser(userData);

          ElMessage.success("註冊成功，請登入");
          router.push("/login");
        } catch (error) {
          ElMessage.error(error.errorMessage || "註冊失敗");
        } finally {
          loadingStore.hideLoading();
        }
      }
    });
  } catch (error) {
    ElMessage.error("表單驗證失敗");
    loadingStore.hideLoading();
  }
};

const goToLogin = () => {
  router.push("/login");
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.register-form {
  width: 400px;
  padding: 30px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.register-title {
  text-align: center;
  margin-bottom: 20px;
}

.register-button {
  width: 100%;
}

.login-link {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
}

.role-select {
  width: 100%;
}
</style>
