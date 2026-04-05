import API from "./axios";

export const createOrder = (data) => API.post("/orders", data);
export const getMyOrders = () => API.get("/orders/my");
export const getOrders = () => API.get("/orders");
export const updateOrder = (id, data) => API.put(`/orders/${id}`, data);
