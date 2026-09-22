import api from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";

/**
 * Get notifications for the logged-in kitchen user.
 */
export const getKitchenNotifications = async (params = {}) => {
  const { data } = await api.get(
    ENDPOINTS.NOTIFICATIONS,
    {
      params,
    }
  );

  return data.data;
};