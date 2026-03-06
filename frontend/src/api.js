import axios from "axios";

const API_BASE_URL = (
  process.env.REACT_APP_API_BASE_URL?.trim() || "https://hire-ly-izmm.vercel.app/"
).replace(/\/+$/, "");

const API = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true,
});

export const register = (data) => API.post("/users/register", data);
export const login = (data) => API.post("/users/login", data);
export const fetchJobs = () => API.get("/jobs");
export const postJob = (data, token) =>
  API.post("/jobs", data, { headers: { Authorization: `Bearer ${token}` } });

export default API;
