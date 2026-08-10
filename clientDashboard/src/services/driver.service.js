import api from "../api/axios";

export const getDrivers = async () => {
    const response = await api.get("/drivers");
    return response.data.data;
};

export const createDriver = async (payload) => {
    const response = await api.post("/drivers", payload);
    return response.data.data;
};

export const updateDriver = async (id, payload) => {
    const response = await api.patch(`/drivers/${id}`, payload);
    return response.data.data;
};