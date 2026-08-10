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

  useEffect(() => {
    const loadRequirement = async () => {
      try {
        const data = await getRequirementById(id);
        setRequirement(data);
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
      <DispatchDetails requirement={requirement}/>
      
      </div>
    </DashboardLayout>
  );
};

export default RequirementDetails;
