import Card from "../ui/Card";
import InfoRow from "../ui/InfoRow";

const DispatchInfo = ({
    dispatch,
}) => {

    return (

        <Card>

            <h3 className="text-lg font-semibold mb-5">

                Dispatch Details

            </h3>

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
                value={new Date(
                    dispatch.dispatchedAt
                ).toLocaleString()}
            />

        </Card>

    );

};

export default DispatchInfo;