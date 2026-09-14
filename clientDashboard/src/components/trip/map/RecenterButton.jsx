import { useMap } from "react-leaflet";
import { LocateFixed } from "lucide-react";

const RecenterButton = ({ location }) => {
  const map = useMap();

  if (!location) {
    return null;
  }

  const recenter = () => {
    map.flyTo([location.latitude, location.longitude], 16, {
      duration: 0.8,
    });
  };

  return (
    <button
      type="button"
      onClick={recenter}
      className="absolute right-4 top-4 z-[1000] rounded-xl bg-white p-3 shadow-lg"
      title="My location"
    >
      <LocateFixed size={20} />
    </button>
  );
};

export default RecenterButton;
