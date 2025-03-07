import axios from "@/api/axios";

const login = (data) => {
    return axios.post("/rest/users/login", data);
};

const fetchUsers = (page, limit, nameQuery = "", sortField = "", sortOrder = "") => {
    const params = {
        page,
        limit,
        nameQuery,
        sortField,
        sortOrder
    };
    return axios.get("/rest/users", { params });
};

const fetchUser = (id) => {
    return axios.get(`/rest/users/${id}`);
};

const createUser = (data) => {
    return axios.post("/rest/users", data);
};

const updateUser = (id, data) => {
    return axios.put(`/rest/users/${id}`, data);
};

const deleteUser = (id) => {
    return axios.delete(`/rest/users/${id}`);
};

export default {
    login,
    fetchUsers,
    fetchUser,
    createUser,
    updateUser,
    deleteUser,
};