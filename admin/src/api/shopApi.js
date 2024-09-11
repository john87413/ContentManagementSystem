import axios from "@/api/axios";

const fetchShops = (page, limit, nameQuery = "") => {
    const params = {
        page,
        limit,
        nameQuery,
    };
    return axios.get("/rest/shops", { params });
};

const fetchShop = (id) => {
    return axios.get(`/rest/shops/${id}`);
};

const createShop = (data) => {
    return axios.post("/rest/shops", data);
};

const updateShop = (id, data) => {
    return axios.put(`/rest/shops/${id}`, data);
};

const deleteShop = (id) => {
    return axios.delete(`/rest/shops/${id}`);
};

export default {
    fetchShops,
    fetchShop,
    createShop,
    updateShop,
    deleteShop,
};
