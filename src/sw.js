/* eslint-disable no-restricted-globals */
import { precacheAndRoute } from "workbox-precaching";

precacheAndRoute(self.__WB_MANIFEST || []);

let scheduledNotifications = [];

// IndexedDB for persistent storage
const DB_NAME = "RamadanRappelDB";
const STORE_NAME = "scheduledNotifications";

async function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
      }
    };
  });
}

async function saveScheduledNotificationsToDB(notifications) {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    
    // Clear existing and add new (without id if autoIncrement)
    await store.clear();
    for (const notif of notifications) {
      const { id, ...notifWithoutId } = notif;
      await store.add(notifWithoutId);
    }
    
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (e) {
    console.log("Error saving to DB:", e);
  }
}

async function loadScheduledNotificationsFromDB() {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.log("Error loading from DB:", e);
    return [];
  }
}

// Load saved notifications on startup
(async function init() {
  try {
    const savedNotifs = await loadScheduledNotificationsFromDB();
    // Filter out notifications that have already passed
    const now = Date.now();
    scheduledNotifications = savedNotifs.filter(notif => notif.time > now);
    
    if (scheduledNotifications.length > 0) {
      scheduleNotificationsFromList();
    }
    
    // Clean up old notifications in DB
    if (savedNotifs.length > scheduledNotifications.length) {
      saveScheduledNotificationsToDB(scheduledNotifications);
    }
  } catch (e) {
    console.log("Init error:", e);
  }
})();

// Configuration des notifications
const NOTIFICATION_SOUND = "/adhan.mp3";

async function showNotification(title, body, tag, actions = [], customSound = null) {
  const options = {
    body,
    icon: "/icons/icon.svg",
    badge: "/icons/icon.svg",
    tag,
    renotify: true,
    vibrate: [200, 100, 200, 100, 200],
    sound: customSound || NOTIFICATION_SOUND,
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

async function showFridaySunnahNotification() {
  await showNotification(
    "🌟 Sunnah du Vendredi",
    "N'oubliez pas de lire la Sourate Al-Kahf et de suivre les sunnah du vendredi !",
    "sunnah-vendredi",
    [
      { action: "open", title: "Ouvrir" },
      { action: "stop", title: "Arrêter" }
    ]
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
    ],
    "/adhan.mp3"  // Custom sound for prayer
  );
}

function scheduleNotificationsFromList() {
  const now = Date.now();
  const validNotifications = [];
  
  scheduledNotifications = scheduledNotifications.filter((notif) => {
    if (notif.time > now) {
      validNotifications.push(notif);
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
  
  // Save remaining to IndexedDB
  saveScheduledNotificationsToDB(validNotifications);
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
  } else if (event.tag === "friday-sunnah") {
    event.waitUntil(showFridaySunnahNotification());
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
    // Save to IndexedDB for persistence
    saveScheduledNotificationsToDB(scheduledNotifications);
    scheduleNotificationsFromList();
  } else if (event.data?.type === "SHOW_PRAYER_NOTIFICATION") {
    event.waitUntil(showPrayerNotification(event.data.prayerName));
  } else if (event.data?.type === "SKIP_WAIT") {
    self.skipWaiting();
  } else if (event.data?.type === "CHECK_FOR_UPDATE") {
    // Force check for update
    self.registration.update().then(() => {
      console.log("Update check triggered");
    });
  }
});

// Activation immédiate du Service Worker avec mise à jour automatique
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

// Force update immediately when a new version is available
self.addEventListener("activate", (event) => {
  // Immediately claim all clients
  event.waitUntil(self.clients.claim());
  
  // Force refresh all clients
  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then(clientList => {
      clientList.forEach(client => {
        client.navigate(client.url);
      });
    })
  );
});

// Listen for updatefound to auto-update
self.addEventListener("updatefound", () => {
  const newRegistration = self.registration;
  const installingWorker = newRegistration.installing;
  
  if (installingWorker) {
    installingWorker.addEventListener("statechange", () => {
      if (installingWorker.state === "installed" && navigator.serviceWorker.controller) {
        // New version available, notify to refresh
        clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
          clientList.forEach(client => {
            client.postMessage({
              type: "REFRESH_APP",
              message: "Nouvelle version disponible"
            });
          });
        });
      }
    });
  }
});
