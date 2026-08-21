import reportRepository from "../repositories/report.repository.js";

import createRequirementWorkbook from "../utils/excel/requirementReport.js";

class ReportService {
  /**
   * Get requirements and generate Excel report
   */
 async downloadRequirementReport(query) {
  const {
    date,
    fromDate,
    toDate,
    dateType,
    kitchen,
    items,
    district,
    status,
  } = query;

  console.log("query:", query);

  const filter = {};

  // ------------------------------------
  // Date filter
  // ------------------------------------

  if (dateType === "range") {
    if (!fromDate || !toDate) {
      throw new Error(
        "From date and to date are required for date range.",
      );
    }

    const start = new Date(fromDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(toDate);
    end.setHours(23, 59, 59, 999);

    filter.createdAt = {
      $gte: start,
      $lte: end,
    };
  } else {
    const selectedDate = date || fromDate;

    if (selectedDate) {
      const start = new Date(selectedDate);
      start.setHours(0, 0, 0, 0);

      const end = new Date(selectedDate);
      end.setHours(23, 59, 59, 999);

      filter.createdAt = {
        $gte: start,
        $lte: end,
      };
    }
  }

  // ------------------------------------
  // Kitchen
  // ------------------------------------

  if (kitchen) {
    filter.kitchen = kitchen;
  }

  // ------------------------------------
  // Status
  // ------------------------------------

  if (status) {
    filter.status = status;
  }

  // ------------------------------------
  // Get requirements
  // ------------------------------------

  const requirements =
    await reportRepository.getRequirements(filter);

  let filteredRequirements = requirements;

  // ------------------------------------
  // District filter
  // ------------------------------------

  if (district) {
    filteredRequirements =
      filteredRequirements.filter((requirement) => {
        const requirementDistrict =
          requirement.kitchen?.district;

        return (
          requirementDistrict
            ?.toString()
            .toLowerCase() ===
          district.toString().toLowerCase()
        );
      });
  }

  // ------------------------------------
  // Item filter
  // ------------------------------------

  const selectedItems = Array.isArray(items)
    ? items.filter(Boolean)
    : items
      ? [items]
      : [];

  console.log(
    "items:",
    items,
    "selectedItems:",
    selectedItems,
  );

  if (selectedItems.length > 0) {
    filteredRequirements =
      filteredRequirements
        .map((requirement) => {
          const matchingItems =
            requirement.items?.filter(
              (requirementItem) => {
                const inventoryId =
                  requirementItem.inventoryId?._id ||
                  requirementItem.inventoryId;

                return selectedItems.includes(
                  inventoryId?.toString(),
                );
              },
            );

          if (!matchingItems?.length) {
            return null;
          }

          return {
            ...requirement.toObject(),
            items: matchingItems,
          };
        })
        .filter(Boolean);
  }

  // ------------------------------------
  // Generate workbook
  // ------------------------------------

  console.log(
    "filteredRequirements:",
    filteredRequirements,
  );

  return createRequirementWorkbook(
    filteredRequirements,
    {
      status,
      district,
      kitchen,
      items: selectedItems,
      dateType,
      fromDate,
      toDate,
      date,
    },
  );
}



  async getRequirementReportOptions(query) {
  const { fromDate, toDate } = query;

  if (!fromDate || !toDate) {
    throw new Error(
      "From date and to date are required.",
    );
  }

  const start = new Date(fromDate);

  start.setHours(0, 0, 0, 0);

  const end = new Date(toDate);

  end.setHours(23, 59, 59, 999);

  const requirements =
    await reportRepository.getRequirements({
      createdAt: {
        $gte: start,
        $lte: end,
      },
    });

  const kitchensMap = new Map();
  const itemsMap = new Map();
  const districtsMap = new Map();

  requirements.forEach((requirement) => {
    // Kitchen
    if (requirement.kitchen?._id) {
      kitchensMap.set(
        requirement.kitchen._id.toString(),
        {
          _id: requirement.kitchen._id,
          name: requirement.kitchen.name,
        },
      );
    }

    // District
    if (requirement.kitchen?.district) {
      const district =
        requirement.kitchen.district;

      districtsMap.set(
        district.toString(),
        {
          _id: district,
          name: district,
        },
      );
    }

    // Items
    requirement.items?.forEach((requirementItem) => {
      if (
        requirementItem.inventoryId?._id
      ) {
        itemsMap.set(
          requirementItem.inventoryId._id.toString(),
          {
            _id:
              requirementItem.inventoryId._id,
            name:
              requirementItem.inventoryId.name,
          },
        );
      }
    });
  });

  return {
    kitchens: [...kitchensMap.values()],
    items: [...itemsMap.values()],
    districts: [...districtsMap.values()],
  };
}

}

export default new ReportService();
