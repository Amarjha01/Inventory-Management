import ExcelJS from "exceljs";

export default async function createRequirementWorkbook(requirements) {
  const workbook = new ExcelJS.Workbook();

  const sheet = workbook.addWorksheet("Requirements");

  // ------------------------------------
  // Helpers
  // ------------------------------------

  const valueOrZero = (value) => {
    if (value === undefined || value === null || value === "") {
      return 0;
    }

    return value;
  };

  // ------------------------------------
  // Dynamic inventory columns
  // ------------------------------------

  const inventoryMap = new Map();

  requirements.forEach((requirement) => {
    requirement.items?.forEach((item) => {
      if (!item.inventoryId) return;

      inventoryMap.set(item.inventoryId._id.toString(), item.inventoryId.name);
    });
  });

  const inventoryColumns = [...inventoryMap.values()];

  // ------------------------------------
  // Columns
  // ------------------------------------

  const columns = [
    "Requirement No",
    "Kitchen",
    "District",
    "Date",
    ...inventoryColumns,
    "Vehicle",
    "Driver",
    "Created By",
    "Status",
  ];

  sheet.addRow(columns);

  // ------------------------------------
  // Add requirement rows
  // ------------------------------------

  requirements.forEach((requirement) => {
    const row = [];

    row.push(valueOrZero(requirement.requirementNumber));

    row.push(valueOrZero(requirement.kitchen?.name));

    row.push(valueOrZero(requirement.kitchen?.district));

    row.push(requirement.createdAt ? new Date(requirement.createdAt) : 0);

    // --------------------------------
    // Inventory quantities
    // --------------------------------

    inventoryColumns.forEach((column) => {
      const item = requirement.items?.find(
        (x) => x.inventoryId?.name === column,
      );

      row.push(valueOrZero(item?.dispatchedQuantity));
    });

    // --------------------------------
    // Dispatch information
    // --------------------------------

    row.push(valueOrZero(requirement.dispatch?.vehicle?.vehicleNumber));

    row.push(valueOrZero(requirement.dispatch?.driver?.name));

    row.push(valueOrZero(requirement.createdBy?.name));

    row.push(valueOrZero(requirement.status));

    sheet.addRow(row);
  });

  // ------------------------------------
  // Header styling
  // ------------------------------------

  const headerRow = sheet.getRow(1);

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

  // ------------------------------------
  // Style all cells
  // ------------------------------------

  sheet.eachRow((row, rowNumber) => {
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

    // Alternate row color
    if (rowNumber > 1 && rowNumber % 2 === 0) {
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
  });

  // ------------------------------------
  // Date formatting
  // ------------------------------------

  const dateColumnIndex = 4;

  sheet.getColumn(dateColumnIndex).eachCell((cell, rowNumber) => {
    if (rowNumber > 1 && cell.value !== 0) {
      cell.numFmt = "dd-mm-yyyy";
    }
  });

  // ------------------------------------
  // Column widths
  // ------------------------------------

  sheet.columns.forEach((column) => {
    let maxLength = 0;

    column.eachCell({ includeEmpty: true }, (cell) => {
      const value = cell.value;

      let length = 0;

      if (value instanceof Date) {
        length = 12;
      } else if (value !== null && value !== undefined) {
        length = String(value).length;
      }

      maxLength = Math.max(maxLength, length);
    });

    column.width = Math.min(Math.max(maxLength + 2, 12), 30);
  });

  // ------------------------------------
  // Freeze header
  // ------------------------------------

  sheet.views = [
    {
      state: "frozen",
      ySplit: 1,
    },
  ];

  // ------------------------------------
  // Auto filter
  // ------------------------------------

  sheet.autoFilter = {
    from: "A1",
    to: `${String.fromCharCode(64 + columns.length)}1`,
  };

  return workbook;
}
