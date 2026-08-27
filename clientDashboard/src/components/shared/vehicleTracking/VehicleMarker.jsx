import { Marker } from "react-leaflet";
import L from "leaflet";

const vehicleIcon = L.icon({
  iconUrl: "/ui/tracking/vehicle.png",

  iconSize: [80, 80],
  iconAnchor: [40, 40],
});

const VehicleMarker = ({ vehicle }) => {
  const {
    latitude,
    longitude,
  } = vehicle.location;

  return (
    <Marker
      position={[latitude, longitude]}
      icon={vehicleIcon}
    />
  );
};

export default VehicleMarker;