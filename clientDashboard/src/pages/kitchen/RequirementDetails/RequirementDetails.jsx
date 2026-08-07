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

        {/* Timeline */}
        <motion.div
          {...sectionAnimation}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border bg-white p-5 shadow-sm"
        >
          <RequirementTimeline
            timeline={requirement.timeline}
            currentStatus={requirement.status}
          />
        </motion.div>

        {/* Items */}
        <motion.div
          {...sectionAnimation}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border bg-white p-5 shadow-sm"
        >
          <RequirementItems items={requirement.items} />
        </motion.div>

        {/* Vehicle */}
        {requirement.vehicle && (
          <motion.div
            {...sectionAnimation}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border bg-white p-5 shadow-sm"
          >
            <VehicleCard vehicle={requirement.vehicle} />
          </motion.div>
        )}

        {/* Receiving Letter */}
        {requirement.receivingLetter && (
          <motion.div
            {...sectionAnimation}
            transition={{ delay: 0.25 }}
            className="rounded-2xl border bg-white p-5 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-5">
              <div className="rounded-lg bg-teal-100 p-2 text-teal-700">
                <FiFileText size={20} />
              </div>

              <h2 className="text-lg font-semibold text-gray-800">
                Receiving Letter
              </h2>
            </div>

            <div className="overflow-hidden rounded-xl border bg-gray-50">
              <img
                src={requirement.receivingLetter.file}
                alt="Receiving Letter"
                className="w-full max-h-[600px] object-contain"
              />
            </div>

            <div className="mt-4 space-y-1 text-sm text-gray-500">
              <p>
                Uploaded By :
                <span className="ml-1 font-medium text-gray-700">
                  {requirement.receivingLetter.uploadedBy}
                </span>
              </p>

              <p>
                Uploaded At :
                <span className="ml-1 font-medium text-gray-700">
                  {new Date(
                    requirement.receivingLetter.uploadedAt,
                  ).toLocaleString()}
                </span>
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default RequirementDetails;
