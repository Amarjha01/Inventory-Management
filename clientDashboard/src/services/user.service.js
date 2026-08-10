// src/services/user.service.js

import api from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";

export const getUsers = async () => {

    const { data } = await api.get(
        ENDPOINTS.USERS
    );

    return data.data;

};

export const getUserById = async (id) => {

    const { data } = await api.get(
        `${ENDPOINTS.USERS}/${id}`
    );

    return data.data;

};

export const createUser = async (payload) => {

    const { data } = await api.post(
        ENDPOINTS.USERS,
        payload
    );

    return data.data;

};

export const updateUser = async (id, payload) => {

    const { data } = await api.patch(
        `${ENDPOINTS.USERS}/${id}`,
        payload
    );

    return data.data;

};

export const activateUser = async (id) => {

    const { data } = await api.patch(
        `${ENDPOINTS.USERS}/${id}/activate`
    );

    return data.data;

};

export const deactivateUser = async (id) => {

    const { data } = await api.patch(
        `${ENDPOINTS.USERS}/${id}/deactivate`
    );

    return data.data;

};