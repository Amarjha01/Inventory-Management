// src/utils/storage.js

const NOTIFICATION_SETTINGS_KEY = "notificationSettings";

export const storage = {
  // User
  setUser: (user) =>
    localStorage.setItem("user", JSON.stringify(user)),

  getUser: () =>
    JSON.parse(localStorage.getItem("user") || "null"),

  // Notifications
  setNotificationSettings: (settings) =>
    localStorage.setItem(
      NOTIFICATION_SETTINGS_KEY,
      JSON.stringify(settings)
    ),

  getNotificationSettings: () =>
    JSON.parse(
      localStorage.getItem(NOTIFICATION_SETTINGS_KEY) ||
        '{"enabled":false}'
    ),

  clearNotificationSettings: () =>
    localStorage.removeItem(NOTIFICATION_SETTINGS_KEY),

  // Logout
  logout: () => {
    localStorage.removeItem("user");
  },
};