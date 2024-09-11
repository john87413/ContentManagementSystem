import axios from "@/api/axios";

const uploadImage = (formData) => {
    return axios.post("/upload/images", formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

const deleteImage = (fileName) => {
    return axios.delete(`/upload/images/${fileName}`);
};

export default {
    uploadImage,
    deleteImage,
};
