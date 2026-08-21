import api from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";
import { storage } from "../utils/storage";
const user = storage.getUser();
export const createRequirement = async (payload) => {
  const { data } = await api.post(
    ENDPOINTS.REQUIREMENTS,

    payload,
  );

  return data.data;
};

export const getAllKitchenRequirements = async () => {
  const { data } = await api.get(
    `${ENDPOINTS.REQUIREMENTS}/allKitchenRequirements`,
  );

  return data.data;
};
export const getRequirements = async () => {
  const { data } = await api.get(ENDPOINTS.REQUIREMENTS);

  return data.data;
};

export const getRequirementById = async (id) => {
  const { data } = await api.get(`${ENDPOINTS.REQUIREMENTS}/${id}`);
console.log(data);

  const requirementData = data.data;
  return requirementData;
};

export const getLatestKitchenRequirement = async () => {
  const { data } = await api.get(
    `${ENDPOINTS.REQUIREMENTS}/latest/${user.kitchenId._id}`,
  );

  return data.data;
};

export const updateRequirement = async (
  id,

  payload,
) => {
  const { data } = await api.patch(
    `${ENDPOINTS.REQUIREMENTS}/${id}`,

    payload,
  );

  return data.data;
};

export const dispatchRequirement = async (id, payload) => {
  const { data } = await api.patch(
    `${ENDPOINTS.REQUIREMENTS}/${id}/dispatch`,
    payload,
  );
  return data.data;
};

export const receiveRequirement = async (id, formData) => {
  const response = await api.patch(
    `/requirements/${id}/receive`,

    formData,

    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data.data;
};
export const updateGatePassImage = async (id, formData) => {
  const response = await api.patch(
    `/requirements/${id}/gate-pass`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data.data;
};
