/* eslint-disable no-restricted-globals */
import { precacheAndRoute } from "workbox-precaching";

precacheAndRoute(self.__WB_MANIFEST || []);

let scheduledNotifications = [];

async function showNotification(title, body, tag) {
  const options = {
    body,
    icon: "/icons/icon.svg",
    badge: "/icons/icon.svg",
    tag,
    renotify: true
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
    `prayer-${prayerName.toLowerCase()}`
  );
}

function scheduleNotificationsFromList() {
  const now = Date.now();
  scheduledNotifications = scheduledNotifications.filter((notif) => {
    if (notif.time > now) {
      const delay = notif.time - now;
      setTimeout(() => {
        if (notif.type === "SUHOOR_NOTIFICATION") {
          showSuhoorNotification();
        } else if (notif.type === "IFTAR_NOTIFICATION") {
          showIftarNotification();
        } else if (notif.type === "PRAYER_NOTIFICATION") {
          showPrayerNotification(notif.prayerName);
        }
      }, delay);
      return true;
    }
    return false;
  });
}

self.addEventListener("periodicsync", (event) => {
  if (event.tag === "daily-reminder") {
    event.waitUntil(showDailyNotification());
  }
});

self.addEventListener("sync", (event) => {
  if (event.tag === "daily-reminder") {
    event.waitUntil(showDailyNotification());
  }
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SHOW_DAILY_NOTIFICATION") {
    event.waitUntil(showDailyNotification());
  } else if (event.data?.type === "SCHEDULE_PRAYER_NOTIFICATIONS") {
    scheduledNotifications = event.data.schedules || [];
    scheduleNotificationsFromList();
  } else if (event.data?.type === "SHOW_PRAYER_NOTIFICATION") {
    event.waitUntil(showPrayerNotification(event.data.prayerName));
  }
});
