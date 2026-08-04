import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../../layouts/DashboardLayout";

import Loader from "../../../components/shared/ui/Loader";
import Button from "../../../components/shared/ui/Button";

import RequirementHeader from "../../../components/kitchen/requirement/RequirementHeader";
import RequirementTimeline from "../../../components/kitchen/requirement/RequirementTimeline";
import RequirementItems from "../../../components/kitchen/requirement/RequirementItems";
import VehicleCard from "../../../components/kitchen/requirement/VehicleCard";

import { getRequirementById } from "../../../services/requirement.service";

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
        <div className="bg-white rounded-2xl border p-10 text-center">
          <h2 className="text-xl font-semibold">Requirement Not Found</h2>

          <Button
            className="mt-6"
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-5">

        <RequirementHeader requirement={requirement} />

        <RequirementTimeline
          timeline={requirement.timeline}
          currentStatus={requirement.status}
        />

        <RequirementItems
          items={requirement.items}
        />

        <VehicleCard
          vehicle={requirement.vehicle}
        />

        {requirement.receivingLetter && (
          <div className="bg-white rounded-2xl border p-5">

            <h2 className="text-lg font-semibold mb-4">
              Receiving Letter
            </h2>

            <img
              src={requirement.receivingLetter.file}
              alt="Receiving Letter"
              className="rounded-xl w-full"
            />

            <p className="text-sm text-gray-500 mt-3">
              Uploaded By : {requirement.receivingLetter.uploadedBy}
            </p>

            <p className="text-sm text-gray-500">
              Uploaded At : {requirement.receivingLetter.uploadedAt}
            </p>

          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default RequirementDetails;