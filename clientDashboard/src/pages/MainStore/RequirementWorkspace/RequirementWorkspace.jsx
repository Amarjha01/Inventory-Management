import { useEffect, useMemo, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import Card from "../../../components/shared/ui/Card";
import Button from "../../../components/shared/ui/Button";
import Loader from "../../../components/shared/ui/Loader";
const base_url =  import.meta.env.VITE_SERVER_BASE_URL;
import {
  getRequirementById,
  dispatchRequirement,
} from "../../../services/requirement.service";

import { getInventory } from "../../../services/inventory.service";

import { getVehicles } from "../../../services/vehicle.service";

import { getDrivers } from "../../../services/driver.service";

import InfoRow from "../../../components/shared/ui/InfoRow";
import DispatchDetails from "../../../components/shared/dispatch/DispatchDetails";

const RequirementWorkspace = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [requirement, setRequirement] = useState(null);

  const [inventory, setInventory] = useState([]);

  const [vehicles, setVehicles] = useState([]);

  const [drivers, setDrivers] = useState([]);

  const [remarks, setRemarks] = useState("");

  const [vehicleId, setVehicleId] = useState("");

  const [driverId, setDriverId] = useState("");
  // console.log(drivers);

  // manual
  const [manualVehicleNumber, setManualVehicleNumber] = useState("");

  const [manualDriverName, setManualDriverName] = useState("");

  const [manualDriverPhone, setManualDriverPhone] = useState("");

  const [isDispatching, setIsDispatching] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [requirementData, inventoryData, vehicleData, driverData] =
        await Promise.all([
          getRequirementById(id),

          getInventory(),

          getVehicles(),

          getDrivers(),
        ]);
      // console.log("requirementData" , requirementData , "inventoryData" , inventoryData , "vehicleData" , vehicleData , "driverData" , driverData );

      setRequirement({
        ...requirementData,

        items: requirementData.items.map((item) => ({
          ...item,

          dispatchedQuantity: item.dispatchedQuantity ?? item.quantity,
        })),
      });

      setInventory(inventoryData);

      setVehicles(vehicleData);
      setDrivers(driverData);
      setRemarks(requirementData.publicRemarks || "");

      setVehicleId(requirementData.vehicle?._id || "");
      setDriverId(requirementData.driver?._id || "");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const isDispatched = requirement?.status === "Out For Delivery";
  const isReceived = requirement?.status === "Received";
  const inventoryMap = useMemo(() => {
    const map = {};

    inventory.forEach((item) => {
      map[item._id] = item;
    });

    return map;
  }, [inventory]);

  const updateDispatchQuantity = (inventoryId, value) => {
    setRequirement((prev) => ({
      ...prev,

      items: prev.items.map((item) => {
        if (item.inventoryId._id !== inventoryId) {
          return item;
        }

        if (value === "") {
          return {
            ...item,
            dispatchedQuantity: "",
          };
        }

        let quantity = Number(value);

        if (quantity < 0) {
          quantity = 0;
        }

       

        return {
          ...item,

          dispatchedQuantity: quantity,
        };
      }),
    }));
  };

  const handleSave = async () => {
    setIsDispatching(true);
    try {
      const payload = {
        vehicleId,
        manualVehicleNumber,
        driverId,
        manualDriverName,
        manualDriverPhone,
        remarks,

        items: requirement.items.map((item) => ({
          inventoryId: item.inventoryId._id,
          quantity: item.quantity,
          dispatchedQuantity: item.dispatchedQuantity,
          unit: item.unit,
        })),
      };
      await dispatchRequirement(requirement._id, payload);
      setIsDispatching(false);

      alert("Requirement dispatched successfully.");

      navigate("/store/requirements");
    } catch (error) {
      setIsDispatching(false);
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
                      disabled={isDispatched || isReceived}
                      min={0}
                      value={item.dispatchedQuantity}
                      onChange={(e) =>
                        updateDispatchQuantity(
                          item.inventoryId._id,
                          e.target.value,
                        )
                      }
                      className="w-full border rounded-xl px-3 py-3 outline-none disabled:bg-gray-100 disabled:text-gray-500"
                    />
                  </div>
                </div>
              );
            })}
            <span className="whitespace-pre-line wrap-break text-2xl space-y-1">
              {requirement.remarks}
            </span>
          </div>
        </Card>

        {isDispatched || isReceived ? (
          <>
            <DispatchDetails requirement={requirement} />

            {isReceived && requirement.gatePass?.length > 0 && (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {requirement.gatePass.map((gatePass, index) => (
      <a
        key={gatePass.image || index}
        href={`${base_url}/uploads/requirements/${gatePass.image}`}
        download={gatePass.image}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src={`${base_url}/uploads/requirements/${gatePass.image}`}
          alt={`Gate Pass ${index + 1}`}
          className="w-full h-72 object-contain rounded-xl border cursor-pointer bg-gray-50"
        />
      </a>
    ))}
  </div>
)}
          </>
        ) : (
          <>
            <Card>
              <h3 className="text-lg font-semibold mb-4">Vehicle Details</h3>

              <label className="block text-sm mb-2">Registered Vehicle</label>

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

              <div className="my-5 text-center text-gray-500">OR</div>

              <input
                type="text"
                placeholder="Vehicle Number"
                value={manualVehicleNumber}
                onChange={(e) => setManualVehicleNumber(e.target.value)}
                className="w-full border rounded-xl px-3 py-3 mb-3"
              />
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4">Driver Details</h3>
              <select
                value={driverId}
                onChange={(e) => setDriverId(e.target.value)}
                className="w-full border rounded-xl px-3 py-3"
              >
                <option value="">Select Driver</option>

                {drivers

                  .filter((driver) => driver.isActive)

                  .map((driver) => (
                    <option key={driver._id} value={driver._id}>
                      {driver.name}

                      {" - "}

                      {driver.phone}
                    </option>
                  ))}
              </select>

              <div className="my-5 text-center text-gray-500">OR</div>
              <input
                type="text"
                placeholder="Driver Name"
                value={manualDriverName}
                onChange={(e) => setManualDriverName(e.target.value)}
                className="w-full border rounded-xl px-3 py-3 mb-3"
              />

              <input
                type="text"
                placeholder="Driver Phone Number"
                value={manualDriverPhone}
                onChange={(e) => setManualDriverPhone(e.target.value)}
                className="w-full border rounded-xl px-3 py-3"
              />
            </Card>
          </>
        )}

        <Card>
          <h3 className="text-lg font-semibold mb-4">Dispatch Remarks</h3>

          <textarea
            rows={4}
            disabled={isDispatched || isReceived}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Write dispatch remarks..."
            className="w-full border rounded-xl p-3 resize-none disabled:bg-gray-100 disabled:text-gray-500"
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

        {!isDispatched && !isReceived && (
          <Button className="w-full" onClick={handleSave}>
            {isDispatching ? "Dispatching...." : " Dispatch Requirement "}
          </Button>
        )}
      </div>
    );
  }
};

export default RequirementWorkspace;
