self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});


self.addEventListener("push", (event) => {
  console.log("[SW] 🔔 Push received", event);

  let data = {};

  // -----------------------------
  // Parse push data
  // -----------------------------
  if (event.data) {
    try {
      data = event.data.json();

      console.log("[SW] ✅ Parsed push data:", data);
    } catch (error) {
      console.error("[SW] ❌ JSON parsing failed:", error);

      const text = event.data.text();

      data = {
        title: "ESF",
        body: text,
      };
    }
  }

  console.log("[SW] Title:", data.title);
  console.log("[SW] Body:", data.body);
  console.log("[SW] Data:", data.data);

  // -----------------------------
  // Notification information
  // -----------------------------
  const title = data.title || "ESF";

  const notificationData = data.data || {};

  const options = {
    body: data.body || "You have a new notification.",

    // App icon
    icon: "/ESF_Logo.png",

    // Small notification/status-bar icon
    badge: "/ESF_Logo.png",

    // Notification vibration
    vibrate: [100, 50, 100],

    // Store custom data for notificationclick
    data: notificationData,

    // Prevent unlimited duplicate notifications
    tag: notificationData.type || "esf-notification",

    // Show again even if same tag exists
    renotify: true,

    // Timestamp
    timestamp: Date.now(),

    // Notification actions
    actions: [
      {
        action: "view",
        title: "View",
      },
      {
        action: "close",
        title: "Dismiss",
      },
    ],
  };

  console.log("[SW] 📢 Showing notification:", {
    title,
    options,
  });

  // -----------------------------
  // Display notification
  // -----------------------------
  event.waitUntil(
    self.registration
      .showNotification(title, options)
      .then(() => {
        console.log("[SW] ✅ Notification displayed");
      })
      .catch((error) => {
        console.error("[SW] ❌ showNotification failed:", error);
      })
  );
});


// ======================================================
// Notification Click
// ======================================================

self.addEventListener("notificationclick", (event) => {
  console.log("[SW] 🖱️ Notification clicked:", event.action);

  const notification = event.notification;

  notification.close();

  // -----------------------------
  // Dismiss button
  // -----------------------------
  if (event.action === "close") {
    console.log("[SW] Notification dismissed");
    return;
  }

  // -----------------------------
  // Get URL from notification
  // -----------------------------
  const url = notification.data?.url || "/";

  console.log("[SW] Opening URL:", url);

  event.waitUntil(
    clients.matchAll({
      type: "window",
      includeUncontrolled: true,
    }).then((clientList) => {

      // Try to find an existing application tab
      for (const client of clientList) {

        if ("focus" in client) {
          console.log("[SW] Existing client found");

          return client
            .focus()
            .then(() => {
              if ("navigate" in client) {
                return client.navigate(url);
              }
            });
        }
      }

      // No existing tab → open a new one
      if (clients.openWindow) {
        console.log("[SW] Opening new window");

        return clients.openWindow(url);
      }
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const data = event.notification.data || {};

  // Your backend sends { data: { url: "/" } }
  // so this is correct.
  const url = data.url || "/";

  event.waitUntil(
    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then((clientList) => {
        for (const client of clientList) {
          if ("focus" in client) {
            client.navigate(url);
            return client.focus();
          }
        }

        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      }),
  );
});
