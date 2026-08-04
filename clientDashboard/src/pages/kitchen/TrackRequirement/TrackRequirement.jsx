import { useEffect, useState } from "react";

import DashboardLayout from "../../../layouts/DashboardLayout";

import Loader from "../../../components/shared/ui/Loader";
import PageHeader from "../../../components/shared/ui/PageHeader";

import RequirementHeader from "../../../components/kitchen/requirement/RequirementHeader";
import RequirementItems from "../../../components/kitchen/requirement/RequirementItems";
import RequirementTimeline from "../../../components/kitchen/requirement/RequirementTimeline";
import VehicleCard from "../../../components/kitchen/requirement/VehicleCard";

import { getCurrentRequirement } from "../../../services/requirement.service";

const TrackRequirement = () => {

    const [loading, setLoading] = useState(true);

    const [requirement, setRequirement] = useState(null);

    useEffect(() => {

        const load = async () => {

            try {

                const data = await getCurrentRequirement();

                setRequirement(data);

            } finally {

                setLoading(false);

            }

        };

        load();

    }, []);

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
                />

                <div className="bg-white rounded-2xl border p-10 text-center">

                    <h2 className="text-xl font-semibold">

                        No Active Requirement

                    </h2>

                    <p className="text-gray-500 mt-2">

                        You don't have any active material requests.

                    </p>

                </div>

            </DashboardLayout>

        );

    }

    return (

        <DashboardLayout>

            <PageHeader
                title="Track Requirement"
                subtitle="Current material request"
            />

            <div className="space-y-5">

                <RequirementHeader
                    requirement={requirement}
                />

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

            </div>

        </DashboardLayout>

    );

};

export default TrackRequirement;