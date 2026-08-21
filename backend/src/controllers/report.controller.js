import asyncHandler from "../utils/asyncHandler.js";

import reportService from "../services/report.service.js";

export const getRequirementReportOptions =
  asyncHandler(async (req, res) => {
    const data =
      await reportService.getRequirementReportOptions(
        req.query,
      );

    res.status(200).json(data);
  });




export const downloadRequirementReport = asyncHandler(async (req, res) => {
  const workbook = await reportService.downloadRequirementReport(req.query);

  const filename = `requirements-${Date.now()}.xlsx`;

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );

  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

  await workbook.xlsx.write(res);

  res.end();
});
