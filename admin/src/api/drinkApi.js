import axios from "@/api/axios";

const fetchDrinks = (page, limit, nameQuery = "") => {
    const params = {
        page,
        limit,
        nameQuery,
    };
    return axios.get("/rest/drinks", { params });
};

const fetchDrink = (id) => {
    return axios.get(`/rest/drinks/${id}`);
};

const createDrink = (data) => {
    return axios.post("/rest/drinks", data);
};

const updateDrink = (id, data) => {
    return axios.put(`/rest/drinks/${id}`, data);
};

const deleteDrink = (id) => {
    return axios.delete(`/rest/drinks/${id}`);
};

export default {
    fetchDrinks,
    fetchDrink,
    createDrink,
    updateDrink,
    deleteDrink,
};
