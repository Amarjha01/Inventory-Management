import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiInbox } from "react-icons/fi";

import DashboardLayout from "../../../layouts/DashboardLayout";

import Loader from "../../../components/shared/ui/Loader";
import PageHeader from "../../../components/shared/ui/PageHeader";

import RequirementHeader from "../../../components/kitchen/requirement/RequirementHeader";
import DispatchDetails from "../../../components/shared/dispatch/DispatchDetails";

import { getLatestKitchenRequirement } from "../../../services/requirement.service";
import {themes} from "../../../components/shared/ui/Theme";
import ThemeProvider from "../../../components/shared/ui/ThemeProvider";
const TrackRequirement = () => {
  const [loading, setLoading] = useState(true);
  const [requirement, setRequirement] = useState(null);

  // Neutral tracking/TRACKING theme
  const theme = themes.TRACKING;

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    const load = async () => {
      try {
        const data = await getLatestKitchenRequirement(
          user.kitchenId._id
        );

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

  // ================= LOADING =================
  if (loading) {
    return (
      <DashboardLayout>
        <ThemeProvider theme={themes.TRACKING} className="min-h-full"></ThemeProvider>
          <Loader />
      </DashboardLayout>
    );
  }

  // ================= NO REQUIREMENT =================
  if (!requirement) {
    return (
      <DashboardLayout>
        <div
          style={{
            "--theme-bg": theme.background,
            "--theme-header": theme.header,
            "--theme-surface": theme.surface,
            "--theme-surface-alt": theme.surfaceAlt,
            "--theme-primary": theme.primary,
            "--theme-primary-light": theme.primaryLight,
            "--theme-primary-dark": theme.primaryDark,
            "--theme-text": theme.text,
            "--theme-text-secondary": theme.textSecondary,
            "--theme-text-primary": theme.textOnPrimary,
            "--theme-border": theme.border,
            "--theme-selected-border": theme.selectedBorder,
            "--theme-secondary": theme.secondary,
          }}
          className="
            min-h-full
            bg-(--theme-bg)
            text-(--theme-text)
            transition-colors
            duration-500
          "
        >
          <PageHeader
            title="Track Requirement"
            subtitle="Monitor your current material request"
            imageUrl='/ui/type/TRACKING.png'
          />

          <motion.div
            {...animation}
            className="
              rounded-2xl
              border-2
              border-dashed
              border-(--theme-border)
              bg-(--theme-surface-alt)
              py-16
              text-center
              transition-colors
              duration-500
            "
          >
            <div
              className="
                mx-auto
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                bg-(--theme-primary-light)
              "
            >
              <FiInbox
                className="
                  text-3xl
                  text-(--theme-primary)
                "
              />
            </div>

            <h2
              className="
                mt-4
                text-xl
                font-bold
                text-(--theme-text)
              "
            >
              No Active Requirement
            </h2>

            <p
              className="
                mt-2
                text-(--theme-text-secondary)
              "
            >
              You don't have any active material requests currently.
            </p>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  // ================= ACTIVE REQUIREMENT =================
  return (
    <DashboardLayout>
      <div
        style={{
          "--theme-bg": theme.background,
          "--theme-header": theme.header,
          "--theme-surface": theme.surface,
          "--theme-surface-alt": theme.surfaceAlt,
          "--theme-primary": theme.primary,
          "--theme-primary-light": theme.primaryLight,
          "--theme-primary-dark": theme.primaryDark,
          "--theme-text": theme.text,
          "--theme-text-secondary": theme.textSecondary,
          "--theme-text-primary": theme.textOnPrimary,
          "--theme-border": theme.border,
          "--theme-selected-border": theme.selectedBorder,
          "--theme-secondary": theme.secondary,
        }}
        className="
          min-h-full
          bg-(--theme-bg)
          text-(--theme-text)
          transition-colors
          duration-500
        "
      >
        <PageHeader
          title="Track Requirement"
          subtitle="Monitor your current material request"
          imageUrl='/ui/type/TRACKING.png'
        />

        <div className="space-y-5">

          {/* ================= REQUIREMENT HEADER ================= */}
          <motion.div
            {...animation}
            transition={{ duration: 0.3 }}
          >
            <RequirementHeader
              requirement={requirement}
            />
          </motion.div>

          {/* ================= DISPATCH ================= */}
          <motion.div
            {...animation}
            transition={{
              duration: 0.3,
              delay: 0.1,
            }}
          >
            <DispatchDetails
              requirement={requirement}
            />
          </motion.div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default TrackRequirement;