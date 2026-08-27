import { useParams } from "react-router-dom";

import useVehicleTracking from "../../hooks/useVehicleTracking";

import TrackingHeader from "../../components/shared/vehicleTracking/TrackingHeader";
import TrackingMap from "../../components/shared/vehicleTracking/TrackingMap";
// import VehicleInfo from "../../components/shared/vehicleTracking/VehicleInfo";
import { useSearchParams } from "react-router-dom";
const VehicleTracking = ({id}) => {
  
  


  const {
    vehicle,
    loading,
    error,
  } = useVehicleTracking(id);

  if (loading && !vehicle) {
    return <div>Loading...</div>;
  }

  if (error && !vehicle) {
    return <div>{error}</div>;
  }

  if (!vehicle) {
    return null;
  }

  return (
    <div className="flex h-112.5 w-full flex-col rounded-lg overflow-hidden">
      <TrackingHeader vehicle={vehicle} />

      <div className="relative min-h-0 w-full flex-1">
        <TrackingMap vehicle={vehicle} />
      </div>
    </div>
  );
};

export default VehicleTracking;