import api from "./axios";
import { ENDPOINTS } from "./endpoints";

export const getInventory = () =>

    api.get(

        ENDPOINTS.INVENTORY

    );

export const createInventory = (payload) =>

    api.post(

        ENDPOINTS.INVENTORY,

        payload

    );

export const updateInventory = (id, payload) =>

    api.patch(

        `${ENDPOINTS.INVENTORY}/${id}`,

        payload

    );