<template>
  <el-upload
    v-model:file-list="imageList"
    class="avatar-uploader"
    :class="{ disabled: uploadDisabled }"
    action="#"
    list-type="picture-card"
    :limit="2"
    :auto-upload="false"
    :on-exceed="handleExceed"
    :on-change="handleChange"
    :http-request="uploadImages"
  >
    <el-icon class="avatar-uploader-icon"><Plus /></el-icon>

    <template #file="{ file }">
      <div>
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
        <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="handlePictureCardPreview(file)"
          >
            <el-icon><ZoomIn /></el-icon>
          </span>
          <span
            class="el-upload-list__item-delete"
            @click="handleDownload(file)"
          >
            <el-icon><Download /></el-icon>
          </span>
          <span class="el-upload-list__item-delete" @click="handleRemove(file)">
            <el-icon><Delete /></el-icon>
          </span>
        </span>
      </div>
    </template>
  </el-upload>

  <el-dialog v-model="dialogVisible">
    <img :src="dialogImageUrl" alt="Preview Image" class="image" />
  </el-dialog>
</template>

<script setup>
import { ref, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Delete, Download, Plus, ZoomIn } from "@element-plus/icons-vue";
import uploadApi from "@/api/uploadApi";

const props = defineProps({
  originalImageList: {
    type: Array,
    default: () => [],
  },
});

const imageList = ref([]);
const uploadDisabled = ref(false);
const dialogImageUrl = ref("");
const dialogVisible = ref(false);

watch(
  () => props.originalImageList,
  (newVal) => {
    if (newVal && imageList.value.length === 0) {
      imageList.value = newVal.map((file) => ({
        name: file.fileName,
        url: file.imgUrl,
        expiresAt: file.expiresAt,
      }));
      if (imageList.value.length >= 2) uploadDisabled.value = true;
    }
  },
  { immediate: true }
);

// 處理圖片預覽
const handlePictureCardPreview = (file) => {
  dialogImageUrl.value = file.url;
  dialogVisible.value = true;
};

// 處理圖片下載
const handleDownload = (file) => {
  const link = document.createElement("a");
  link.href = file.url;
  link.download = file.name || "downloaded_image";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// 處理圖片刪除
const handleRemove = async (file) => {
  try {
    await ElMessageBox.confirm(`確定要刪除這張圖片嗎？`, "警告", {
      confirmButtonText: "確定",
      cancelButtonText: "取消",
      type: "warning",
    });
    imageList.value.splice(imageList.value.indexOf(file), 1);
    if (imageList.value.length < 2) uploadDisabled.value = false;
    ElMessage.success("圖片已刪除");
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("刪除失敗: " + error.message);
    }
  }
};

// 處理圖片數量上限
const handleExceed = () => {
  ElMessage.error("最多只能上傳 2 張圖片");
};

const handleChange = (file, fileList) => {
  if (!file.raw.type.startsWith("image/")) {
    ElMessage.error("只能上傳圖片！");
    fileList.pop();
    return false;
  }
  if (file.raw.size / 1024 / 1024 > 5) {
    ElMessage.error("圖片大小不能超過 5MB！");
    fileList.pop();
    return false;
  } else {
    if (fileList.length >= 2) uploadDisabled.value = true;
  }
  return true;
};

const uploadImages = async () => {
  const originalFileNames = new Set(
    props.originalImageList.map((file) => file.fileName)
  );
  const currentFileNames = new Set(imageList.value.map((file) => file.name));

  const newFiles = imageList.value.filter(
    (file) => !originalFileNames.has(file.name)
  );
  const deletedFiles = props.originalImageList.filter(
    (file) => !currentFileNames.has(file.fileName)
  );

  const formData = new FormData();
  newFiles.forEach((file) => {
    const fileRaw = file.raw;
    formData.append("files", fileRaw);
  });

  try {
    let uploadedImages = [];

    // 進行圖片上傳
    if (newFiles.length > 0) {
      const response = await uploadApi.uploadImage(formData);
      uploadedImages = response.data;
    }

    // 進行圖片刪除
    for (const file of deletedFiles) {
      await uploadApi.deleteImage(file.fileName)
    }

    // 生成新的图片列表
    const newImageList = [
      ...props.originalImageList.filter((file) => !deletedFiles.includes(file)),
      ...uploadedImages,
    ];

    return newImageList;
  } catch (error) {
    throw error;
  }
};

defineExpose({
  uploadImages,
});
</script>

<style>
.el-dialog__body {
  display: flex;
  justify-content: center;
  align-items: center;
}

.el-dialog__header.show-close {
  display: flex;
  justify-content: end;
  padding: 0;
}

.el-dialog__headerbtn {
  font-size: 1.5rem;
  position: static;
  display: flex;
  width: auto;
  height: auto;
}

.el-dialog__body .image {
  max-width: 70%;
  max-height: 70%;
  object-fit: contain;
  padding: 1rem;
  box-sizing: border-box;
}

.disabled .el-upload--picture-card {
  display: none !important;
}
</style>
