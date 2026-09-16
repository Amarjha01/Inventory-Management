import { Circle, CircleMarker, Popup } from "react-leaflet";

const CurrentLocationMarker = ({ location }) => {
  if (!location?.latitude || !location?.longitude) {
    return null;
  }

  const position = [location.latitude, location.longitude];

  return (
    <>
     

      <CircleMarker
        center={position}
        radius={8}
        pathOptions={{
          weight: 3,
          fillOpacity: 1,
        }}
      >
        <Popup>
          <strong>Current Location</strong>
          <br />
          GPS location
          {location.accuracy ? ` ±${Math.round(location.accuracy)}m` : ""}
        </Popup>
      </CircleMarker>
    </>
  );
};

export default CurrentLocationMarker;
