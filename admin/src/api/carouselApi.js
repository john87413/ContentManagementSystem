import axios from "@/api/axios";

const fetchCarousels = (page, limit, nameQuery = "", sortField = "", sortOrder = "") => {
    const params = {
        page,
        limit,
        nameQuery,
        sortField,
        sortOrder
    };
    return axios.get("/rest/carousels", { params });
};

const fetchCarousel = (id) => {
    return axios.get(`/rest/carousels/${id}`);
};

const createCarousel = (data) => {
    return axios.post("/rest/carousels", data);
};

const updateCarousel = (id, data) => {
    return axios.put(`/rest/carousels/${id}`, data);
};

const deleteCarousel = (id) => {
    return axios.delete(`/rest/carousels/${id}`);
};

export default {
    fetchCarousels,
    fetchCarousel,
    createCarousel,
    updateCarousel,
    deleteCarousel,
};
