import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);

export const getProfile = (token) => API.get("/user/profile", { headers: { Authorization: `Bearer ${token}` } });
export const updateProfile = (token, data) => API.put("/user/profile", data, { headers: { Authorization: `Bearer ${token}` } });

export const getFavorites = () => API.get("/favorites/my-favorites");
export const toggleFavorite = (productId) => API.post("/favorites/toggle", { productId });

export default API;