import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default api;

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const endpoints = {
  auth: {
    signup: `/api/v1/auth/doctor/signup`,
    signin: `/api/v1/auth/doctor/signin`,
    signout: `/api/v1/auth/doctor/signout`,
    me: `/api/v1/auth/doctor/me`,
  },
  task: {
    create: `/api/v1/t/tasks`,
    get: `/api/v1/t/tasks`,
    update: `/api/v1/t/task`,
    delete: (id) => `/api/v1/t/tasks/${id}`,
  },
};
