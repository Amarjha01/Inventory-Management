import { Polyline } from "react-leaflet";

const TripRoute = ({ coordinates = [] }) => {
  if (!coordinates || coordinates.length < 2) {
    return null;
  }

  return (
    <Polyline
      positions={coordinates}
      pathOptions={{
        color: "#2563eb",
        weight: 5,
        opacity: 0.9,
      }}
    />
  );
};

export default TripRoute;
