import { useEffect, useState } from "react";

import MainStoreLayout from "../../../layouts/MainStoreLayout";

import Loader from "../../shared/ui/Loader";
import RequirementCard from "../../kitchen/requirement/RequirementCard";

import { getAllRequirements } from "../../../services/requirement.service";

const Requirements = () => {

    const [loading, setLoading] = useState(true);

    const [requirements, setRequirements] = useState([]);

    useEffect(() => {

        const load = async () => {

            try {

                const data = await getAllRequirements();

                setRequirements(data);

            }

            finally {

                setLoading(false);

            }

        };

        load();

    }, []);

    if (loading) {

        return (

            <MainStoreLayout>

                <Loader />

            </MainStoreLayout>

        );

    }

    return (

        <MainStoreLayout>

            <div className="space-y-4">

                {

                    requirements.map(requirement => (

                        <RequirementCard
                            key={requirement.id}
                            requirement={requirement}
                        />

                    ))

                }

            </div>

        </MainStoreLayout>

    );

};

export default Requirements;