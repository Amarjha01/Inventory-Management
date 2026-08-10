import ExcelJS from "exceljs";

export default async function createRequirementWorkbook(requirements){

    const workbook = new ExcelJS.Workbook();

    const sheet = workbook.addWorksheet("Requirements");

    //------------------------------------
    // Dynamic inventory columns
    //------------------------------------

    const inventoryMap = new Map();

    requirements.forEach(requirement=>{

        requirement.items.forEach(item=>{

            inventoryMap.set(

                item.inventoryId._id.toString(),

                item.inventoryId.name

            );

        });

    });

    const inventoryColumns=[...inventoryMap.values()];

    //------------------------------------

    const columns=[

        "Requirement No",

        "Kitchen",

        "District",

        "Date",

        ...inventoryColumns,

        "Vehicle",

        "Driver",

        "Created By",

        "Status"

    ];

    sheet.addRow(columns);

    //------------------------------------

    requirements.forEach(requirement=>{

        const row=[];

        row.push(requirement.requirementNumber);

        row.push(requirement.kitchen.name);

        row.push(requirement.kitchen.district);

        row.push(

            new Date(requirement.createdAt)

                .toLocaleDateString()

        );

        //--------------------------------

        inventoryColumns.forEach(column=>{

            const item=requirement.items.find(

                x=>x.inventoryId.name===column

            );

            row.push(

                item

                    ? item.dispatchedQuantity ?? ""

                    : ""

            );

        });

        //--------------------------------

        row.push(

            requirement.dispatch?.vehicle?.vehicleNumber || ""

        );

        row.push(

            requirement.dispatch?.driver?.name || ""

        );

        row.push(

            requirement.createdBy.name

        );

        row.push(

            requirement.status

        );

        sheet.addRow(row);

    });

    //------------------------------------

    sheet.getRow(1).font={

        bold:true,

    };

    sheet.columns.forEach(column=>{

        column.width=20;

    });

    return workbook;

}