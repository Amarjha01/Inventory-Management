import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Card from "../../../components/shared/ui/Card";
import Button from "../../../components/shared/ui/Button";
import Loader from "../../../components/shared/ui/Loader";

import requirements from "../../../mock/requirements";
import inventory from "../../../mock/inventory";
import vehicles from "../../../mock/vehicles";

const RequirementWorkspace = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [requirement, setRequirement] = useState(null);

    const [remarks, setRemarks] = useState("");

    const [status, setStatus] = useState("");

    const [vehicleId, setVehicleId] = useState("");

    useEffect(() => {

        const req = requirements.find(item => item.id === id);

        if (req) {

            setRequirement(JSON.parse(JSON.stringify(req)));

            setRemarks(req.publicRemarks || "");

            setStatus(req.status);

            setVehicleId(req.vehicleId || "");

        }

        setLoading(false);

    }, [id]);

    const inventoryMap = useMemo(() => {

        const map = {};

        inventory.forEach(item => {

            map[item.id] = item;

        });

        return map;

    }, []);

    const updateDispatchQuantity = (itemId, value) => {

        setRequirement(prev => ({

            ...prev,

            items: prev.items.map(item =>

                item.itemId === itemId

                    ? {

                        ...item,

                        dispatchedQuantity: Number(value)

                    }

                    : item

            )

        }));

    };

    const handleSave = () => {

        const payload = {

            ...requirement,

            status,

            vehicleId,

            publicRemarks: remarks

        };

        console.log(payload);

        alert("Requirement updated successfully (Mock)");

    };

    if (loading) {

        return <Loader />;

    }

    if (!requirement) {

        return (

            <div className="p-5">

                <Card>

                    <h2 className="text-xl font-semibold">

                        Requirement not found

                    </h2>

                    <Button
                        className="mt-5"
                        onClick={() => navigate(-1)}
                    >

                        Go Back

                    </Button>

                </Card>

            </div>

        );

    }

    return (

        <div className="space-y-5 pb-10">

            <Card>

                <div className="flex justify-between items-start">

                    <div>

                        <h2 className="text-xl font-bold">

                            {requirement.id}

                        </h2>

                        <p className="text-gray-500 mt-1">

                            {requirement.createdAt}

                        </p>

                    </div>

                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">

                        {status}

                    </span>

                </div>

                <div className="mt-5 space-y-3">

                    <div>

                        <p className="text-sm text-gray-500">

                            Kitchen

                        </p>

                        <p className="font-medium">

                            {requirement.kitchen.name}

                        </p>

                    </div>

                    <div>

                        <p className="text-sm text-gray-500">

                            Address

                        </p>

                        <p>

                            {requirement.kitchen.address}

                        </p>

                    </div>

                    <div>

                        <p className="text-sm text-gray-500">

                            Created By

                        </p>

                        <p>

                            {requirement.createdBy.name}

                        </p>

                    </div>

                </div>

            </Card>

            <Card>

                <h3 className="text-lg font-semibold mb-5">

                    Requested Items

                </h3>

                <div className="space-y-5">

                    {

                        requirement.items.map(item => {

                            const stock = inventoryMap[item.itemId];

                            return (

                                <div
                                    key={item.itemId}
                                    className="border rounded-xl p-4"
                                >

                                    <div className="flex gap-4">

                                        <img
                                            src={`/items/${item.image}`}
                                            alt={item.name}
                                            className="w-16 h-16 rounded-xl object-cover"
                                        />

                                        <div className="flex-1">

                                            <h4 className="font-semibold">

                                                {item.name}

                                            </h4>

                                            <p className="text-sm text-gray-500">

                                                {item.hindiName}

                                            </p>

                                        </div>

                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mt-5">

                                        <div>

                                            <p className="text-xs text-gray-500">

                                                Requested

                                            </p>

                                            <p className="font-semibold">

                                                {item.requestedQuantity} {item.unit}

                                            </p>

                                        </div>

                                        <div>

                                            <p className="text-xs text-gray-500">

                                                Available Stock

                                            </p>

                                            <p className="font-semibold text-green-600">

                                                {stock?.currentStock || 0} {item.unit}

                                            </p>

                                        </div>

                                    </div>

                                    <div className="mt-5">

                                        <label className="block text-sm font-medium mb-2">

                                            Dispatch Quantity

                                        </label>

                                        <input
                                            type="number"
                                            value={item.dispatchedQuantity}
                                            onChange={(e) =>
                                                updateDispatchQuantity(
                                                    item.itemId,
                                                    e.target.value
                                                )
                                            }
                                            className="w-full border rounded-xl px-3 py-3 outline-none"
                                        />

                                    </div>

                                </div>

                            );

                        })

                    }

                </div>

            </Card>

            <Card>

                <h3 className="text-lg font-semibold mb-4">

                    Assign Vehicle

                </h3>

                <select
                    value={vehicleId}
                    onChange={(e) => setVehicleId(e.target.value)}
                    className="w-full border rounded-xl px-3 py-3"
                >

                    <option value="">

                        Select Vehicle

                    </option>

                    {

                        vehicles.map(vehicle => (

                            <option
                                key={vehicle.id}
                                value={vehicle.id}
                            >

                                {vehicle.number}

                            </option>

                        ))

                    }

                </select>

            </Card>

            <Card>

                <h3 className="text-lg font-semibold mb-4">

                    Status

                </h3>

                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full border rounded-xl px-3 py-3"
                >

                    <option value="SUBMITTED">

                        Submitted

                    </option>

                    <option value="OUT_FOR_DELIVERY">

                        Out For Delivery

                    </option>

                    <option value="RECEIVED">

                        Received

                    </option>

                </select>

            </Card>

            <Card>

                <h3 className="text-lg font-semibold mb-4">

                    Public Remarks

                </h3>

                <textarea
                    rows={4}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="w-full border rounded-xl p-3 resize-none"
                    placeholder="Write remarks..."
                />

            </Card>

            <Card>

                <h3 className="text-lg font-semibold mb-4">

                    Activity History

                </h3>

                <div className="space-y-4">

                    {

                        requirement.history?.map((history, index) => (

                            <div
                                key={index}
                                className="border-l-4 border-teal-500 pl-4"
                            >

                                <p className="font-medium">

                                    {history.action}

                                </p>

                                <p className="text-sm text-gray-500">

                                    {history.userName}

                                </p>

                                <p className="text-xs text-gray-400">

                                    {history.createdAt}

                                </p>

                            </div>

                        ))

                    }

                </div>

            </Card>

            <Button
                className="w-full"
                onClick={handleSave}
            >

                Save Changes

            </Button>

        </div>

    );

};

export default RequirementWorkspace;