import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
});

export const register = (data) => API.post("/users/register", data);
export const login = (data) => API.post("/users/login", data);
export const fetchJobs = () => API.get("/jobs");
export const postJob = (data, token) =>
  API.post("/jobs", data, { headers: { Authorization: `Bearer ${token}` } });

export default API;
