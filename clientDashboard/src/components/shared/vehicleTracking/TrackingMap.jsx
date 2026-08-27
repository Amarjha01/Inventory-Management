import {
  MapContainer,
  TileLayer,
} from "react-leaflet";

import VehicleMarker from "./VehicleMarker";
// import DestinationMarker from "./DestinationMarker";
import RecenterButton from "./RecenterButton";

const TrackingMap = ({ vehicle }) => {
  const {
    latitude,
    longitude,
  } = vehicle.location;

  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={15}
      className="h-full w-full"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <VehicleMarker vehicle={vehicle} />

      <RecenterButton
        position={[latitude, longitude]}
      />
    </MapContainer>
  );
};

export default TrackingMap;