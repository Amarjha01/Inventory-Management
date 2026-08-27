import { useMap } from "react-leaflet";

const RecenterButton = ({ position }) => {
  const map = useMap();

  const handleRecenter = () => {
    map.flyTo(position, map.getZoom(), {
      animate: true,
      duration: 0.5,
    });
  };

  return (
    <button
      type="button"
      onClick={handleRecenter}
      className="
        absolute
        bottom-5
        right-5
        z-1000
        rounded-full
        bg-white
        px-4
        py-2
        shadow-lg
      "
    >
      Re-center
    </button>
  );
};

export default RecenterButton;