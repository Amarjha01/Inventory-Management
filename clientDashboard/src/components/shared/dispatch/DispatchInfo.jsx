import Card from "../ui/Card";
import InfoRow from "../ui/InfoRow";
import { FaTruck } from "react-icons/fa";
const DispatchInfo = ({
    dispatch,
    status,
    handleShowMap
}) => {

    return (

        <Card>

           <div className=" flex justify-between">
             <h3 className="text-lg font-semibold mb-5">

                Dispatch Details

            </h3>
            {dispatch?.vehicle?.tracker?.isActive && status === "Out For Delivery" && <FaTruck className="text-3xl text-[#151c4e] cursor-pointer" onClick={handleShowMap} />}
           </div>
            <InfoRow
                label="Vehicle Number"
                value={dispatch.vehicle?.vehicleNumber}
            />

            <InfoRow
                label="Vehicle Name"
                value={dispatch.vehicle?.vehicleName}
            />

            <InfoRow
                label="Driver"
                value={dispatch.driver?.name}
            />

            <InfoRow
                label="Driver Phone"
                value={dispatch.driver?.phone}
            />

            <InfoRow
                label="Dispatched By"
                value={dispatch.dispatchedBy?.name}
            />

            <InfoRow
                label="Dispatched At"
                value={dispatch.dispatchedAt !=null && 
                    new Date(dispatch?.dispatchedAt).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "medium",
                    timeZone: "Asia/Kolkata",
                })}
            />

        </Card>

    );

};

export default DispatchInfo;