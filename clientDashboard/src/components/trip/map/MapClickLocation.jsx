import { useMapEvents } from "react-leaflet";

const MapClickLocation = ({ onSelect }) => {
  useMapEvents({
    click(event) {
      onSelect({
        latitude: event.latlng.lat,
        longitude: event.latlng.lng,
      });
    },
  });

  return null;
};

export default MapClickLocation;
