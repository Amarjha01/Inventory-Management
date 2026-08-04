import Card from "../../shared/ui/Card";
import { storage } from "../../../utils/storage";

const KitchenInfo = () => {
    const user = storage.getUser();

    return (
        <Card>

            <h2 className="text-lg font-semibold mb-4">
                Kitchen Details
            </h2>

            <div className="space-y-3">

                <InfoRow
                    label="Kitchen"
                    value={user?.kitchen?.name}
                />

                <InfoRow
                    label="Kitchen Incharge"
                    value={user?.name}
                />

                <InfoRow
                    label="Store Incharge"
                    value="Ajay Kumar"
                />

                <InfoRow
                    label="Address"
                    value={user?.kitchen?.address}
                />

            </div>

        </Card>
    );
};

const InfoRow = ({ label, value }) => (
    <div>
        <p className="text-xs text-gray-500">
            {label}
        </p>

        <p className="font-medium">
            {value}
        </p>
    </div>
);

export default KitchenInfo;