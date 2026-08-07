import { useEffect, useMemo, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import Card from "../../../components/shared/ui/Card";
import Button from "../../../components/shared/ui/Button";
import Loader from "../../../components/shared/ui/Loader";

import {
  getRequirementById,
  dispatchRequirement,
} from "../../../services/requirement.service";

import { getInventory } from "../../../services/inventory.service";

import { getVehicles } from "../../../services/vehicle.service";

const RequirementWorkspace = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [requirement, setRequirement] = useState(null);

  const [inventory, setInventory] = useState([]);

  const [vehicles, setVehicles] = useState([]);

  const [remarks, setRemarks] = useState("");

  const [vehicleId, setVehicleId] = useState("");

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [requirementData, inventoryData, vehicleData] = await Promise.all([
        getRequirementById(id),

        getInventory(),

        getVehicles(),
      ]);
      console.log(requirementData, inventoryData, vehicleData);

      setRequirement(requirementData);

      setInventory(inventoryData);

      setVehicles(vehicleData);

      setRemarks(requirementData.publicRemarks || "");

      setVehicleId(requirementData.vehicle?._id || "");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const inventoryMap = useMemo(() => {
    const map = {};

    inventory.forEach((item) => {
      map[item._id] = item;
    });

    return map;
  }, [inventory]);

  const updateDispatchQuantity = (
    inventoryId,

    quantity,
  ) => {
    if (quantity < 0) {
      quantity = 0;
    }

    setRequirement((prev) => ({
      ...prev,

      items: prev.items.map((item) =>
        item.inventoryId._id === inventoryId
          ? {
              ...item,

              dispatchedQuantity: Number(quantity),
            }
          : item,
      ),
    }));
  };

  const handleSave = async () => {
    try {
      const payload = {
        vehicleId,

        remarks,

        items: requirement.items.map((item) => ({
          inventoryId: item.inventoryId._id,

          quantity: item.dispatchedQuantity,
        })),
      };
console.log(payload);

      await dispatchRequirement(
        requirement._id,

        payload,
      );

      alert("Requirement dispatched successfully.");

      navigate("/store/requirements");
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Failed to dispatch.");
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (requirement) {
    return (
      <div className="space-y-5 pb-10">
        <Card>
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold">
                {requirement.requirementNumber}
              </h2>

              <p className="text-gray-500 mt-1">
                {new Date(requirement.createdAt).toLocaleString()}
              </p>
            </div>

            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
              {requirement.status}
            </span>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <p className="text-sm text-gray-500">Kitchen</p>

              <p className="font-medium">{requirement.kitchen?.name}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Address</p>

              <p>{requirement.kitchen?.address}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Created By</p>

              <p>{requirement.createdBy?.name}</p>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-5">Requested Items</h3>

          <div className="space-y-5">
            {requirement.items.map((item) => {
              const stock = inventoryMap[item.inventoryId._id];

              return (
                <div
                  key={item.inventoryId._id}
                  className="border rounded-xl p-4"
                >
                  <div className="flex gap-4">
                    <img
                      src={`/items/${item.inventoryId.image}`}
                      alt={item.inventoryId.name}
                      className="w-16 h-16 rounded-xl object-cover"
                    />

                    <div className="flex-1">
                      <h4 className="font-semibold">{item.inventoryId.name}</h4>

                      <p className="text-sm text-gray-500">
                        {item.inventoryId.hindiName}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5 mt-5">
                    <div>
                      <p className="text-xs text-gray-500">Requested</p>

                      <p className="font-semibold">
                        {item.quantity} {item.inventoryId.unit}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Available Stock</p>

                      <p className="font-semibold text-green-600">
                        {stock?.quantity || 0} {item.inventoryId.unit}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5">
                    <label className="block mb-2 text-sm font-medium">
                      Dispatch Quantity
                    </label>

                    <input
                      type="number"
                      min={0}
                      max={stock?.quantity || 0}
                      value={item.dispatchedQuantity ?? item.quantity}
                      onChange={(e) =>
                        updateDispatchQuantity(
                          item.inventoryId._id,

                          e.target.value,
                        )
                      }
                      className="w-full border rounded-xl px-3 py-3 outline-none"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">Assign Vehicle</h3>

          <select
            value={vehicleId}
            onChange={(e) => setVehicleId(e.target.value)}
            className="w-full border rounded-xl px-3 py-3"
          >
            <option value="">Select Vehicle</option>

            {vehicles

              .filter((vehicle) => vehicle.isActive)

              .map((vehicle) => (
                <option key={vehicle._id} value={vehicle._id}>
                  {vehicle.vehicleNumber}

                  {" - "}

                  {vehicle.vehicleName}
                </option>
              ))}
          </select>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">Dispatch Remarks</h3>

          <textarea
            rows={4}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Write dispatch remarks..."
            className="w-full border rounded-xl p-3 resize-none"
          />
        </Card>
        <Card>
          <h3 className="text-lg font-semibold mb-4">Activity History</h3>

          {requirement.activities?.length === 0 ? (
            <div className="text-gray-500">No activities found.</div>
          ) : (
            <div className="space-y-4">
              {requirement?.activities?.map((activity) => (
                <div
                  key={activity._id}
                  className="border-l-4 border-teal-500 pl-4"
                >
                  <p className="font-medium">{activity.action}</p>

                  <p className="text-sm text-gray-500">{activity.user?.name}</p>

                  <p className="text-xs text-gray-400">
                    {new Date(activity.createdAt).toLocaleString()}
                  </p>

                  {activity.remarks && (
                    <p className="mt-2 text-sm text-gray-600">
                      {activity.remarks}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>

        <Button className="w-full" onClick={handleSave}>
          Dispatch Requirement
        </Button>
      </div>
    );
  }
};

export default RequirementWorkspace;