export const storage = {

  setUser: (user) =>
    localStorage.setItem("user", JSON.stringify(user)),

  getUser: () =>
    JSON.parse(localStorage.getItem("user") || "null"),

  logout: () => {
    localStorage.clear();
  },
};

