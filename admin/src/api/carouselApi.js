import axios from "@/api/axios";

const fetchCarousels = (page, limit, nameQuery = "") => {
    const params = {
        page,
        limit,
        nameQuery,
    };
    return axios.get("/carousels", { params });
};

const fetchCarousel = (id) => {
    return axios.get(`/carousels/${id}`);
};

const createCarousel = (data) => {
    return axios.post("/carousels", data);
};

const updateCarousel = (id, data) => {
    return axios.put(`/carousels/${id}`, data);
};

const deleteCarousel = (id) => {
    return axios.delete(`/carousels/${id}`);
};

export default {
    fetchCarousels,
    fetchCarousel,
    createCarousel,
    updateCarousel,
    deleteCarousel,
};
