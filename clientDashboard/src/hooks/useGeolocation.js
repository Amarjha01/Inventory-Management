import { useEffect, useState } from "react";

const useGeolocation = ({ watch = false } = {}) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported.");
      return;
    }

    const handleSuccess = (position) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        capturedAt: new Date(position.timestamp).toISOString(),
      });

      setError(null);
    };

    const handleError = (err) => {
      setError(err.message);
    };

    const options = {
      enableHighAccuracy: true,
      maximumAge: 5000,
      timeout: 15000,
    };

    if (watch) {
      const watchId = navigator.geolocation.watchPosition(
        handleSuccess,
        handleError,
        options,
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }

    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      handleError,
      options,
    );
  }, [watch]);

  return {
    location,
    error,
  };
};

export default useGeolocation;
