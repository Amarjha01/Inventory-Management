export const storage = {
  setToken: (token) => localStorage.setItem("token", token),

  getToken: () => localStorage.getItem("token"),

  removeToken: () => localStorage.removeItem("token"),

  setUser: (user) =>
    localStorage.setItem("user", JSON.stringify(user)),

  getUser: () =>
    JSON.parse(localStorage.getItem("user") || "null"),

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};