import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiFileText } from "react-icons/fi";

import DashboardLayout from "../../../layouts/DashboardLayout";

import Loader from "../../../components/shared/ui/Loader";
import Button from "../../../components/shared/ui/Button";

import RequirementHeader from "../../../components/kitchen/requirement/RequirementHeader";
import RequirementTimeline from "../../../components/kitchen/requirement/RequirementTimeline";
import RequirementItems from "../../../components/kitchen/requirement/RequirementItems";
import VehicleCard from "../../../components/kitchen/requirement/VehicleCard";

import { getRequirementById } from "../../../services/requirement.service";
import DispatchDetails from "../../../components/shared/dispatch/DispatchDetails";
import { RiDeleteBin3Fill } from "react-icons/ri";

const base_url = import.meta.env.VITE_SERVER_BASE_URL;
const sectionAnimation = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
};

const RequirementDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [requirement, setRequirement] = useState(null);
  const [isReceived, setIsReceived] = useState(false);

  useEffect(() => {
    const loadRequirement = async () => {
      try {
        const data = await getRequirementById(id);
        setRequirement(data);
        setIsReceived(data.status === "Received");
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadRequirement();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <Loader />
      </DashboardLayout>
    );
  }

  if (!requirement) {
    return (
      <DashboardLayout>
        <motion.div
          {...sectionAnimation}
          className="rounded-2xl border bg-white p-10 text-center shadow-sm"
        >
          <h2 className="text-xl font-bold text-gray-800">
            Requirement Not Found
          </h2>

          <p className="mt-2 text-gray-500">
            The requested requirement does not exist.
          </p>

          <Button
            className="mt-6 flex items-center gap-2 mx-auto"
            onClick={() => navigate(-1)}
          >
            <FiArrowLeft />
            Go Back
          </Button>
        </motion.div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Header */}
        <motion.div {...sectionAnimation} transition={{ duration: 0.3 }}>
          <RequirementHeader requirement={requirement} />
        </motion.div>
        <DispatchDetails requirement={requirement} />
        {isReceived && requirement?.gatePass[0]?.image && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requirement?.gatePass?.map((gatePass, index) => (
              <a
                key={gatePass?.image || index}
                href={`${base_url}/uploads/requirements/${gatePass?.image}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={`${base_url}/uploads/requirements/${gatePass?.image}`}
                  alt={`Gate Pass ${index + 1}`}
                  className="w-full h-72 object-contain rounded-xl border cursor-pointer bg-gray-50"
                />
              </a>
            ))}
            <p className="mt-2 text-sm text-gray-500">
              <span className="font-medium text-gray-700">Received At:</span>{" "}
              <span className="text-gray-500">
                {new Date(requirement.receivedAt).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "medium",
                  timeZone: "Asia/Kolkata",
                })}
              </span>
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default RequirementDetails;
