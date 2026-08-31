import ExcelJS from "exceljs";

export default async function createRequirementWorkbook(
  requirements,
  filters = {},
) {
  const workbook = new ExcelJS.Workbook();

  const sheet =
    workbook.addWorksheet("Requirements");

  const {
    status = "",
  } = filters;

  /**
   * ==========================================================
   * HELPERS
   * ==========================================================
   */

  const valueOrZero = (value) => {
    if (
      value === undefined ||
      value === null ||
      value === ""
    ) {
      return 0;
    }

    return value;
  };

  const getId = (value) => {
    if (!value) {
      return null;
    }

    if (
      typeof value === "object" &&
      value._id
    ) {
      return value._id.toString();
    }

    return value.toString();
  };

  const getItemName = (item) => {
    if (!item?.inventoryId) {
      return null;
    }

    if (
      typeof item.inventoryId === "object" &&
      item.inventoryId.name
    ) {
      return item.inventoryId.name;
    }

    return null;
  };

  /**
   * ==========================================================
   * QUANTITY
   * ==========================================================
   *
   * requested:
   *     item.quantity
   *
   * dispatched:
   *     item.dispatchedQuantity
   *
   * all:
   *     item.quantity
   *
   * Example:
   *
   * quantity = 500
   * dispatchedQuantity = 255
   *
   * All Status  -> 500
   * Requested   -> 500
   * Dispatched  -> 255
   */
  const getQuantity = (item) => {
    if (!item) {
      return 0;
    }

    if (status === "dispatched") {
      return item.dispatchedQuantity ?? 0;
    }

    /**
     * requested OR all status
     */
    return item.quantity ?? 0;
  };

  /**
   * ==========================================================
   * INVENTORY COLUMNS
   * ==========================================================
   */
  const inventoryMap = new Map();

  requirements.forEach((requirement) => {
    requirement.items?.forEach(
      (item) => {
        const inventoryId =
          getId(item.inventoryId);

        const inventoryName =
          getItemName(item);

        if (
          !inventoryId ||
          !inventoryName
        ) {
          return;
        }

        inventoryMap.set(
          inventoryId,
          inventoryName,
        );
      },
    );
  });

  const inventoryColumns = [
    ...inventoryMap.entries(),
  ];

  /**
   * ==========================================================
   * COLUMNS
   * ==========================================================
   */
  const columns = [
    "Requirement No",
    "Kitchen",
    "District",
    "Date",

    ...inventoryColumns.map(
      ([, name]) => name,
    ),

    "Vehicle",
    "Driver",
    "Created By",
    "Status",
  ];

  sheet.addRow(columns);

  /**
   * ==========================================================
   * ROWS
   * ==========================================================
   */
  requirements.forEach((requirement) => {
    const row = [];

    row.push(
      valueOrZero(
        requirement.requirementNumber,
      ),
    );

    row.push(
      valueOrZero(
        requirement.kitchen?.name,
      ),
    );

    row.push(
      valueOrZero(
        requirement.kitchen?.district,
      ),
    );

    row.push(
      requirement.createdAt
        ? new Date(requirement.createdAt)
        : 0,
    );

    /**
     * --------------------------------------------------------
     * ITEM QUANTITIES
     * --------------------------------------------------------
     */
    inventoryColumns.forEach(
      ([inventoryId]) => {
        const item =
          requirement.items?.find(
            (requirementItem) =>
              getId(
                requirementItem.inventoryId,
              ) === inventoryId,
          );

        row.push(
          getQuantity(item),
        );
      },
    );

    /**
     * --------------------------------------------------------
     * DISPATCH
     * --------------------------------------------------------
     */
    row.push(
      valueOrZero(
        requirement.dispatch?.vehicle
          ?.vehicleNumber,
      ),
    );

    row.push(
      valueOrZero(
        requirement.dispatch?.driver?.name,
      ),
    );

    row.push(
      valueOrZero(
        requirement.createdBy?.name,
      ),
    );

    row.push(
      valueOrZero(
        requirement.status,
      ),
    );

    sheet.addRow(row);
  });

  /**
   * ==========================================================
   * HEADER STYLING
   * ==========================================================
   */
  const headerRow =
    sheet.getRow(1);

  headerRow.font = {
    bold: true,
    color: {
      argb: "FFFFFF",
    },
  };

  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: {
      argb: "1F4E78",
    },
  };

  headerRow.alignment = {
    horizontal: "center",
    vertical: "middle",
    wrapText: true,
  };

  headerRow.height = 30;

  /**
   * ==========================================================
   * CELL STYLING
   * ==========================================================
   */
  sheet.eachRow(
    (row, rowNumber) => {
      row.eachCell((cell) => {
        cell.alignment = {
          horizontal: "center",
          vertical: "middle",
          wrapText: true,
        };

        cell.border = {
          top: {
            style: "thin",
            color: {
              argb: "D9E1F2",
            },
          },
          left: {
            style: "thin",
            color: {
              argb: "D9E1F2",
            },
          },
          bottom: {
            style: "thin",
            color: {
              argb: "D9E1F2",
            },
          },
          right: {
            style: "thin",
            color: {
              argb: "D9E1F2",
            },
          },
        };
      });

      if (
        rowNumber > 1 &&
        rowNumber % 2 === 0
      ) {
        row.eachCell((cell) => {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: {
              argb: "F5F9FC",
            },
          };
        });
      }
    },
  );

  /**
   * ==========================================================
   * DATE FORMAT
   * ==========================================================
   */
  sheet
    .getColumn(4)
    .eachCell(
      (cell, rowNumber) => {
        if (
          rowNumber > 1 &&
          cell.value !== 0
        ) {
          cell.numFmt =
            "dd-mm-yyyy";
        }
      },
    );

  /**
   * ==========================================================
   * COLUMN WIDTHS
   * ==========================================================
   */
  sheet.columns.forEach(
    (column) => {
      let maxLength = 0;

      column.eachCell(
        {
          includeEmpty: true,
        },
        (cell) => {
          const value =
            cell.value;

          let length = 0;

          if (
            value instanceof Date
          ) {
            length = 12;
          } else if (
            value !== null &&
            value !== undefined
          ) {
            length =
              String(value).length;
          }

          maxLength = Math.max(
            maxLength,
            length,
          );
        },
      );

      column.width = Math.min(
        Math.max(
          maxLength + 2,
          12,
        ),
        30,
      );
    },
  );

  /**
   * ==========================================================
   * FREEZE HEADER
   * ==========================================================
   */
  sheet.views = [
    {
      state: "frozen",
      ySplit: 1,
    },
  ];

  /**
   * ==========================================================
   * AUTO FILTER
   * ==========================================================
   */
  const getExcelColumnName = (
    columnNumber,
  ) => {
    let result = "";

    while (columnNumber > 0) {
      const remainder =
        (columnNumber - 1) % 26;

      result =
        String.fromCharCode(
          65 + remainder,
        ) + result;

      columnNumber = Math.floor(
        (columnNumber - 1) / 26,
      );
    }

    return result;
  };

  const lastColumn =
    getExcelColumnName(
      columns.length,
    );

  sheet.autoFilter = {
    from: "A1",
    to: `${lastColumn}1`,
  };

  return workbook;
}
