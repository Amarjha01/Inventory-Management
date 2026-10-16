import ExcelJS from "exceljs";

const ExportExcel = async (type , records) => {
  console.log(type , records);
  
  if (!Array.isArray(records) || records.length === 0) {
    alert("No records available to export.");
    return;
  }
  const formatDate = (value) => {
    if (!value) return "";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    });
  };

  const workbook = new ExcelJS.Workbook();
  let worksheet

  switch (type) {
    case "service":
      worksheet = workbook.addWorksheet("Service Records");

      worksheet.columns = [
        { header: "Kitchen Name", key: "kitchenName", width: 22 },
        { header: "User Name", key: "userName", width: 22 },
        { header: "Part Name", key: "partName", width: 18 },
        { header: "Party Name", key: "partyName", width: 32 },
        { header: "Service Date", key: "serviceDate", width: 22 },
        { header: "Next Service Date", key: "nextServiceDate", width: 24 },
        { header: "Narration", key: "narration", width: 35 },
        { header: "Created At", key: "createdAt", width: 22 },
        { header: "Updated At", key: "updatedAt", width: 22 },
      ];

      records.forEach((record) => {
        worksheet.addRow({
          kitchenName: record.kitchenId?.name ?? "",
          userName: record.userId?.name ?? "",
          partName: record.service?.partName ?? "",
          partyName: record.service?.partyName ?? "",
          serviceDate: formatDate(record.service?.serviceDate),
          nextServiceDate: formatDate(record.service?.nextServiceDate),
          narration: record.service?.narration ?? "",
          createdAt: formatDate(record.createdAt),
          updatedAt: formatDate(record.updatedAt),
        });
      });
      break;

    case "complain-repair":
      worksheet = workbook.addWorksheet("complain-repair");

      worksheet.columns = [
        { header: "Kitchen Name", key: "kitchenName", width: 20 },
        { header: "User Name", key: "userName", width: 22 },
        { header: "Visitor Name", key: "visitorName", width: 22 },
        { header: "Phone Number", key: "phoneNumber", width: 18 },
        { header: "Reason", key: "reason", width: 18 },
        { header: "Problem Date", key: "problemDate", width: 18 },
        { header: "Status", key: "status", width: 16 },
        { header: "Narration", key: "narration", width: 30 },
        { header: "Feedback History", key: "feedbackHistory", width: 45 },
        { header: "Created At", key: "createdAt", width: 22 },
        { header: "Updated At", key: "updatedAt", width: 22 },
      ];

      records.forEach((record) => {
        const visitor = record.visitor ?? {};
        const feedbackTrail = visitor.feedbackTrail ?? [];

        // Combine all feedback messages into one readable cell
        const feedbackHistory = feedbackTrail
          .map((feedback) => {
            const date = formatDate(feedback.createdAt);
            const sender = feedback.sentBy?.name ?? "Unknown";
            const message = feedback.message ?? "";

            return `[${date}] ${sender}: ${message}`;
          })
          .join("\n\n");

        worksheet.addRow({
          kitchenName: record.kitchenId?.name ?? "",
          userName: record.userId?.name ?? "",
          visitorName: visitor.visitorName ?? "",
          phoneNumber: visitor.phoneNumber ?? "",
          reason: visitor.reason ?? "",
          problemDate: formatDate(visitor.problemDate),
          status: visitor.status ?? "",
          narration: visitor.narration ?? "",
          feedbackHistory,
          createdAt: formatDate(record.createdAt),
          updatedAt: formatDate(record.updatedAt),
        });
      });

      break;
      case "purchase":
        worksheet = workbook.addWorksheet("Purchase Report");

  worksheet.columns = [
    { header: "Kitchen Name", key: "kitchenName", width: 22 },
    { header: "User Name", key: "userName", width: 22 },
    { header: "Company Name", key: "companyName", width: 22 },
    { header: "Part Name", key: "partName", width: 22 },
    { header: "Party Name", key: "partyName", width: 25 },
    { header: "Quantity", key: "quantity", width: 12 },
    { header: "Purchase Date", key: "purchaseDate", width: 20 },
    { header: "Received Date", key: "receivedDate", width: 20 },
    {
      header: "Expiry Warranty Year",
      key: "expiryWarrantyYear",
      width: 22,
    },
    { header: "Created At", key: "createdAt", width: 22 },
    { header: "Updated At", key: "updatedAt", width: 22 },
  ];

  records.forEach((record) => {
    const purchase = record.purchaseRecord ?? {};

    worksheet.addRow({
      kitchenName: record.kitchenId?.name ?? "",
      userName: record.userId?.name ?? "",
      companyName: purchase.companyName ?? "",
      partName: purchase.partName ?? "",
      partyName: purchase.partyName ?? "",
      quantity: purchase.quantity ?? "",
      purchaseDate: formatDate(purchase.purchaseDate),
      receivedDate: formatDate(purchase.ReceivedDate),
      expiryWarrantyYear: purchase.expiryWarrantyYear ?? "",
      createdAt: formatDate(record.createdAt),
      updatedAt: formatDate(record.updatedAt),
    });
  });
  break
    default:
      break;
  }

  // Style the header row
  const header = worksheet.getRow(1);

  header.height = 32;

  header.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1F2937" },
    };

    cell.font = {
      name: "Arial",
      size: 11,
      bold: true,
      color: { argb: "FFFFFFFF" },
    };

    cell.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };

    cell.border = {
      bottom: {
        style: "medium",
        color: { argb: "FF0D9488" },
      },
    };
  });

  // Style data rows
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;

    row.height = 24;

    row.eachCell({ includeEmpty: true }, (cell) => {
      cell.font = {
        name: "Arial",
        size: 10,
        color: { argb: "FF374151" },
      };

      cell.alignment = {
        vertical: "middle",
        wrapText: true,
      };

      cell.border = {
        bottom: {
          style: "thin",
          color: { argb: "FFE5E7EB" },
        },
      };

      if (rowNumber % 2 === 0) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFF3F4F6" },
        };
      }
    });
  });

  // Enable column filters and keep the header visible
  worksheet.autoFilter = {
  from: {
    row: 1,
    column: 1,
  },
  to: {
    row: worksheet.rowCount,
    column: worksheet.columnCount,
  },
};

  worksheet.views = [{ state: "frozen", ySplit: 1 }];

  // Generate and download the Excel file
  const buffer = await workbook.xlsx.writeBuffer();

  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `${type}-records.xlsx`;
  link.click();

  URL.revokeObjectURL(url);
};

export default ExportExcel;
