import { useCallback, useEffect, useState } from "react";

import getLiveLocationByVehicle from "../services/tracking.service.js";

const POLLING_INTERVAL = 5000;

const useVehicleTracking = (requirementId) => {
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log(requirementId);
  
  const fetchVehicle = useCallback(async () => {
    if (!requirementId) return;

    try {
      setError(null);

      const response =
        await getLiveLocationByVehicle(
          requirementId
        );

      if (!response?.success) {
        throw new Error(
          response?.message ||
            "Unable to fetch vehicle location"
        );
      }
      
      setVehicle(response.data.result);
    } catch (error) {
      console.error(
        "Vehicle tracking error:",
        error
      );

      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to fetch vehicle location"
      );
    } finally {
      setLoading(false);
    }
  }, [requirementId]);

  useEffect(() => {
    fetchVehicle();

    const interval = setInterval(
      fetchVehicle,
      POLLING_INTERVAL
    );

    return () => clearInterval(interval);
  }, [fetchVehicle]);

  return {
    vehicle,
    loading,
    error,
    refetch: fetchVehicle,
  };
};

export default useVehicleTracking;