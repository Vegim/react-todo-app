// Service worker for Todo Reminder push notifications
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

// Handle push events sent from a push server (future use)
self.addEventListener("push", (event) => {
  if (!event.data) return;
  let payload = { title: "Todo Reminder", body: "" };
  try {
    payload = event.data.json();
  } catch {
    payload.body = event.data.text();
  }
  event.waitUntil(
    self.registration.showNotification(payload.title || "Todo Reminder", {
      body: payload.body,
      icon: "/favicon.ico",
    })
  );
});

// Open the app when a notification is clicked
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      if (clients.length > 0) {
        return clients[0].focus();
      }
      return self.clients.openWindow("/todos");
    })
  );
});
