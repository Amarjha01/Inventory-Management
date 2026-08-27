import reportRepository from "../repositories/report.repository.js";
import createRequirementWorkbook from "../utils/excel/requirementReport.js";

class ReportService {
  /**
   * ==========================================================
   * BUILD DATE FILTER
   * ==========================================================
   */
  buildDateFilter(fromDate, toDate) {
    if (!fromDate || !toDate) {
      throw new Error(
        "From date and to date are required.",
      );
    }

    const start = new Date(fromDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(toDate);
    end.setHours(23, 59, 59, 999);

    return {
      createdAt: {
        $gte: start,
        $lte: end,
      },
    };
  }

  /**
   * ==========================================================
   * NORMALIZE ITEMS
   * ==========================================================
   */
  normalizeItems(items) {
    if (Array.isArray(items)) {
      return items.filter(Boolean).map(String);
    }

    if (items) {
      return [String(items)];
    }

    return [];
  }

  /**
   * ==========================================================
   * FILTER BY DISTRICT
   * ==========================================================
   */
  filterByDistrict(requirements, district) {
    if (!district) {
      return requirements;
    }

    const normalizedDistrict = district
      .toString()
      .trim()
      .toLowerCase();

    return requirements.filter((requirement) => {
      const requirementDistrict =
        requirement.kitchen?.district;

      return (
        requirementDistrict
          ?.toString()
          .trim()
          .toLowerCase() === normalizedDistrict
      );
    });
  }

  /**
   * ==========================================================
   * FILTER BY KITCHEN
   * ==========================================================
   */
  filterByKitchen(requirements, kitchen) {
    if (!kitchen) {
      return requirements;
    }

    const normalizedKitchen = kitchen
      .toString()
      .trim();

    return requirements.filter((requirement) => {
      const kitchenId =
        requirement.kitchen?._id?.toString();

      return kitchenId === normalizedKitchen;
    });
  }

  /**
   * ==========================================================
   * FILTER BY ITEMS
   * ==========================================================
   */
  filterByItems(requirements, selectedItems) {
    if (!selectedItems.length) {
      return requirements;
    }

    return requirements
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
          ) || [];

        if (!matchingItems.length) {
          return null;
        }

        return {
          ...requirement.toObject(),
          items: matchingItems,
        };
      })
      .filter(Boolean);
  }

  /**
   * ==========================================================
   * GET REPORT OPTIONS
   * ==========================================================
   *
   * Cascading:
   *
   * Date
   *   ↓
   * District
   *   ↓
   * Kitchen
   *   ↓
   * Items
   *
   * NOTE:
   * Options are not restricted by report status.
   *
   * This means all districts/kitchens/items existing
   * during the selected date range are available.
   */
  async getRequirementReportOptions(query) {
    const {
      fromDate,
      toDate,
      district,
      kitchen,
    } = query;

    const dateFilter =
      this.buildDateFilter(
        fromDate,
        toDate,
      );

    const requirements =
      await reportRepository.getRequirements(
        dateFilter,
      );

    /**
     * --------------------------------------------------------
     * DISTRICT FILTER
     * --------------------------------------------------------
     */
    let filteredRequirements =
      this.filterByDistrict(
        requirements,
        district,
      );

    /**
     * --------------------------------------------------------
     * KITCHEN FILTER
     * --------------------------------------------------------
     */
    filteredRequirements =
      this.filterByKitchen(
        filteredRequirements,
        kitchen,
      );

    /**
     * --------------------------------------------------------
     * DISTRICTS
     * --------------------------------------------------------
     *
     * Districts should always come from the original
     * date-filtered requirements.
     */
    const districtsMap = new Map();

    requirements.forEach((requirement) => {
      const districtName =
        requirement.kitchen?.district;

      if (!districtName) {
        return;
      }

      const name =
        districtName.toString().trim();

      const key = name.toLowerCase();

      if (!districtsMap.has(key)) {
        districtsMap.set(key, {
          _id: name,
          name,
        });
      }
    });

    /**
     * --------------------------------------------------------
     * KITCHENS
     * --------------------------------------------------------
     *
     * Kitchens are based on selected district.
     */
    const kitchensMap = new Map();

    filteredRequirements.forEach(
      (requirement) => {
        const kitchenData =
          requirement.kitchen;

        if (!kitchenData?._id) {
          return;
        }

        const kitchenId =
          kitchenData._id.toString();

        if (!kitchensMap.has(kitchenId)) {
          kitchensMap.set(kitchenId, {
            _id: kitchenData._id,
            name: kitchenData.name,
            district:
              kitchenData.district,
          });
        }
      },
    );

    /**
     * --------------------------------------------------------
     * ITEMS
     * --------------------------------------------------------
     *
     * Items are based on selected district/kitchen.
     */
    const itemsMap = new Map();

    filteredRequirements.forEach(
      (requirement) => {
        requirement.items?.forEach(
          (requirementItem) => {
            const inventory =
              requirementItem.inventoryId;

            if (!inventory?._id) {
              return;
            }

            const inventoryId =
              inventory._id.toString();

            if (!itemsMap.has(inventoryId)) {
              itemsMap.set(inventoryId, {
                _id: inventory._id,
                name: inventory.name,
                unit: requirementItem.unit,
              });
            }
          },
        );
      },
    );

    return {
      districts: [
        ...districtsMap.values(),
      ],

      kitchens: [
        ...kitchensMap.values(),
      ],

      items: [
        ...itemsMap.values(),
      ],
    };
  }

  /**
   * ==========================================================
   * DOWNLOAD REQUIREMENT REPORT
   * ==========================================================
   *
   * STATUS BEHAVIOUR
   *
   * All Status:
   *   Submitted
   *   Out For Delivery
   *   Received
   *
   *   Quantity = item.quantity
   *
   * Requested:
   *   Submitted ONLY
   *
   *   Quantity = item.quantity
   *
   * Dispatched:
   *   Out For Delivery
   *   Received
   *
   *   Quantity = item.dispatchedQuantity
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

    console.log(
      "Download requirement report query:",
      query,
    );

    /**
     * ========================================================
     * DATE FILTER
     * ========================================================
     */
    let filter;

    if (dateType === "range") {
      filter = this.buildDateFilter(
        fromDate,
        toDate,
      );
    } else {
      const selectedDate =
        date || fromDate;

      if (!selectedDate) {
        throw new Error(
          "Date is required.",
        );
      }

      filter = this.buildDateFilter(
        selectedDate,
        selectedDate,
      );
    }

    /**
     * ========================================================
     * KITCHEN FILTER
     * ========================================================
     */
    if (kitchen) {
      filter.kitchen = kitchen;
    }

    /**
     * ========================================================
     * STATUS FILTER
     * ========================================================
     *
     * IMPORTANT
     *
     * Frontend status:
     *
     * ""
     * requested
     * dispatched
     *
     * Database status:
     *
     * Submitted
     * Out For Delivery
     * Received
     *
     * Therefore we translate frontend status
     * into database status here.
     */

    if (status === "requested") {
      /**
       * Requested report:
       *
       * Submitted ONLY
       */
      filter.status = {
        $in: [
          "Submitted",
          "Out For Delivery",
          "Received",
        ],
      };
    }

    if (status === "dispatched") {
      /**
       * Dispatched report:
       *
       * Out For Delivery OR Received
       */
      filter.status = {
        $in: [
          "Out For Delivery",
          "Received",
        ],
      };
    }

    /**
     * ========================================================
     * ALL STATUS
     * ========================================================
     *
     * When status is empty:
     *
     * DO NOT add a status filter.
     *
     * MongoDB will therefore return:
     *
     * Submitted
     * Out For Delivery
     * Received
     *
     * and any other requirement status that exists.
     *
     * The Excel generator will use item.quantity.
     */
    if (!status) {
      // No status filter.
    }

    /**
     * ========================================================
     * GET REQUIREMENTS
     * ========================================================
     */
    const requirements =
      await reportRepository.getRequirements(
        filter,
      );

    console.log(
      "Requirements found:",
      requirements.length,
    );

    /**
     * ========================================================
     * DISTRICT FILTER
     * ========================================================
     */
    let filteredRequirements =
      this.filterByDistrict(
        requirements,
        district,
      );

    /**
     * ========================================================
     * ITEM FILTER
     * ========================================================
     */
    const selectedItems =
      this.normalizeItems(items);

    filteredRequirements =
      this.filterByItems(
        filteredRequirements,
        selectedItems,
      );

    console.log(
      "Selected items:",
      selectedItems,
    );

    console.log(
      "Filtered requirements:",
      filteredRequirements.length,
    );

    /**
     * ========================================================
     * GENERATE EXCEL
     * ========================================================
     */
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
}

export default new ReportService();
