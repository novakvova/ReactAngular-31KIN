import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL+"/api",
});

// Перехоплюємо кожен запит перед його відправкою
api.interceptors.request.use((config) => {
    // Отримуємо token з localStorage
    const token = localStorage.getItem("auth");

    // Якщо token існує — додаємо його в Header
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // Повертаємо змінений config
    return config;
});

export default api;