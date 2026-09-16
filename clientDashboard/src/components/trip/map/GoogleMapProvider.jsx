// src/components/trip/map/GoogleMapProvider.jsx

import { APIProvider } from "@vis.gl/react-google-maps";

const GoogleMapProvider = ({ children }) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="flex items-center justify-center rounded-2xl bg-gray-100 p-6 text-sm text-red-600">
        Google Maps API key is not configured.
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey}>
      {children}
    </APIProvider>
  );
};

export default GoogleMapProvider;