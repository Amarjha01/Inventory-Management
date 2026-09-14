import { Polyline } from "react-leaflet";

const TripRoute = ({ coordinates }) => {
  if (!coordinates?.length) {
    return null;
  }

  return (
    <Polyline
      positions={coordinates.map(([lng, lat]) => [lat, lng])}
      pathOptions={{
        weight: 5,
        opacity: 0.8,
      }}
    />
  );
};

export default TripRoute;
