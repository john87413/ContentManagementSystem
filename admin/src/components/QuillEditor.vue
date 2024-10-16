<template>
  <div class="editor-container" style="line-height: normal; width: 100%">
    <div ref="editorElement"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import Quill from "quill";
import "quill/dist/quill.snow.css";

import uploadApi from "@/api/uploadApi";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

const editorElement = ref(null);
let quill = null;

const emit = defineEmits(["update:modelValue"]);

const initQuill = () => {
  quill = new Quill(editorElement.value, {
    theme: "snow",
    modules: {
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: [] }],
        ["image"],
      ],
    },
  });

  quill.root.innerHTML = props.modelValue;

  quill.on("text-change", () => {
    emit("update:modelValue", quill.root.innerHTML);
  });
};

const uploadImageAndReplaceUrl = async () => {
  const images = Array.from(quill.root.querySelectorAll("img"));
  const uploadPromises = images.map(async (img) => {
    const src = img.getAttribute("src");

    if (src.startsWith("data:image/")) {
      const formData = new FormData();
      formData.append("files", dataURItoBlob(src));

      try {
        const response = await uploadApi.uploadImage(formData);
        const newImageUrl = response.data[0].imgUrl;
        img.setAttribute("src", newImageUrl);
      } catch (error) {
        throw error;
      }
    }
  });

  // Wait for all uploads to finish
  await Promise.all(uploadPromises);
};

const dataURItoBlob = (dataURI) => {
  const byteString = atob(dataURI.split(",")[1]);
  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ab], { type: mimeString });
};

const getContent = () => {
  return quill ? quill.root.innerHTML : "";
};

const setContent = (content) => {
  if (quill) {
    quill.root.innerHTML = content;
  }
};

onMounted(() => {
  initQuill();
});

onBeforeUnmount(() => {
  if (quill) {
    quill = null;
  }
});

defineExpose({
  uploadImageAndReplaceUrl,
  getContent,
  setContent,
});
</script>

<style scoped>
.ql-editor {
  min-height: 8rem;
}
</style>
