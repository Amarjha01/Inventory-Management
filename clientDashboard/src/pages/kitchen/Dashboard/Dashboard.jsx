import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import DashboardLayout from "../../../layouts/DashboardLayout";
import PageHeader from "../../../components/shared/ui/PageHeader";
import StatCard from "../../../components/kitchen/dashboard/StatCard";
import QuickAction from "../../../components/kitchen/dashboard/QuickAction";
import Loader from "../../../components/shared/ui/Loader";

import {
  MdInventory,
  MdHistory,
  MdLocalShipping,
  MdPendingActions,
  MdCheckCircle,
} from "react-icons/md";

import { getRequirements } from "../../../services/requirement.service";
import { storage } from "../../../utils/storage";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    pending: 0,
    dispatched: 0,
    completed: 0,
    total: 0,
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const user = storage.getUser();

      const requirements = await getRequirements();

      const kitchenRequirements = requirements.filter(
        (item) => item.kitchen._id === user.kitchenId._id
      );

      setStats({
        total: kitchenRequirements.length,
        pending: kitchenRequirements.filter(
          (item) => item.status === "SUBMITTED"
        ).length,
        dispatched: kitchenRequirements.filter(
          (item) => item.status === "OUT_FOR_DELIVERY"
        ).length,
        completed: kitchenRequirements.filter(
          (item) => item.status === "RECEIVED"
        ).length,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  const statCards = [
    {
      title: "Pending",
      value: stats.pending,
      icon: <MdPendingActions size={24} />,
      color: "bg-amber-100 text-amber-600",
    },
    {
      title: "Dispatched",
      value: stats.dispatched,
      icon: <MdLocalShipping size={24} />,
      color: "bg-sky-100 text-sky-600",
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: <MdCheckCircle size={24} />,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Total",
      value: stats.total,
      icon: <MdInventory size={24} />,
      color: "bg-teal-100 text-teal-600",
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back! Here's your kitchen overview."
      />

      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        {statCards.map((card) => (
          <motion.div
            key={card.title}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.35 }}
          >
            <StatCard
              title={card.title}
              value={card.value}
              icon={card.icon}
              color={card.color}
            />
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="mt-8"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          Quick Actions
        </h2>

        <div className="grid gap-4 md:grid-cols-3">
          <QuickAction
            title="New Requirement"
            icon={<MdInventory size={26} />}
            to="/new-requirement"
          />

          <QuickAction
            title="Requirement History"
            icon={<MdHistory size={26} />}
            to="/history"
          />

          <QuickAction
            title="Track Requirement"
            icon={<MdLocalShipping size={26} />}
            to="/track"
          />
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Dashboard;