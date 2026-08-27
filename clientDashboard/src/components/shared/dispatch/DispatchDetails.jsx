import { useState } from "react";

import DispatchInfo from "./DispatchInfo";
import DispatchItems from "./DispatchItems";
import ReceiveRequirement from "./ReceiveRequirement";
import { useNavigate } from "react-router-dom";
import { receiveRequirement } from "../../../services/requirement.service";
import VehicleTracking from "../../../pages/VehicleTracking/VehicleTracking";

const DispatchDetails = ({ requirement, onSuccess }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showMap , setShowMap] = useState(false);
  if (!requirement?.dispatch) {
    return null;
  }

 const handleReceive = async (gatePass) => {

    try {

        setLoading(true);

        const formData = new FormData();

  gatePass.forEach((file) => {
    formData.append("gatePass", file);
  });

        await receiveRequirement(
            requirement._id,
            formData
        );

        alert("Requirement received successfully.");

        onSuccess?.();

        navigate("/history", {
            replace: true,
        });

    } catch (error) {

        console.error(error);

        alert(
            error.response?.data?.message ||
            "Failed to receive requirement."
        );

    } finally {

        setLoading(false);

    }

};

function handleShowMap(){
  setShowMap(!showMap)
}

  return (
    <div className="space-y-5">
      <DispatchInfo dispatch={requirement.dispatch} status={requirement.status} handleShowMap={handleShowMap}/>

      {requirement?.dispatch?.vehicle?.tracker?.isActive 
      && requirement.status === "Out For Delivery" && showMap &&
      <div className="h-80% z-10">
        <VehicleTracking id={requirement._id.toString()} />
      </div>
      }
      <DispatchItems items={requirement.items} />

      {requirement.status === "Out For Delivery" && (
        <ReceiveRequirement loading={loading} onReceive={handleReceive} />
      )}
    </div>
  );
};

export default DispatchDetails;
