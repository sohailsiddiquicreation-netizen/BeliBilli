import axios from "./axios";

export const getBanners = () => axios.get("/banners");
export const createBanner = (data) => axios.post("/banners", data);
export const deleteBanner = (id) => axios.delete(`/banners/${id}`);
