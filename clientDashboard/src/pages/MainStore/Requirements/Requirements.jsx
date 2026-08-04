import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Card from "../../../components/shared/ui/Card";
import Loader from "../../../components/shared/ui/Loader";

import { getAllRequirements } from "../../../services/requirement.service";

const Requirements = () => {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [requirements, setRequirements] = useState([]);

    useEffect(() => {

        const load = async () => {

            const data = await getAllRequirements();

            setRequirements(data);

            setLoading(false);

        };

        load();

    }, []);

    if (loading) {

        return <Loader />;

    }

    return (

        <div className="space-y-4">

            <div>

                <h1 className="text-2xl font-bold">

                    Requirements

                </h1>

                <p className="text-gray-500">

                    Manage kitchen material requests

                </p>

            </div>

            {

                requirements.map(requirement => (

                    <Card
                        key={requirement.id}
                        className="cursor-pointer"
                        onClick={() =>
                            navigate(`/store/requirements/${requirement.id}`)
                        }
                    >

                        <div className="flex justify-between">

                            <div>

                                <h2 className="font-semibold">

                                    {requirement.id}

                                </h2>

                                <p className="text-sm text-gray-500">

                                    {requirement.kitchen.name}

                                </p>

                                <p className="text-xs text-gray-400">

                                    {requirement.createdAt}

                                </p>

                            </div>

                            <div className="text-right">

                                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs">

                                    {requirement.status}

                                </span>

                                <p className="text-xs mt-2">

                                    {requirement.items.length} Items

                                </p>

                            </div>

                        </div>

                    </Card>

                ))

            }

        </div>

    );

};

export default Requirements;