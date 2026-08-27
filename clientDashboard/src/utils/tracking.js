export const getVehiclePosition = (vehicle) => {
  if (!vehicle?.location) {
    return null;
  }

  return [
    vehicle.location.latitude,
    vehicle.location.longitude,
  ];
};

export const getVehicleHeading = (vehicle) => {
  return vehicle?.location?.heading ?? 0;
};

export const isVehicleMoving = (vehicle) => {
  return vehicle?.movement?.speed > 0;
};