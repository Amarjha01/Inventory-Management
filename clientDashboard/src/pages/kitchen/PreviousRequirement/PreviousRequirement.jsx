// src/pages/PreviousRequirement/PreviousRequirement.jsx
import { useEffect, useState } from "react";

import DashboardLayout from "../../../layouts/DashboardLayout";

import PageHeader from "../../../components/shared/ui/PageHeader";
import Loader from "../../../components/shared/ui/Loader";

import RequirementCard from "../../../components/kitchen/requirement/RequirementCard";

import { getRequirements } from "../../../services/requirement.service";

const PreviousRequirement = () => {

  const [loading, setLoading] = useState(true);

  const [requirements, setRequirements] = useState([]);

  useEffect(() => {

    const fetchRequirements = async () => {

      try {

        const data = await getRequirements();

        setRequirements(data);

      } finally {

        setLoading(false);

      }

    };

    fetchRequirements();

  }, []);

  return (

    <DashboardLayout>

      <PageHeader
        title="History"
        subtitle="All previous material requirements"
      />

      {

        loading ? (

          <Loader />

        ) : requirements.length === 0 ? (

          <div className="bg-white rounded-2xl p-8 text-center border">

            <h3 className="text-lg font-semibold">

              No Requirement Found

            </h3>

            <p className="text-gray-500 mt-2">

              You haven't submitted any requirement yet.

            </p>

          </div>

        ) : (

          <div className="space-y-4">

            {

              requirements.map((requirement) => (

                <RequirementCard
                  key={requirement.id}
                  requirement={requirement}
                />

              ))

            }

          </div>

        )

      }

    </DashboardLayout>

  );

};

export default PreviousRequirement;