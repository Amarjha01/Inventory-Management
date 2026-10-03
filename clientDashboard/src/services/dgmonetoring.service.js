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


export const getDailyRuntime = async (date) => {
    try {

        const response = await api.get(
            "/dg-monitoring/daily-runtime",
            {
                params: {
                    date,
                },
            }
        );

        return response.data;

    } catch (error) {

        console.error(
            "Get Daily DG Runtime Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};

export const getLatestDGSession = async (DGID) => {
    try {

        const response = await api.get(
            `/dg-monitoring/${DGID}/latest`
        );

        return response.data;

    } catch (error) {

        console.error(
            "Get Latest DG Session Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};