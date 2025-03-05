<template>
  <el-upload
    v-model:file-list="imageList"
    class="avatar-uploader"
    :class="{ disabled: uploadDisabled }"
    action="#"
    list-type="picture-card"
    :limit="imageLimit"
    :auto-upload="false"
    :on-exceed="handleExceed"
    :on-change="handleChange"
    :http-request="uploadImages"
    v-loading="isLoading"
    element-loading-text="處理中..."
  >
    <el-icon class="avatar-uploader-icon"><Plus /></el-icon>

    <template #file="{ file }">
      <div class="avatar-container">
        <img
          v-if="!file.raw || file.thumbnailUrl"
          class="el-upload-list__item-thumbnail"
          :src="!file.raw ? file.url : file.thumbnailUrl"
          alt=""
        />
        <div v-else class="el-upload-list__item-thumbnail">
          處理中...
        </div>
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
import { ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Delete, Download, Plus, ZoomIn } from "@element-plus/icons-vue";

import { compressImage } from "@/utils/imageCompression";
import { generateThumbnail } from "@/utils/thumbnailGeneration";
import uploadApi from "@/api/uploadApi";

const props = defineProps({
  originalImageList: {
    type: Array,
    default: () => [],
  },
  imageLimit: {
    type: Number,
    default: () => 1,
  },
});

const imageList = ref([]);
const uploadDisabled = ref(false);
const dialogImageUrl = ref("");
const dialogVisible = ref(false);
const isLoading = ref(false);

// 初始化圖片內容
const setContent = (newVal) => {
  if (newVal && imageList.value.length === 0) {
    imageList.value = newVal.map((file) => ({
      name: file.fileName,
      url: file.imgUrl,
      expiresAt: file.expiresAt,
    }));
    if (imageList.value.length >= props.imageLimit) {
      uploadDisabled.value = true;
    }
  }
};

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
    if (imageList.value.length < props.imageLimit) uploadDisabled.value = false;
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("刪除失敗: " + error.message);
    }
  }
};

// 處理圖片數量上限
const handleExceed = () => {
  ElMessage.error(`最多只能上傳 ${props.imageLimit} 張圖片`);
};

// 處理圖片選擇
const handleChange = async (file, fileList) => {
  if (!file.raw.type.startsWith("image/")) {
    ElMessage.error("只能上傳圖片！");
    fileList.pop();
  } else if (file.raw.size / 1024 / 1024 > 5) {
    ElMessage.error("圖片大小不能超過 5MB！");
    fileList.pop();
  } else {
    if (fileList.length >= props.imageLimit) uploadDisabled.value = true;

    isLoading.value = true; // 開始加載
    try {
      const [thumbnailUrl, compressedImage] = await Promise.all([
        generateThumbnail(file.raw),
        compressImage(file.raw),
      ]);

      fileList[fileList.length - 1].thumbnailUrl = thumbnailUrl;
      file.raw = compressedImage;
    } catch (error) {
      fileList.pop();
      ElMessage.error("圖片壓縮失敗!");
    } finally {
      isLoading.value = false; // 結束加載
    }
  }
};

// 上傳圖片
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
      await uploadApi.deleteImage(file.fileName);
    }

    // 生成新的圖片列表
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
  setContent,
});
</script>

<style>
.avatar-container {
  width: 100%;
}

.el-overlay-dialog {
  display: flex;
}

.el-dialog {
  margin: auto;
  width: 80%;
}

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
}

.el-dialog__body .image {
  max-height: 80vh;
  object-fit: contain;
  padding: 1rem;
  box-sizing: border-box;
}

.disabled .el-upload--picture-card {
  display: none !important;
}
</style>
