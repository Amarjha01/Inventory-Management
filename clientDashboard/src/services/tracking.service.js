import api from "../api/axios";

const getLiveLocationByVehicle = async (requirementId) => {
  const response = await api.get(
    `/tracking/live-by-vehicle?id=${requirementId}`
  );

  return response.data;
};

export default getLiveLocationByVehicle;