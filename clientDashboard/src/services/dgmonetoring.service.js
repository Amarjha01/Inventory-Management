import api from "../api/axios";

export const addDG = async (data) => {
   
    try {

        const response = await api.post(
            "/api/v1/dg-monitoring/add",
            data
        );


        return response.data

    } catch (error) {

        console.error(
            "Add DG Error:",
            error.response?.data || error.message
        );

    }
};

export const getAllDG = async (kitchenId) => {
    try {

        const response = await api.get(
            "/dg-monitoring/all"
        );

        return response.data;

    } catch (error) {

        console.error(
            "Get All DG Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};
