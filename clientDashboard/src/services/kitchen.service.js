import api from "../api/axios";

import { ENDPOINTS } from "../api/endpoints";

export const getKitchens = async () => {
  const { data } = await api.get(ENDPOINTS.KITCHENS);
    
  return data.data;
};

export const createKitchen = async (payload) => {
  const { data } = await api.post(
    ENDPOINTS.KITCHENS,

    payload,
  );

  return data.data;
};

export const updateKitchen = async (
  id,

  payload,
) => {
  const { data } = await api.patch(
    `${ENDPOINTS.KITCHENS}/${id}`,

    payload,
  );

  return data.data;
};
