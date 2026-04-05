import API from "./axios";

export const getCart = () => API.get("/cart");
export const addToCart = (data) => API.post("/cart", data);
export const removeFromCart = (data) => API.delete("/cart", { data });
export const updateCart = (data) => API.put("/cart", data);
