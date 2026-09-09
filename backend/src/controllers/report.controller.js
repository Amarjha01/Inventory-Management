import asyncHandler from "../utils/asyncHandler.js";

import reportService from "../services/report.service.js";

// --------------------------------------------------
// Report Options
// --------------------------------------------------

export const getRequirementReportOptions =
  asyncHandler(async (req, res) => {
    console.log(
      "Requirement report options query:",
      req.query,
    );

    const data =
      await reportService.getRequirementReportOptions(
        req.query,
      );

    res.status(200).json(data);
  });

// --------------------------------------------------
// View Report
// --------------------------------------------------

export const viewRequirementReport =
  asyncHandler(async (req, res) => {
    console.log(
      "View requirement report query:",
      req.query,
    );

    const data =
      await reportService.getRequirementReport(
        req.query,
      );

    res.status(200).json({
      success: true,
      data,
    });
  });

// --------------------------------------------------
// Download Report
// --------------------------------------------------

export const downloadRequirementReport =
  asyncHandler(async (req, res) => {
    console.log(
      "Requirement report query:",
      req.query,
    );

    const workbook =
      await reportService.downloadRequirementReport(
        req.query,
      );

    let statusName = "all-status";

    if (req.query.status === "requested") {
      statusName = "requested";
    }

    if (req.query.status === "dispatched") {
      statusName = "dispatched";
    }

    const filename =
      `${statusName}-requirements-${Date.now()}.xlsx`;

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename}"`,
    );

    await workbook.xlsx.write(res);

    res.end();
  });

  