// src/api/auth.api.js
import api from "./axios";
import { ENDPOINTS } from "./endpoints";
 console.log(ENDPOINTS.AUTH.LOGIN);
 
export const login = (payload) =>

    api.post(

        ENDPOINTS.AUTH.LOGIN,

        payload

    );