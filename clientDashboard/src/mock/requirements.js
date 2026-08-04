const requirements = [
  {
    id: "REQ-1000",

    kitchen:{

    id:"KIT-001",

    name:"Vaishali Kitchen",

    district:"Vaishali , Bihar",

    address:"Mahnar"

},

    createdBy: "Rahul Kumar",

    createdAt: "03 Aug 2026 10:30 AM",

    status: "RECEIVED",

    remarks: "Need urgently",

    items: [
      {
        id: 1,
        name: "salt",
        hindiName: "नमक",
        image: "salt.avif",
        requestedQuantity: 50,
        dispatchedQuantity: 0,
        receivedQuantity: 0,
        unit: "Kg",
      },

      {
        id: 2,
        name: "Oil",
        hindiName: "तेल",
        image: "oil.avif",
        requestedQuantity: 20,
        dispatchedQuantity: 0,
        receivedQuantity: 0,
        unit: "Litre",
      },
    ],

    // vehicle: null,

    // Example when assigned
    vehicle: {
        number: "BR01AB1234",
        driverName: "Mukesh Kumar",
        driverPhone: "9876543210",
        dispatchedAt: "03 Aug 2026 03:15 PM",
    },

    timeline: [
      {
        status: "RECEIVED",
        time: "03 Aug 2026 10:30 AM",
      },
    ],

    receivingLetter: null,
  },
  {
    id: "REQ-1001",

    kitchen:{

    id:"KIT-001",

    name:"Vaishali Kitchen",

    district:"Vaishali , Bihar",

    address:"Mahnar"

},

    createdBy: "Rahul Kumar",

    createdAt: "04 Aug 2026 10:30 AM",

    status: "PACKING",

    remarks: "Need urgently",

    items: [
      {
        id: 1,
        name: "salt",
        hindiName: "नमक",
        image: "salt.avif",
        requestedQuantity: 50,
        dispatchedQuantity: 0,
        receivedQuantity: 0,
        unit: "Kg",
      },

      {
        id: 2,
        name: "Oil",
        hindiName: "तेल",
        image: "oil.avif",
        requestedQuantity: 20,
        dispatchedQuantity: 0,
        receivedQuantity: 0,
        unit: "Litre",
      },
    ],

    // vehicle: null,

    // Example when assigned
    vehicle: {
        number: "BR01AB1234",
        driverName: "Mukesh Kumar",
        driverPhone: "9876543210",
        dispatchedAt: "03 Aug 2026 03:15 PM",
    },

    timeline: [
      {
        status: "SUBMITTED",
        time: "03 Aug 2026 10:30 AM",
      },
      {
        status: "APPROVED",
        time: "03 Aug 2026 11:00 AM",
      },
      {
        status: "PACKING",
        time: "03 Aug 2026 11:30 AM",
      },
      {
        status: "PACKED",
        time: null,
      },
      {
        status: "OUT_FOR_DELIVERY",
        time: null,
      },
      {
        status: "DELIVERED",
        time: null,
      },
      {
        status: "RECEIVED",
        time: null,
      },
    ],

    receiving:{

    confirmed:false,

    confirmedAt:null,

    confirmedBy:null,

    letter:null

},
  },
];

export default requirements;