import { useState } from "react";

import DispatchInfo from "./DispatchInfo";
import DispatchItems from "./DispatchItems";
import ReceiveRequirement from "./ReceiveRequirement";
import { useNavigate } from "react-router-dom";
import { receiveRequirement } from "../../../services/requirement.service";

const DispatchDetails = ({ requirement, onSuccess }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  if (!requirement?.dispatch) {
    return null;
  }

 const handleReceive = async (gatePass) => {

    try {

        setLoading(true);

        const formData = new FormData();

        formData.append(
            "gatePass",
            gatePass
        );

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

  return (
    <div className="space-y-5">
      <DispatchInfo dispatch={requirement.dispatch} />

      <DispatchItems items={requirement.items} />

      {requirement.status === "Out For Delivery" && (
        <ReceiveRequirement loading={loading} onReceive={handleReceive} />
      )}
    </div>
  );
};

export default DispatchDetails;
