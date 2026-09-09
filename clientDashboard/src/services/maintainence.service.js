//clientDashboard/src/services/maintainence.js

import api from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";

/* =========================================================
   SERVICE RECORDS
   ========================================================= */

/**
 * Create a new service record
 *
 * Fields:
 * - partName
 * - serviceDate
 * - partyName
 * - nextServiceDate
 * - narration
 * - images [max 2]
 */
export const createServiceRecord = async (formData) => {
  const { data } = await api.post(
    `${ENDPOINTS.MAINTENANCE}/service`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return data.data;
};


/**
 * Get all service records
 */
export const getServiceRecords = async () => {
  const { data } = await api.get(
    `${ENDPOINTS.MAINTENANCE}/service`,
  );

  return data.data;
};


/**
 * Get service record by ID
 */
export const getServiceRecordById = async (id) => {
  const { data } = await api.get(
    `${ENDPOINTS.MAINTENANCE}/service/${id}`,
  );

  return data.data;
};


/**
 * Update service record
 *
 * Can also contain new images.
 */
export const updateServiceRecord = async (id, formData) => {
  const { data } = await api.patch(
    `${ENDPOINTS.MAINTENANCE}/service/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return data.data;
};


/**
 * Delete service record
 */
export const deleteServiceRecord = async (id) => {
  const { data } = await api.delete(
    `${ENDPOINTS.MAINTENANCE}/service/${id}`,
  );

  return data.data;
};


/* =========================================================
   VISITOR RECORDS
   ========================================================= */

/**
 * Create a visitor record
 *
 * Fields:
 * - problemDate
 * - visitorName
 * - phoneNumber
 * - reason
 * - partChanges / narration
 */
export const createVisitorRecord = async (payload) => {
  const { data } = await api.post(
    `${ENDPOINTS.MAINTENANCE}/visitor`,
    payload,
  );

  return data.data;
};


/**
 * Get all visitor records
 */
export const getVisitorRecords = async () => {
  const { data } = await api.get(
    `${ENDPOINTS.MAINTENANCE}/visitor`,
  );

  return data.data;
};


/**
 * Get visitor record by ID
 */
export const getVisitorRecordById = async (id) => {
  const { data } = await api.get(
    `${ENDPOINTS.MAINTENANCE}/visitor/${id}`,
  );

  return data.data;
};


/**
 * Update visitor record
 */
export const updateVisitorRecord = async (id, payload) => {
  const { data } = await api.patch(
    `${ENDPOINTS.MAINTENANCE}/visitor/${id}`,
    payload,
  );

  return data.data;
};


/**
 * Delete visitor record
 */
export const deleteVisitorRecord = async (id) => {
  const { data } = await api.delete(
    `${ENDPOINTS.MAINTENANCE}/visitor/${id}`,
  );

  return data.data;
};


/* =========================================================
   PURCHASE RECORDS
   ========================================================= */

/**
 * Create purchase record
 *
 * Fields:
 * - purchaseDate
 * - partyName
 * - guarantyPhoto
 * - expiryWarrantyYear
 * - companyName
 * - otherImage
 */
export const createPurchaseRecord = async (formData) => {
  const { data } = await api.post(
    `${ENDPOINTS.MAINTENANCE}/purchase-record`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return data.data;
};


/**
 * Get all purchase records
 */
export const getPurchaseRecords = async () => {
  const { data } = await api.get(
    `${ENDPOINTS.MAINTENANCE}/purchase-record`,
  );

  return data.data;
};


/**
 * Get purchase record by ID
 */
export const getPurchaseRecordById = async (id) => {
  const { data } = await api.get(
    `${ENDPOINTS.MAINTENANCE}/purchase-record/${id}`,
  );

  return data.data;
};


/**
 * Update purchase record
 */
export const updatePurchaseRecord = async (id, formData) => {
  const { data } = await api.patch(
    `${ENDPOINTS.MAINTENANCE}/purchase-record/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return data.data;
};


/**
 * Delete purchase record
 */
export const deletePurchaseRecord = async (id) => {
  const { data } = await api.delete(
    `${ENDPOINTS.MAINTENANCE}/purchase-record/${id}`,
  );

  return data.data;
};