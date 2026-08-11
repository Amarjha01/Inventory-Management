import axios from "axios";
import { storage } from "../utils/storage";
import { Await} from "react-router-dom";
const api = axios.create({

    baseURL: "http://localhost:5000/api/v1",
    // baseURL: "https://esfserver.axeiro.com/api/v1",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    },
    
});

// api.interceptors.request.use(config => {

//     const token = localStorage.getItem("token");

//     if (token) {

//         config.headers.Authorization = `Bearer ${token}`;

//     }

//     return config;

// });

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const status = error.response?.data?.code;
    console.log('status', status);
    
    const message = error.response.data.message;
    console.log('message' , message);
    if(message === "Resource not found"){
      window.location.href = '/login'
    }
    if (status === 401 || message === "User not found" || status === 403 || message === "User account is disabled") {
      // clear auth state
      await api.post('/auth/logout')
      storage.logout();
      // clear token if stored client-side
      
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;