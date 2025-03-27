<template>
  <div>
    <h1>{{ id ? "編輯" : "新建" }}用戶</h1>
    <el-form
      v-loading="loadingStore.isLoading"
      :element-loading-text="loadingStore.loadingText"
      ref="formRef"
      :model="model"
      :rules="rules"
      style="max-width: 500px"
      label-width="80px"
      @submit.prevent="save"
    >
      <el-form-item label="帳號" prop="username">
        <el-input v-model="model.username"></el-input>
      </el-form-item>
      <el-form-item :label="id ? '新密碼' : '密碼'" prop="password">
        <el-input
          v-model="model.password"
          type="password"
          show-password
          :placeholder="id ? '若不修改密碼可留空' : '請輸入密碼'"
        ></el-input>
      </el-form-item>
      <el-form-item label="確認密碼" prop="confirmPassword">
        <el-input
          v-model="model.confirmPassword"
          type="password"
          show-password
          :placeholder="id ? '再次輸入密碼' : '再次確認密碼'"
        ></el-input>
      </el-form-item>
      <el-form-item label="角色" prop="role">
        <el-select v-model="model.role">
          <el-option label="內容管理員" value="contentManager"></el-option>
          <el-option label="行銷管理員" value="marketingManager"></el-option>
          <el-option label="系統管理員" value="systemAdmin"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
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
import userApi from "@/api/userApi";

const props = defineProps({
  id: String,
});

const router = useRouter();
const loadingStore = useLoadingStore();

const formRef = ref(null);
const model = reactive({
  username: "",
  password: "",
  confirmPassword: "",
  role: "contentManager",
});

const validateConfirmPassword = (rule, value, callback) => {
  if (model.password !== value) {
    callback(new Error("兩次輸入的密碼不一致"));
  } else {
    callback();
  }
};

const rules = {
  username: [
    { required: true, message: "請輸入帳號", trigger: "blur" },
    { min: 3, max: 20, message: "帳號長度在3到20個字符之間", trigger: "blur" },
  ],
  password: [
    {
      // 只有新建用戶時密碼為必填
      required: !props.id,
      message: "請輸入密碼",
      trigger: "blur",
    },
    {
      validator: (rule, value, callback) => {
        // 新建用戶或編輯時有輸入密碼時，檢查密碼長度
        if (value && value.length < 6) {
          callback(new Error("密碼至少需要6個字符"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
  confirmPassword: [
    {
      // 只有新建用戶或有輸入密碼時才需要確認密碼
      required: !props.id || !!model.password,
      message: "請確認密碼",
      trigger: "blur",
    },
    {
      validator: validateConfirmPassword,
      trigger: "blur",
    },
  ],
  role: [{ required: true, message: "請選擇角色", trigger: "change" }],
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
            // 準備保存的數據
            const saveData = {
              username: model.username,
              role: model.role,
            };

            // 如果密碼不為空，加入密碼
            if (model.password) {
              saveData.password = model.password;
            }

            if (props.id) {
              await userApi.updateUser(props.id, saveData);
            } else {
              await userApi.createUser(saveData);
            }

            router.push("/users/list");
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
    }
  } finally {
    loadingStore.hideLoading();
  }
};

const fetchUser = async () => {
  try {
    const res = await userApi.fetchUser(props.id);
    // 僅載入帳號和角色，密碼不回傳
    Object.assign(model, {
      username: res.data.username,
      role: res.data.role,
      password: "", // 清空密碼
      confirmPassword: "", // 清空確認密碼
    });
  } catch (error) {
    ElMessage.error(`獲取用戶資料失敗: ${error.errorMessage}`);
  }
};

const cancel = () => {
  router.push("/users/list");
};

onMounted(async () => {
  loadingStore.showLoading("載入中...");
  if (props.id) {
    await fetchUser();
  }
  loadingStore.hideLoading();
});
</script>
