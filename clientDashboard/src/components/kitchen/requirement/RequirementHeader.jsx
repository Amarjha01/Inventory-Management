import Card from "../../shared/ui/Card";
import RequirementStatusBadge from "./RequirementStatusBadge";

const RequirementHeader = ({ requirement }) => {

    return (

        <Card>

            <div className="flex justify-between items-start">

                <div>

                    <h2 className="text-2xl font-bold">

                        {requirement.requirementNumber}

                    </h2>

                    <p className="text-sm text-gray-500 mt-1">

                        {requirement.createdAt}

                    </p>

                </div>

                <RequirementStatusBadge
                    status={requirement.status}
                />

            </div>

            <div className="mt-6 space-y-4">

                <div>

                    <p className="text-xs text-gray-500">

                        Kitchen

                    </p>

                    <p className="font-medium">
                        {requirement.kitchen.address} {" "}
                        {requirement.kitchen.district}
                        {/* {requirement.kitchen.name} */}

                    </p>

                </div>

                <div>

                    <p className="text-xs text-gray-500">

                        Created By

                    </p>

                    <p className="font-medium">

                        {requirement.createdBy.name}

                    </p>

                </div>

                <div>

                    <p className="text-xs text-gray-500">

                        Remarks

                    </p>

                    <p className="font-medium">

                        {requirement.remarks || "No Remarks"}

                    </p>

                </div>

            </div>

        </Card>

    );

};

export default RequirementHeader;