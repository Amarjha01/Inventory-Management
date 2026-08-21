import api from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";

export const getInventory = async () => {
  const { data } = await api.get(ENDPOINTS.INVENTORY);
  const inventoryData = data.data;
  return inventoryData;
};

export const getInventoryById = async (id) => {
  const { data } = await api.get(`${ENDPOINTS.INVENTORY}/${id}`);

  return data.data;
};

export const createInventory = async (payload) => {
  const { data } = await api.post(
    ENDPOINTS.INVENTORY,
    payload,
  );

  return data.data;
};

export const updateInventory = async (
  id,

  payload,
) => {
  const { data } = await api.patch(
    `${ENDPOINTS.INVENTORY}/${id}`,

    payload,
  );

  return data.data;
};

export const updateInventoryStock = async (
  id,

  quantity,
) => {
  const { data } = await api.patch(
    `${ENDPOINTS.INVENTORY}/${id}/stock`,

    {
      quantity,
    },
  );

  return data.data;
};
