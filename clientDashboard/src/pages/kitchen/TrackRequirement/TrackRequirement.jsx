import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiTruck, FiInbox } from "react-icons/fi";

import DashboardLayout from "../../../layouts/DashboardLayout";

import Loader from "../../../components/shared/ui/Loader";
import PageHeader from "../../../components/shared/ui/PageHeader";

import RequirementHeader from "../../../components/kitchen/requirement/RequirementHeader";
import RequirementItems from "../../../components/kitchen/requirement/RequirementItems";
import RequirementTimeline from "../../../components/kitchen/requirement/RequirementTimeline";
import VehicleCard from "../../../components/kitchen/requirement/VehicleCard";

import { getLatestKitchenRequirement } from "../../../services/requirement.service";
import DispatchDetails from "../../../components/shared/dispatch/DispatchDetails";
import ReceiveRequirement from "../../../components/shared/dispatch/ReceiveRequirement";

const TrackRequirement = () => {
  const [loading, setLoading] = useState(true);
  const [requirement, setRequirement] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    const load = async () => {
      try {
        const data = await getLatestKitchenRequirement(user.kitchenId._id);

        setRequirement(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const animation = {
    initial: {
      opacity: 0,
      y: 20,
    },
    animate: {
      opacity: 1,
      y: 0,
    },
  };

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
        <PageHeader
          title="Track Requirement"
          subtitle="Monitor your current material request"
        />

        <motion.div
          {...animation}
          className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 py-16 text-center"
        >
          <FiInbox className="mx-auto text-5xl text-gray-300" />

          <h2 className="mt-4 text-xl font-bold text-gray-700">
            No Active Requirement
          </h2>

          <p className="mt-2 text-gray-500">
            You don't have any active material requests currently.
          </p>
        </motion.div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Track Requirement"
        subtitle="Monitor your current material request"
      />

      <div className="space-y-5">
        {/* Requirement Header */}
        <motion.div {...animation} transition={{ duration: 0.3 }}>
          <RequirementHeader requirement={requirement} />
        </motion.div>
        <DispatchDetails requirement={requirement} />
      </div>
    </DashboardLayout>
  );
};

export default TrackRequirement;
