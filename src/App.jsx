import { useState, useEffect, useMemo } from "react";
import reminders from "./data/reminders.json";
import ReminderCard from "./components/ReminderCard.jsx";
import PrayerTimesCard from "./components/PrayerTimesCard.jsx";
import PrayerAlerts from "./components/PrayerAlerts.jsx";
import SettingsCard from "./components/SettingsCard.jsx";
import DhikrCounter from "./components/DhikrCounter.jsx";
import FastingRules from "./components/FastingRules.jsx";
import MoonTracker from "./components/MoonTracker.jsx";
import { DEFAULT_CITY, PRAYER_METHOD } from "./lib/cities.js";
import { fetchPrayerTimes } from "./lib/prayerTimes.js";
import { loadSettings, saveSettings } from "./lib/storage.js";
import { Home, Clock, Settings as SettingsIcon, Moon, Heart, Scale } from "lucide-react";

const PAGES = [
  { id: "home", icon: Home, label: "Accueil" },
  { id: "prayers", icon: Clock, label: "Prières" },
  { id: "dhikr", icon: Heart, label: "Dhikr" },
  { id: "moon", icon: Moon, label: "Lune" },
  { id: "rules", icon: Scale, label: "Règles" },
  { id: "settings", icon: SettingsIcon, label: "Paramètres" }
];

const DEFAULT_SETTINGS = {
  city: DEFAULT_CITY,
  useManualDay: false,
  manualDay: 1,
  notificationsEnabled: false,
  notificationSettings: {
    suhoor: true,
    iftar: true,
    daily: true
  }
};

function getIslamicDateParts() {
  try {
    const formatter = new Intl.DateTimeFormat("en-u-ca-islamic", {
      day: "numeric",
      month: "numeric",
      year: "numeric"
    });
    const parts = formatter.formatToParts(new Date());
    const day = Number(parts.find((p) => p.type === "day")?.value || 1);
    const month = Number(parts.find((p) => p.type === "month")?.value || 1);
    return { day, month };
  } catch {
    return { day: 1, month: 1 };
  }
}

function resolveRamadanDay(useManualDay, manualDay) {
  if (useManualDay) return manualDay;
  const { day, month } = getIslamicDateParts();
  if (month !== 9) return 1;
  return Math.min(Math.max(day, 1), 30);
}

async function tryRegisterPeriodicSync() {
  if (!("serviceWorker" in navigator)) return false;
  const registration = await navigator.serviceWorker.ready;
  if (!("periodicSync" in registration)) return false;
  try {
    await registration.periodicSync.register("daily-reminder", {
      minInterval: 24 * 60 * 60 * 1000
    });
    return true;
  } catch {
    return false;
  }
}

function scheduleLocalReminder() {
  if (!("serviceWorker" in navigator)) return;
  const now = new Date();
  const target = new Date();
  target.setHours(7, 0, 0, 0);
  if (target <= now) {
    target.setDate(target.getDate() + 1);
  }
  const delay = target.getTime() - now.getTime();
  setTimeout(async () => {
    const registration = await navigator.serviceWorker.ready;
    registration.active?.postMessage({ type: "SHOW_DAILY_NOTIFICATION" });
  }, delay);
}

function schedulePrayerNotifications(timings, notificationSettings, onSchedule) {
  if (!timings || !notificationSettings) return;
  
  const now = new Date();
  const schedules = [];
  
  if (notificationSettings.suhoor && timings.Fajr) {
    const fajrTime = timings.Fajr.split(":");
    const fajrHour = parseInt(fajrTime[0]);
    const fajrMinute = parseInt(fajrTime[1]);
    
    const suhoorTarget = new Date();
    suhoorTarget.setHours(fajrHour, fajrMinute - 30, 0, 0);
    
    if (suhoorTarget > now) {
      schedules.push({
        type: "SUHOOR_NOTIFICATION",
        time: suhoorTarget.getTime(),
        message: "Il reste 30 minutes avant la fin du Suhoor !"
      });
    }
  }
  
  if (notificationSettings.iftar && timings.Maghrib) {
    const maghribTime = timings.Maghrib.split(":");
    const maghribHour = parseInt(maghribTime[0]);
    const maghribMinute = parseInt(maghribTime[1]);
    
    const iftarTarget = new Date();
    iftarTarget.setHours(maghribHour, maghribMinute - 15, 0, 0);
    
    if (iftarTarget > now) {
      schedules.push({
        type: "IFTAR_NOTIFICATION",
        time: iftarTarget.getTime(),
        message: "Il reste 15 minutes avant l'Iftar !"
      });
    }
  }
  
  if (schedules.length > 0) {
    onSchedule(schedules);
  }
}

