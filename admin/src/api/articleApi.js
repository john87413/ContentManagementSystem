import axios from "@/api/axios";

const fetchArticles = (page, limit, nameQuery = "") => {
    const params = {
        page,
        limit,
        nameQuery,
    };
    return axios.get("/rest/articles", { params });
};

const fetchArticle = (id) => {
    return axios.get(`/rest/articles/${id}`);
};

const createArticle = (data) => {
    return axios.post("/rest/articles", data);
};

const updateArticle = (id, data) => {
    return axios.put(`/rest/articles/${id}`, data);
};

const deleteArticle = (id) => {
    return axios.delete(`/rest/articles/${id}`);
};

export default {
    fetchArticles,
    fetchArticle,
    createArticle,
    updateArticle,
    deleteArticle,
};
