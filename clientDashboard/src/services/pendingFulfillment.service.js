import api from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";

// ======================================================
// CREATE PENDING ITEM
// ======================================================

export const createPendingItems = async (payload) => {
  const response = await api.post(
    ENDPOINTS.PENDINGITEMS,
    {
      payload,
    },
  );

  return response.data;
};

// ======================================================
// getUndispatchedRequirementId PENDING ITEM
// ======================================================

export const getUndispatchedRequirementId = async (kitchenId) => {
  const response = await api.get(
    `${ENDPOINTS.PENDINGITEMS}/requirementsByKitchen`,
    {
      params: {
        kitchenId,
      },
    }
  );

  return response.data;
};

// ======================================================
// mergeItem PENDING ITEM
// ======================================================

export const mergeItem = async (id , payload) => {
  console.log(id , payload);
  
  const response = await api.post(
    `${ENDPOINTS.PENDINGITEMS}/mergeItems`,
    {id , payload}
  );

  return response.data;
};

// ======================================================
// GET PENDING ITEMS
// ======================================================

export const getPendingItems = async (params = {}) => {
  const response = await api.get(
    ENDPOINTS.PENDINGITEMS,
    {
      params,
    },
  );

  return response.data;
};

// ======================================================
// GET ONE KITCHEN PENDING DOCUMENT
// ======================================================

export const getPendingItem = async (id) => {
  const response = await api.get(
    `${ENDPOINTS.PENDINGITEMS}/${id}`,
  );

  return response.data;
};

// ======================================================
// FULFILL PENDING ITEM
// ======================================================

export const fulfillPendingItem = async (
  pendingId,
  pendingItemId,
  dispatchedRequirementId,
) => {
  const response = await api.patch(
    `${ENDPOINTS.PENDINGITEMS}/${pendingId}/item/fulfill`,
    {
      pendingItemId,
      dispatchedRequirementId,
    },
  );

  return response.data;
};

// ======================================================
// CANCEL PENDING ITEM
// ======================================================

export const cancelPendingItem = async (
  pendingId,
  pendingItemId,
) => {
  const response = await api.patch(
    `${ENDPOINTS.PENDINGITEMS}/${pendingId}/item/cancel`,
    {
      pendingItemId,
    },
  );

  return response.data;
};