import axios from "axios";
import { storage } from "../utils/storage";
import { Await} from "react-router-dom";
const base_url =  import.meta.env.VITE_SERVER_BASE_URL;
const api = axios.create({
    baseURL: base_url,
    // baseURL: "https://esfserver.axeiro.com/api/v1",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    },
    
});

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message;

    console.log("status:", status);
    console.log("message:", message);

    // Global auth handling
    if (
      status === 401 ||
      status === 403 ||
      message === "User not found" ||
      message === "User account is disabled" ||
      message === "Authentication required"
    ) {
      try {
        await api.post("/auth/logout");
      } catch (logoutError) {
        console.log("Logout error:", logoutError);
      }

      storage.logout();
      window.location.href = "/login";

      return Promise.reject(error);
    }

    // IMPORTANT
    return Promise.reject(error);
  }
);


export default api;