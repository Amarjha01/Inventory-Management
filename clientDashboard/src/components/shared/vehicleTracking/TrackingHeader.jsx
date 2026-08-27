const TrackingHeader = ({ vehicle }) => {
  return (
    <div className="relative z-10 bg-white p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-semibold">
            {vehicle.vehicleNo}
          </h1>

          <p className="text-sm text-gray-500">
            {vehicle.location.address}
          </p>
        </div>

        <span>
          {vehicle.movement.status}
        </span>
      </div>
    </div>
  );
};

export default TrackingHeader;