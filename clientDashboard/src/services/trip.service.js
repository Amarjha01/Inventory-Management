import api from "../api/axios";

import { ENDPOINTS } from "../api/endpoints.js";

export const getTrips = async () => {
    const { data } = await api.get(
        `${ENDPOINTS.TRIPS}/my`
    );

    return data.data;
};

export const getTripById = async (id) => {
    const { data } = await api.get(
        `${ENDPOINTS.TRIPS}/${id}`
    );

    return data.data;
};

export const createTrip = async (payload) => {
    console.log(payload);
    
    const { data } = await api.post(
        ENDPOINTS.TRIPS,
        payload,
        {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
    );

    return data.data;
};

export const updateTrip = async (id, payload) => {
    const { data } = await api.patch(
        `${ENDPOINTS.TRIPS}/${id}`,
        payload
    );

    return data.data;
};

export const startTrip = async (id, payload) => {
    const { data } = await api.patch(
        `${ENDPOINTS.TRIPS}/${id}/start`,
        payload
    );

    return data.data;
};

export const updateTripLocation = async (id, payload) => {
    const { data } = await api.patch(
        `${ENDPOINTS.TRIPS}/${id}/location`,
        payload
    );

    return data.data;
};

export const completeDestination = async (id, destinationId, payload) => {
    const { data } = await api.patch(
        `${ENDPOINTS.TRIPS}/${id}/destinations/${destinationId}/complete`,
        payload
    );

    return data.data;
};

export const completeTrip = async (id, payload) => {
    const { data } = await api.patch(
        `${ENDPOINTS.TRIPS}/${id}/complete`,
        payload
    );

    return data.data;
};

export const cancelTrip = async (id, payload = {}) => {
    const { data } = await api.patch(
        `${ENDPOINTS.TRIPS}/${id}/cancel`,
        payload
    );

    return data.data;
};

export const getDriverTrips = async (params = {}) => {
    const { data } = await api.get(
        `${ENDPOINTS.TRIPS}/driver`,
        {
            params,
        }
    );

    return data.data;
};

export const getMyTrips = async (params = {}) => {
  const { data } = await api.get(`${ENDPOINTS.TRIPS}/my`, {
    params,
  });

  return data.data;
};

export const getDrivingRoute = async (points) => {
    if (!points || points.length < 2) {
        return [];
    }

    const coordinates = points
        .map(
            ({ latitude, longitude }) =>
                `${longitude},${latitude}`
        )
        .join(";");

    const url =
        `https://router.project-osrm.org/route/v1/driving/` +
        `${coordinates}?overview=full&geometries=geojson`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Unable to calculate route.");
    }

    const data = await response.json();

    if (data.code !== "Ok" || !data.routes?.length) {
        throw new Error("No driving route found.");
    }

    return data.routes[0].geometry.coordinates;
};