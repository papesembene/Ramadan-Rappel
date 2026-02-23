import { CITIES } from "../lib/cities.js";
import { Bell, Moon, Sunset, Info, BellOff, Clock } from "lucide-react";

export default function SettingsCard({
  city,
  onCityChange,
  manualDay,
  useManualDay,
  onManualDayChange,
  onManualToggle,
  notificationStatus,
  onEnableNotifications,
  notificationSettings,
  onNotificationSettingsChange
}) {
  const isNotificationsEnabled = notificationStatus === "enabled";

  return (
    <section className="rounded-2xl border border-gold/20 bg-deepBlue/70 backdrop-blur-xs p-6 shadow-card">
      <p className="text-xs uppercase tracking-[0.3em] text-lightGray/80 mb-4">Paramètres</p>
      
      <div className="grid gap-4">
        <label className="text-sm text-softWhite/90">
          Ville
          <select
            className="mt-2 w-full rounded-xl border border-gold/20 bg-nightBlue/60 backdrop-blur-sm px-4 py-3 text-softWhite hover:border-gold/40 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30 transition-all cursor-pointer"
            value={city}
            onChange={(event) => onCityChange(event.target.value)}
          >
            {CITIES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <div className="rounded-xl border border-gold/10 bg-nightBlue/60 backdrop-blur-sm p-4 text-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-softWhite/90 font-medium">Jour de Ramadan</p>
              <p className="text-xs text-lightGray/70 mt-1">
                Ajuster manuellement le jour si nécessaire
              </p>
            </div>
            <button
              type="button"
              onClick={() => onManualToggle(!useManualDay)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                useManualDay ? "bg-gold/20 text-gold" : "bg-nightBlue/80 text-lightGray"
              }`}
            >
              {useManualDay ? "Manuel" : "Automatique"}
            </button>
          </div>
          <input
            type="range"
            min="1"
            max="30"
            value={manualDay}
            onChange={(event) => onManualDayChange(Number(event.target.value))}
            disabled={!useManualDay}
            className="mt-4 w-full accent-gold cursor-pointer"
          />
          <div className="mt-2 text-xs text-lightGray/70">Jour sélectionné: <span className="text-gold font-medium">{manualDay}</span></div>
        </div>

        <div className="rounded-xl border border-gold/10 bg-nightBlue/60 backdrop-blur-sm p-4 text-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="text-gold" size={20} />
              <div>
                <p className="text-softWhite/90 font-medium">Notifications</p>
                <p className="text-xs text-lightGray/70 mt-1">
                  Rappel quotidien et alertes prières
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onEnableNotifications}
              className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium transition-all ${
                isNotificationsEnabled
                  ? "bg-gold/20 text-gold hover:bg-gold/30"
                  : "bg-nightBlue/80 text-lightGray hover:bg-nightBlue"
              }`}
            >
              {isNotificationsEnabled ? (
                <>
                  <Bell size={14} />
                  Activé
                </>
              ) : (
                <>
                  <BellOff size={14} />
                  Désactivé
                </>
              )}
            </button>
          </div>
          
          {!isNotificationsEnabled && notificationStatus === "idle" && (
            <p className="mt-3 text-xs text-lightGray/60">
              Appuyez sur "Désactivé" pour activer les notifications
            </p>
          )}
          
          {notificationStatus === "denied" && (
            <div className="mt-3 flex items-start gap-2 rounded-lg bg-red-500/10 border border-red-500/20 p-3">
              <Info className="text-red-400 shrink-0 mt-0.5" size={16} />
              <div className="text-xs text-red-300">
                <p className="font-medium">Notifications bloquées</p>
                <p className="mt-1">
                  Veuillez autoriser les notifications dans les paramètres de votre navigateur.
                </p>
              </div>
            </div>
          )}
          
          {notificationStatus === "unsupported" && (
            <div className="mt-3 flex items-start gap-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 p-3">
              <Info className="text-yellow-400 shrink-0 mt-0.5" size={16} />
              <div className="text-xs text-yellow-300">
                <p className="font-medium">Notifications non prises en charge</p>
                <p className="mt-1">
                  Votre navigateur ne supporte pas les notifications push.
                </p>
              </div>
            </div>
          )}
          
          {isNotificationsEnabled && (
            <p className="mt-3 text-xs text-green-400">
              ✓ Notifications activées ! Vous recevrez des alertes pour les prières.
            </p>
          )}
        </div>

        <div className="rounded-xl border border-gold/10 bg-nightBlue/60 backdrop-blur-sm p-4 text-sm space-y-3">
          <p className="text-softWhite/90 font-medium">Rappels Ramadan</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Moon className="text-gold" size={18} />
              <div>
                <p className="text-softWhite/80 text-sm">Rappel Suhoor</p>
                <p className="text-xs text-lightGray/60">30 min avant l'heure du Fajr</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNotificationSettingsChange({ ...notificationSettings, suhoor: !notificationSettings.suhoor })}
              disabled={!isNotificationsEnabled}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                notificationSettings.suhoor
                  ? "bg-gold/20 text-gold"
                  : "bg-nightBlue/80 text-lightGray"
              } ${!isNotificationsEnabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {notificationSettings.suhoor ? "Activé" : "Désactivé"}
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sunset className="text-gold" size={18} />
              <div>
                <p className="text-softWhite/80 text-sm">Rappel Iftar</p>
                <p className="text-xs text-lightGray/60">15 min avant l'heure du Maghrib</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNotificationSettingsChange({ ...notificationSettings, iftar: !notificationSettings.iftar })}
              disabled={!isNotificationsEnabled}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                notificationSettings.iftar
                  ? "bg-gold/20 text-gold"
                  : "bg-nightBlue/80 text-lightGray"
              } ${!isNotificationsEnabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {notificationSettings.iftar ? "Activé" : "Désactivé"}
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="text-gold" size={18} />
              <div>
                <p className="text-softWhite/80 text-sm">Notifications Prières</p>
                <p className="text-xs text-lightGray/60">Alerte à l'heure de chaque prière</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNotificationSettingsChange({ ...notificationSettings, prayers: !notificationSettings.prayers })}
              disabled={!isNotificationsEnabled}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                notificationSettings.prayers
                  ? "bg-gold/20 text-gold"
                  : "bg-nightBlue/80 text-lightGray"
              } ${!isNotificationsEnabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {notificationSettings.prayers ? "Activé" : "Désactivé"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
