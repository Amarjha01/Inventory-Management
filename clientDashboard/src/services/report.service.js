import api from "../api/axios";

export const downloadRequirementReport = async (params) => {
  const response = await api.get(
    "/reports/requirements",

    {
      params,

      responseType: "blob",
    },
  );

  return response.data;
};
