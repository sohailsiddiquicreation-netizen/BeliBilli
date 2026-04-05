import API from "./axios";

export const getDashboard = () => API.get("/admin/dashboard");
export const getUsers = () => API.get("/admin/users");
export const deleteUser = (id) => API.delete(`/admin/users/${id}`);
export const updateUser = (id, data) => API.put(`/admin/users/${id}`, data);
