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


// Inventory
  setInventory: (type, items) => {
    try {
      const existingInventory = JSON.parse(
        localStorage.getItem(type) || "{}"
      );

      existingInventory[type] = items;

      localStorage.setItem(
        type,
        JSON.stringify(existingInventory)
      );
    } catch (error) {
      console.error("Failed to save inventory:", error);
    }
  },

  getInventory: (type) => {
    try {
      const inventory = JSON.parse(
        localStorage.getItem(type) || "{}"
      );

      return inventory[type] || null;
    } catch (error) {
      console.error("Failed to get inventory:", error);
      return null;
    }
  },

  clearInventory: (type) => {
    try {
      const inventory = JSON.parse(
        localStorage.getItem(type) || "{}"
      );

      if (type) {
        delete inventory[type];
      } else {
        Object.keys(inventory).forEach((key) => {
          delete inventory[key];
        });
      }

      localStorage.setItem(
        type,
        JSON.stringify(inventory)
      );
    } catch (error) {
      console.error("Failed to clear inventory:", error);
    }
  },


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