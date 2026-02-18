/* eslint-disable no-restricted-globals */
import { precacheAndRoute } from "workbox-precaching";

precacheAndRoute(self.__WB_MANIFEST || []);

let scheduledNotifications = [];

// Configuration des notifications
const NOTIFICATION_SOUND = "default";

async function showNotification(title, body, tag, actions = []) {
  const options = {
    body,
    icon: "/icons/icon.svg",
    badge: "/icons/icon.svg",
    tag,
    renotify: true,
    vibrate: [200, 100, 200, 100, 200],
    sound: NOTIFICATION_SOUND,
    requireInteraction: true,
    actions
  };
  await self.registration.showNotification(title, options);
}

async function showDailyNotification() {
  await showNotification(
    "Ramadan Rappel",
    "Pensez à faire vos rappels quotidiens du Ramadan.",
    "ramadan-rappel-daily"
  );
}

async function showSuhoorNotification() {
  await showNotification(
    "⏰ Suhoor",
    "Il reste 30 minutes avant la fin du Suhoor !",
    "ramadan-suhoor"
  );
}

async function showIftarNotification() {
  await showNotification(
    "🌙 Iftar",
    "Il reste 15 minutes avant l'Iftar !",
    "ramadan-iftar"
  );
}

async function showPrayerNotification(prayerName) {
  await showNotification(
    `🕌 C'est l'heure de ${prayerName} !`,
    "Il est temps d'accomplir votre prière.",
    `prayer-${prayerName.toLowerCase()}`,
    [
      { action: "open", title: "Ouvrir l'app" },
      { action: "stop", title: "Arrêter" }
    ]
  );
}

function scheduleNotificationsFromList() {
  const now = Date.now();
  scheduledNotifications = scheduledNotifications.filter((notif) => {
    if (notif.time > now) {
      const delay = notif.time - now;
      setTimeout(() => {
        try {
          if (notif.type === "SUHOOR_NOTIFICATION") {
            showSuhoorNotification();
          } else if (notif.type === "IFTAR_NOTIFICATION") {
            showIftarNotification();
          } else if (notif.type === "PRAYER_NOTIFICATION" && notif.prayerName) {
            showPrayerNotification(notif.prayerName);
          }
        } catch (error) {
          console.error("Erreur lors de l'affichage de la notification:", error);
        }
      }, delay);
      return true;
    }
    return false;
  });
}

// Gestion des événements Push
self.addEventListener("push", (event) => {
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body,
      icon: "/icons/icon.svg",
      badge: "/icons/icon.svg",
      tag: data.tag || "ramadan-notification",
      renotify: true,
      vibrate: [200, 100, 200, 100, 200],
      sound: NOTIFICATION_SOUND,
      requireInteraction: true,
      data: data.data,
      actions: [
        { action: "open", title: "Ouvrir" },
        { action: "close", title: "Fermer" }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Gestion des clics sur notifications
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  
  if (event.action === "open" || !event.action) {
    event.waitUntil(
      clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow("/");
        }
      })
    );
  }
});

// Gestion Periodic Sync pour notifications régulières
self.addEventListener("periodicsync", (event) => {
  if (event.tag === "daily-reminder") {
    event.waitUntil(showDailyNotification());
  }
});

// Gestion Sync pour connexions intermittentes
self.addEventListener("sync", (event) => {
  if (event.tag === "daily-reminder") {
    event.waitUntil(showDailyNotification());
  }
});

// Gestion des messages depuis l'app
self.addEventListener("message", (event) => {
  if (event.data?.type === "SHOW_DAILY_NOTIFICATION") {
    event.waitUntil(showDailyNotification());
  } else if (event.data?.type === "SCHEDULE_PRAYER_NOTIFICATIONS") {
    scheduledNotifications = event.data.schedules || [];
    scheduleNotificationsFromList();
  } else if (event.data?.type === "SHOW_PRAYER_NOTIFICATION") {
    event.waitUntil(showPrayerNotification(event.data.prayerName));
  } else if (event.data?.type === "SKIP_WAIT") {
    self.skipWaiting();
  }
});

// Activation immédiate du Service Worker
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});
