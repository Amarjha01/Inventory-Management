import { MapContainer, TileLayer, useMap } from "react-leaflet";

import CurrentLocationMarker from "./CurrentLocationMarker";
import DestinationMarker from "./DestinationMarker";
import TripRoute from "./TripRoute";
import MapClickLocation from "./MapClickLocation";
import RecenterButton from "./RecenterButton";

const MapAutoFit = ({ currentLocation, destinations }) => {
  const map = useMap();

  const points = [];

  if (currentLocation) {
    points.push([currentLocation.latitude, currentLocation.longitude]);
  }

  destinations.forEach((destination) => {
    if (destination.latitude != null && destination.longitude != null) {
      points.push([destination.latitude, destination.longitude]);
    }
  });

  if (points.length > 1) {
    map.fitBounds(points, {
      padding: [40, 40],
    });
  }

  return null;
};

const TripMap = ({
  currentLocation,
  destinations = [],
  route = [],
  onMapClick,
  activeDestinationId,
  height = "500px",
}) => {
  const defaultCenter = currentLocation
    ? [currentLocation.latitude, currentLocation.longitude]
    : [25.5941, 85.1376];

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl"
      style={{ height }}
    >
      <MapContainer
        center={defaultCenter}
        zoom={13}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapAutoFit
          currentLocation={currentLocation}
          destinations={destinations}
        />

        <CurrentLocationMarker location={currentLocation} />

        {destinations.map((destination, index) => (
          <DestinationMarker
            key={destination._id || destination.tempId || index}
            destination={destination}
            index={index}
            active={destination._id === activeDestinationId}
          />
        ))}

        <TripRoute coordinates={route} />

        {onMapClick && <MapClickLocation onSelect={onMapClick} />}

        <RecenterButton location={currentLocation} />
      </MapContainer>
    </div>
  );
};

export default TripMap;
