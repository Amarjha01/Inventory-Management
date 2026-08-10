import reportRepository from "../repositories/report.repository.js";

import createRequirementWorkbook from "../utils/excel/requirementReport.js";

class ReportService {

    async downloadRequirementReport(query) {

        const filter = {};

        if (query.date) {

            const start = new Date(query.date);

            start.setHours(0,0,0,0);

            const end = new Date(query.date);

            end.setHours(23,59,59,999);

            filter.createdAt = {

                $gte: start,

                $lte: end,

            };

        }

        if (query.kitchen) {

            filter.kitchen = query.kitchen;

        }

        if (query.status) {

            filter.status = query.status;

        }

        const requirements = await reportRepository.getRequirements(filter);

        return createRequirementWorkbook(requirements);

    }

}

export default new ReportService();