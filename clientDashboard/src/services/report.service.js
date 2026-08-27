import api from "../api/axios";

export const getRequirementReportOptions = async ({
  fromDate,
  toDate,
  district = "",
  kitchen = "",
}) => {
  const response = await api.get(
    "/reports/requirements/report-options",
    {
      params: {
        fromDate,
        toDate,
        district,
        kitchen,
      },
    },
  );

  return response.data;
};

export const downloadRequirementReport = async (
  filters,
) => {
  const response = await api.get(
    "/reports/requirements/report",
    {
      params: filters,

      paramsSerializer: {
        indexes: null,
      },

      responseType: "blob",
    },
  );

  return response.data;
};
