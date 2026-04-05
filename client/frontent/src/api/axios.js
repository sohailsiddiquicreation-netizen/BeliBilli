import axios from "axios";

const API = axios.create({
  baseURL: "http://3.27.56.226:5000/api",


  
  withCredentials: true, // important for cookies
});

export default API;