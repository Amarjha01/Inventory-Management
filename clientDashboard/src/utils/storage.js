// src/utils/storage.js

const NOTIFICATION_SETTINGS_KEY = "notificationSettings";

export const storage = {
  // User
  setUser: (user) =>
    localStorage.setItem("user", JSON.stringify(user)),

  getUser: () =>
    JSON.parse(localStorage.getItem("user") || "null"),


  // requirements
  setSubmittedRequirement:(requirement) =>
    localStorage.setItem("SubmittedRequirement", JSON.stringify(requirement)),
  setOutForDeliveryRequirement:(requirement) =>
    localStorage.setItem("OutForDeliveryRequirement", JSON.stringify(requirement)),
  setReceivedRequirement:(requirement) =>
    localStorage.setItem("ReceivedRequirement", JSON.stringify(requirement)),

  getSubmittedRequirement:()=>
    JSON.parse(localStorage.getItem("SubmittedRequirement") || "null"),
  getOutForDeliveryRequirement:()=>
    JSON.parse(localStorage.getItem("OutForDeliveryRequirement") || "null"),
  getReceivedRequirement:()=>
    JSON.parse(localStorage.getItem("ReceivedRequirement") || "null"),

// status
 setStats:(stat)=>
  localStorage.setItem("stat", JSON.stringify(stat)),
getStats:()=>
      JSON.parse(localStorage.getItem("stat") || "null"),

// Active tab
 setActiveTab:(tab)=>
  localStorage.setItem("activeTab", JSON.stringify(tab)),
getActiveTab:()=>
      JSON.parse(localStorage.getItem("activeTab") || "null"),
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