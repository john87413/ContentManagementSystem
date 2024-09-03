import axios from "@/api/axios";

const fetchIngredients = (page, limit, nameQuery = "") => {
    const params = {
        page,
        limit,
        nameQuery,
    };
    return axios.get("/ingredients", { params });
};

const fetchIngredient = (id) => {
    return axios.get(`/ingredients/${id}`);
};

const createIngredient = (data) => {
    return axios.post("/ingredients", data);
};

const updateIngredient = (id, data) => {
    return axios.put(`/ingredients/${id}`, data);
};

const deleteIngredient = (id) => {
    return axios.delete(`/ingredients/${id}`);
};

export default {
    fetchIngredients,
    fetchIngredient,
    createIngredient,
    updateIngredient,
    deleteIngredient,
};
