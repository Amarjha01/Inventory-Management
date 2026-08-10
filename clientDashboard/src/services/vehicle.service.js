import api from "../api/axios";

import { ENDPOINTS } from "../api/endpoints";

export const getVehicles = async () => {

    const { data } = await api.get(

        ENDPOINTS.VEHICLES

    );
    const vehicleData = data.data;
    return vehicleData;

};

export const getVehicleById = async (id) => {

    const { data } = await api.get(

        `${ENDPOINTS.VEHICLES}/${id}`

    );

    return data.data;

};

export const createVehicle = async (payload) => {

    const { data } = await api.post(

        ENDPOINTS.VEHICLES,

        payload

    );

    return data.data;

};

export const updateVehicle = async (id, payload) => {

    const { data } = await api.patch(

        `${ENDPOINTS.VEHICLES}/${id}`,

        payload

    );

    return data.data;

};

export const activateVehicle = async (id) => {

    const { data } = await api.patch(

        `${ENDPOINTS.VEHICLES}/${id}/activate`

    );

    return data.data;

};

export const deactivateVehicle = async (id) => {

    const { data } = await api.patch(

        `${ENDPOINTS.VEHICLES}/${id}/deactivate`

    );

    return data.data;

};