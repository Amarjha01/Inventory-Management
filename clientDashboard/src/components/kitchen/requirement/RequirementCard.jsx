import { Link } from "react-router-dom";
import Card from "../../shared/ui/Card";
import RequirementStatusBadge from "./RequirementStatusBadge";
import { FiChevronRight, FiPackage } from "react-icons/fi";

const RequirementCard = ({ requirement }) => {
  return (
    <Link to={`/requirements/${requirement._id}`}>
      <Card className="hover:shadow-md transition-all duration-200">

        <div className="flex items-start justify-between">

          <div>

            <h2 className="text-lg font-semibold">
              {requirement.requirementNumber}
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {
              new Date(requirement.createdAt).toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "medium",
              timeZone: "Asia/Kolkata",
            })}
            </p>

          </div>

          <RequirementStatusBadge
            status={requirement.status}
          />

        </div>

        <div className="mt-5 flex items-center justify-between">

          <div className="flex items-center gap-2 text-gray-600">

            <FiPackage />

            <span>

              {requirement.items.length} Items

            </span>

          </div>

          <div className="flex items-center gap-2 text-teal-600">

            <span className="text-sm font-medium">
              View Details
            </span>

            <FiChevronRight />

          </div>

        </div>

      </Card>
    </Link>
  );
};

export default RequirementCard;