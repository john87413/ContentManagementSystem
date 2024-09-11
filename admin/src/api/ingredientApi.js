import axios from "@/api/axios";

const fetchIngredients = (page, limit, nameQuery = "") => {
    const params = {
        page,
        limit,
        nameQuery,
    };
    return axios.get("/rest/ingredients", { params });
};

const fetchIngredient = (id) => {
    return axios.get(`/rest/ingredients/${id}`);
};

const createIngredient = (data) => {
    return axios.post("/rest/ingredients", data);
};

const updateIngredient = (id, data) => {
    return axios.put(`/rest/ingredients/${id}`, data);
};

const deleteIngredient = (id) => {
    return axios.delete(`/rest/ingredients/${id}`);
};

export default {
    fetchIngredients,
    fetchIngredient,
    createIngredient,
    updateIngredient,
    deleteIngredient,
};
