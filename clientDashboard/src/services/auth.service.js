// arc/services/auth.service.js
import api from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";

export const login = async (phone, password) => {

    const response = await api.post(ENDPOINTS.AUTH.LOGIN, {

        phone,

        password

    });
 
    return response.data.data;

};

export const logout = async () => {

    const response = await api.post("/auth/logout");

    return response.data;

};