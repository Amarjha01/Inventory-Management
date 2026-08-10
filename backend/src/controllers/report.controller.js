import asyncHandler from "../utils/asyncHandler.js";

import reportService from "../services/report.service.js";

export const downloadRequirementReport = asyncHandler(

    async (req, res) => {

        const workbook = await reportService.downloadRequirementReport(

            req.query

        );

        res.setHeader(

            "Content-Type",

            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

        );

        res.setHeader(

            "Content-Disposition",

            `attachment; filename=requirements-${Date.now()}.xlsx`

        );

        await workbook.xlsx.write(res);

        res.end();

    }

);