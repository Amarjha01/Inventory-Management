import { Marker, Popup } from "react-leaflet";

const DestinationMarker = ({ destination, index, active = false }) => {
  if (destination?.latitude == null || destination?.longitude == null) {
    return null;
  }

  return (
    <Marker position={[destination.latitude, destination.longitude]}>
      <Popup>
        <div className="min-w-[150px]">
          <div className="font-semibold">
            Stop {index + 1}: {destination.name}
          </div>

          {destination.address && (
            <div className="mt-1 text-sm text-gray-600">
              {destination.address}
            </div>
          )}

          <div className="mt-2 text-xs">
            {active ? "Current destination" : destination.status}
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default DestinationMarker;
