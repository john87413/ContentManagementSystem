<template>
  <div>
    <h1>{{ id ? "編輯" : "新建" }}門市</h1>
    <el-form
      v-loading="loading"
      ref="formRef"
      :model="model"
      label-width="70px"
      @submit.prevent="save"
      :rules="rules"
    >
      <el-form-item label="名稱" prop="name">
        <el-input v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item label="電話" prop="phone">
        <el-input v-model="model.phone" placeholder="手機或是市話"></el-input>
      </el-form-item>
      <el-form-item label="縣市" prop="city">
        <el-select
          v-model="model.city"
          clearable
          placeholder="Select"
          @change="cityChange"
        >
          <el-option
            v-for="(item, index) in cities"
            :key="index"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="鄉鎮" prop="district">
        <el-select v-model="model.district" clearable placeholder="Select">
          <el-option
            v-for="(item, index) in districts"
            :key="index"
            :label="item.AreaName"
            :value="item.AreaName"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model="model.address"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit">儲存</el-button>
        <el-button plain @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import cityData from "../../assets/CityCountyData.json";
import shopApi from "@/api/shopApi";

const props = defineProps({
  id: String,
});

const router = useRouter();
const loading = ref(true);
const formRef = ref(null);

const model = reactive({
  name: "",
  phone: "",
  city: null,
  district: null,
  address: "",
});

const rules = {
  name: { required: true, message: "請輸入門市名稱", trigger: "blur" },
  phone: [
    { required: true, message: "請輸入門市電話", trigger: "blur" },
    {
      pattern: /^(09[0-9]{8}|0[2-8][0-9]{7,8})$/,
      message: "請輸入正確的手機或市話號碼",
      trigger: "blur",
    },
  ],
  city: {
    required: true,
    message: "請輸入門市所在縣市",
    trigger: "change",
  },
  district: {
    required: true,
    message: "請輸入門市所在鄉鎮",
    trigger: "change",
  },
  address: {
    required: true,
    message: "請輸入地址",
    trigger: "blur",
  },
};

const cities = computed(() => cityData.map((item) => item.CityName));

const districts = computed(() => {
  const cityItem = cityData.find((item) => item.CityName === model.city);
  return cityItem ? cityItem.AreaList : [];
});

const cityChange = () => {
  model.district = "";
};

const save = async () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (props.id) {
          await shopApi.updateShop(props.id, model);
        } else {
          await shopApi.createShop(model);
        }
        router.push("/shops/list");
        ElMessage({
          type: "success",
          message: "儲存成功",
        });
      } catch (error) {
        ElMessage.error("儲存失敗: " + error.message);
      }
    } else {
      ElMessage({
        type: "warning",
        message: "請依照指示完成表單",
      });
    }
  });
};

const fetchShop = async () => {
  try {
    const res = await shopApi.fetchShop(props.id);
    Object.assign(model, res.data);
  } catch (error) {
    ElMessage.error("獲取門市資料失敗: " + error.message);
  }
};

const cancel = () => {
  router.push("/shops/list");
};

onMounted(async () => {
  loading.value = true;
  if (props.id) {
    await fetchShop();
  }
  loading.value = false;
});
</script>
