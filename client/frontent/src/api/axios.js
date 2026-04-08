import axios from "axios";

const API = axios.create({
  baseURL: "http://3.27.56.226:5000/api", 
  // baseURL:"http://localhost:5000/api",
  // Update with your server's IP and port
  withCredentials: true, // important for cookies
});

export default API;