export default function App() {
  const [activePage, setActivePage] = useState("home");
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [timings, setTimings] = useState(null);
  const [timingsStatus, setTimingsStatus] = useState("idle");
  const [timingsDate, setTimingsDate] = useState("");
  const [notificationStatus, setNotificationStatus] = useState("idle");

  // Check notification permission on mount and when it changes
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "granted") {
        setNotificationStatus("enabled");
        setSettings(prev => ({ ...prev, notificationsEnabled: true }));
      } else if (Notification.permission === "denied") {
        setNotificationStatus("denied");
        setSettings(prev => ({ ...prev, notificationsEnabled: false }));
      }
    }
  }, []);

  useEffect(() => {
    const stored = loadSettings();
    if (stored) {
      setSettings({ ...DEFAULT_SETTINGS, ...stored });
    }
  }, []);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    let isMounted = true;
    const cacheKey = `prayerTimes-${settings.city}-${new Date().toDateString()}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (isMounted) {
          setTimings(parsed.timings);
          setTimingsDate(parsed.date);
          setTimingsStatus("ready");
        }
      } catch {
        localStorage.removeItem(cacheKey);
      }
    }

    setTimingsStatus("loading");
    fetchPrayerTimes(settings.city, PRAYER_METHOD)
      .then((data) => {
        if (!isMounted) return;
        setTimings(data.timings);
        setTimingsDate(data.date);
        setTimingsStatus("ready");
        localStorage.setItem(cacheKey, JSON.stringify(data));
      })
      .catch(() => {
        if (!isMounted) return;
        setTimingsStatus("error");
      });

    return () => {
      isMounted = false;
    };
  }, [settings.city]);

  const dayNumber = useMemo(
    () => resolveRamadanDay(settings.useManualDay, settings.manualDay),
    [settings.useManualDay, settings.manualDay]
  );

  const reminder = useMemo(
    () => reminders.find((item) => item.day === dayNumber) ?? reminders[0],
    [dayNumber]
  );

  const handleNotificationToggle = async () => {
    console.log("Toggle clicked, current notificationStatus:", notificationStatus);
    
    if (notificationStatus === "enabled") {
      setNotificationStatus("denied");
      setSettings(prev => ({ ...prev, notificationsEnabled: false }));
      return;
    }
    
    if (!("Notification" in window)) {
      setNotificationStatus("unsupported");
      return;
    }
    
    if (Notification.permission === "denied") {
      setNotificationStatus("denied");
      alert("Veuillez autoriser les notifications dans les paramètres de votre navigateur.");
      return;
    }
    
    const permission = await Notification.requestPermission();
    console.log("Permission result:", permission);
    
    if (permission === "granted") {
      await tryRegisterPeriodicSync();
      scheduleLocalReminder();
      setNotificationStatus("enabled");
      setSettings(prev => ({ ...prev, notificationsEnabled: true }));
    } else {
      setNotificationStatus("denied");
      setSettings(prev => ({ ...prev, notificationsEnabled: false }));
    }
  };

  const handleNotificationSettingsChange = (newSettings) => {
    setSettings((prev) => ({
      ...prev,
      notificationSettings: newSettings
    }));
    
    if (timings) {
      schedulePrayerNotifications(timings, newSettings, (schedules) => {
        if ("serviceWorker" in navigator) {
          navigator.serviceWorker.ready.then((registration) => {
            registration.active?.postMessage({
              type: "SCHEDULE_PRAYER_NOTIFICATIONS",
              schedules: schedules
            });
          });
        }
      });
    }
  };

  const renderPage = () => {
    switch (activePage) {
      case "home":
        return (
          <>
            <ReminderCard reminder={reminder} day={dayNumber} isManual={settings.useManualDay} />
            {timings && (
              <PrayerAlerts
                timings={timings}
                isEnabled={notificationStatus === "enabled"}
                onToggle={handleNotificationToggle}
              />
            )}
          </>
        );
      
      case "prayers":
        return (
          <>
            <PrayerTimesCard
              city={settings.city}
              timings={timings}
              date={timingsDate}
              status={timingsStatus}
            />
            {timings && (
              <PrayerAlerts
                timings={timings}
                isEnabled={notificationStatus === "enabled"}
                onToggle={handleNotificationToggle}
              />
            )}
          </>
        );
      
      case "dhikr":
        return <DhikrCounter />;
      
      case "moon":
        return <MoonTracker />;
      
      case "rules":
        return <FastingRules />;
      
      case "settings":
        return (
          <SettingsCard
            city={settings.city}
            onCityChange={(city) => setSettings((prev) => ({ ...prev, city }))}
            manualDay={settings.manualDay}
            useManualDay={settings.useManualDay}
            onManualDayChange={(value) =>
              setSettings((prev) => ({ ...prev, manualDay: value }))
            }
            onManualToggle={(value) =>
              setSettings((prev) => ({ ...prev, useManualDay: value }))
            }
            notificationStatus={notificationStatus}
            onEnableNotifications={handleNotificationToggle}
            notificationSettings={settings.notificationSettings}
            onNotificationSettingsChange={handleNotificationSettingsChange}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-nightBlue text-softWhite pb-safe">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-nightBlue/95 backdrop-blur-sm border-b border-gold/10 px-4 py-3 safe-top">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-xl font-semibold text-gold text-center">Ramadan Rappel</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-4">
        {renderPage()}
      </main>

      {/* Bottom Navigation - Native App Style */}
      <nav className="fixed bottom-0 left-0 right-0 bg-nightBlue/98 backdrop-blur-xl border-t border-gold/10 py-2 px-2 safe-bottom">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-end">
            {PAGES.map((page) => {
              const Icon = page.icon;
              const isActive = activePage === page.id;
              
              return (
                <button
                  key={page.id}
                  onClick={() => setActivePage(page.id)}
                  className={`flex-1 flex flex-col items-center gap-1.5 py-2 px-1 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "text-gold bg-gradient-to-t from-gold/10 to-transparent"
                      : "text-lightGray/50 hover:text-lightGray/80 hover:bg-white/5"
                  }`}
                >
                  <Icon 
                    size={24} 
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span className={`text-[10px] font-medium tracking-wide ${isActive ? 'text-gold' : 'text-lightGray/60'}`}>
                    {page.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}
