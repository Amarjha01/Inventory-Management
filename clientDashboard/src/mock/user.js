// const user = {
//   id: 1,
//   name: "Rahul Kumar",
//   phone: "9876543210",
//   password: "123456",
//   role: "Kitchen Incharge",
//   kitchen: {
//     id: 1,
//     name: "Vaishali Kitchen",
//     address: "Mahnar, Vaishali, Bihar",
//   },
//   language: "en",
// };

// export default user;

const users = [
  {
    id: 1,
    name: "Rahul Kumar",
    phone: "9876543210",
    password: "123456",
    role: "Kitchen Incharge",
    kitchen: {
      id: 1,
      name: "Vaishali Kitchen",
      address: "Mahnar, Vaishali, Bihar",
    },
    language: "en",
  },

  {
    id: 2,
    name: "Ajay Kumar",
    phone: "9876543211",
    password: "123456",
    role: "Store Incharge",
    kitchen: {
      id: 1,
      name: "Vaishali Kitchen",
      address: "Mahnar, Vaishali, Bihar",
    },
    language: "en",
  },

  {
    id: 3,
    name: "Ravi Singh",
    phone: "9876543212",
    password: "123456",
    role: "Store Supervisor",
    kitchen: null,
    language: "en",
  },

  {
    id: 4,
    name: "Admin",
    phone: "9876543213",
    password: "123456",
    role: "Admin",
    kitchen: null,
    language: "en",
  },
];

export default users;