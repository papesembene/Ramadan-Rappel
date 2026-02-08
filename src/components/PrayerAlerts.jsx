import { useState, useEffect, useRef } from "react";
import { Bell, Volume2, VolumeX, BellRing, BellOff, X } from "lucide-react";

// URL locale pour l'Adhan
const ADHAN_URL = "/adhan.mp3";

export default function PrayerAlerts({ timings, isEnabled, onToggle }) {
  const [soundEnabled, setSoundEnabled] = useState(() => {
    try {
      return localStorage.getItem("prayerSound") !== "false";
    } catch {
      return true;
    }
  });
  const [nextPrayer, setNextPrayer] = useState(null);
  const [countdown, setCountdown] = useState("");
  const [isPrayerTime, setIsPrayerTime] = useState(false);
  const [isAdhanPlaying, setIsAdhanPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef(null);
  const playedToday = useRef(new Set());
  const adhanTimeoutRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("prayerSound", soundEnabled.toString());
  }, [soundEnabled]);

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.preload = "auto";
    
    audioRef.current.addEventListener("ended", () => {
      setIsAdhanPlaying(false);
    });
    
    return () => {
      if (adhanTimeoutRef.current) {
        clearTimeout(adhanTimeoutRef.current);
      }
    };
  }, []);

  const playAdhan = async () => {
    if (!audioRef.current) return false;
    
    try {
      audioRef.current.src = ADHAN_URL;
      audioRef.current.currentTime = 0;
      setIsAdhanPlaying(true);
      await audioRef.current.play();
      setAudioError(false);
      
      // Auto stop after 30 seconds if not manually stopped
      adhanTimeoutRef.current = setTimeout(() => {
        stopAdhan();
      }, 30000);
      
      return true;
    } catch (err) {
      console.log("Audio playback failed:", err);
      setIsAdhanPlaying(false);
      setAudioError(true);
      return false;
    }
  };

  const stopAdhan = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsAdhanPlaying(false);
    }
    if (adhanTimeoutRef.current) {
      clearTimeout(adhanTimeoutRef.current);
      adhanTimeoutRef.current = null;
    }
  };

  // Envoyer notification via Service Worker
  const sendPrayerNotification = (prayerName) => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(`🕌 C'est l'heure de ${prayerName} !`, {
          body: "Il est temps d'accomplir votre prière.",
          icon: "/icons/icon.svg",
          badge: "/icons/icon.svg",
          tag: `prayer-${prayerName.toLowerCase()}`,
          vibrate: [200, 100, 200, 100, 200],
          sound: "default",
          requireInteraction: true
        });
      });
    }
  };

  useEffect(() => {
    if (!timings) return;

    const now = new Date();
    // Sunrise n'est plus affiché mais on garde pour compatibilité
    const prayerOrder = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
    
    const getPrayerTime = (prayer) => {
      const time = timings[prayer];
      if (!time) return null;
      const [hours, minutes] = time.split(":").map(Number);
      const prayerDate = new Date();
      prayerDate.setHours(hours, minutes, 0, 0);
      return prayerDate;
    };

    let foundNext = null;
    let minDiff = Infinity;

    for (const prayer of prayerOrder) {
      const prayerTime = getPrayerTime(prayer);
      if (!prayerTime) continue;
      
      const diff = prayerTime.getTime() - now.getTime();
      if (diff > -5 * 60 * 1000 && diff < minDiff) {
        minDiff = diff;
        foundNext = { name: prayer, time: prayerTime, diff };
      }
    }

    if (foundNext) {
      // Jouer l'Adhan automatiquement quand l'heure arrive (fenêtre de 5 minutes)
      if (foundNext.diff <= 0 && foundNext.diff > -5 * 60 * 1000) {
        const todayKey = `${foundNext.name}-${now.toDateString()}`;
        if (!playedToday.current.has(todayKey)) {
          playedToday.current.add(todayKey);
          setIsPrayerTime(true);
          
          // Jouer l'Adhan (si app ouverte)
          playAdhan();
          
          // Notification système (fonctionne même si app en arrière-plan)
          sendPrayerNotification(foundNext.name);
          
          // Notification push si permission accordée
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification(`C'est l'heure de ${foundNext.name} !`, {
              body: "Il est temps de prier",
              icon: "/icons/icon.svg",
              sound: "default"
            });
          }
          
          setTimeout(() => setIsPrayerTime(false), 10000);
        }
      }
      
      setNextPrayer(foundNext);
      
      const interval = setInterval(() => {
        const now = new Date();
        const diff = foundNext.time.getTime() - now.getTime();
        
        if (diff <= 0) {
          setNextPrayer(null);
          return;
        }
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        let countdownText = "";
        if (hours > 0) {
          countdownText = `${hours}h ${minutes}m ${seconds}s`;
        } else if (minutes > 0) {
          countdownText = `${minutes}m ${seconds}s`;
        } else {
          countdownText = `${seconds}s`;
        }
        
        setCountdown(countdownText);
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [timings]);

  const prayerIcons = {
    Fajr: "🌅",
    Dhuhr: "🌞",
    Asr: "🌤️",
    Maghrib: "🌙",
    Isha: "🌃"
  };

  const handleToggleSound = () => {
    if (isAdhanPlaying) {
      stopAdhan();
    }
    setSoundEnabled(!soundEnabled);
  };

  const handleNotificationToggle = () => {
    if (onToggle) {
      onToggle();
    }
  };

  return (
    <section className={`rounded-2xl border border-gold/20 bg-deepBlue/70 backdrop-blur-xs p-6 shadow-card hover:shadow-card-hover transition-all duration-300 animate-slide-up ${isPrayerTime ? 'ring-2 ring-gold animate-pulse' : ''}`} style={{ animationDelay: '0.15s' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className={`text-gold ${isPrayerTime ? 'animate-bounce' : ''}`} size={20} />
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-lightGray/80">Alertes Prières</p>
            <p className="text-sm text-lightGray/70">Notifications et Adhan</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleNotificationToggle}
          className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium transition-all cursor-pointer ${
            isEnabled
              ? "bg-gold/20 text-gold shadow-glow hover:bg-gold/30"
              : "bg-nightBlue/80 text-lightGray hover:bg-nightBlue"
          }`}
        >
          {isEnabled ? (
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

      {isPrayerTime && nextPrayer && (
        <div className="mt-4 rounded-xl border border-gold bg-gradient-to-r from-gold/20 to-gold/5 p-4 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🕌</span>
              <div>
                <p className="text-gold font-medium text-lg">C'est l'heure de {nextPrayer.name} !</p>
                <p className="text-sm text-softWhite/80">Accomplissez votre prière</p>
              </div>
            </div>
            {isAdhanPlaying && (
              <button
                type="button"
                onClick={stopAdhan}
                className="flex items-center gap-2 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-2 text-sm font-medium hover:bg-red-500/30 transition-all cursor-pointer"
              >
                <X size={16} />
                Arrêter
              </button>
            )}
          </div>
        </div>
      )}

      {nextPrayer && isEnabled && !isPrayerTime && (
        <div className="mt-6 rounded-xl border border-gold/20 bg-nightBlue/60 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{prayerIcons[nextPrayer.name]}</span>
              <div>
                <p className="text-gold font-medium">{nextPrayer.name}</p>
                <p className="text-sm text-lightGray/70">
                  {timings[nextPrayer.name]}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-lightGray/60">Prochaine prière</p>
              <p className="text-xl font-semibold text-gold tabular-nums animate-pulse">
                {countdown}
              </p>
            </div>
          </div>
        </div>
      )}

      {!isEnabled && (
        <div className="mt-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4">
          <div className="flex items-center gap-3">
            <BellRing className="text-yellow-400" size={20} />
            <div>
              <p className="text-yellow-300 font-medium">Notifications désactivées</p>
              <p className="text-xs text-yellow-200/70 mt-1">
                Activez pour recevoir les alertes prières
              </p>
            </div>
          </div>
        </div>
      )}

      {isEnabled && (
        <div className="mt-4 space-y-3">
          {/* Info sur le son */}
          <div className="flex items-center justify-between rounded-xl border border-gold/10 bg-nightBlue/40 p-3">
            <div className="flex items-center gap-2">
              {soundEnabled && !isAdhanPlaying ? (
                <Volume2 className="text-gold" size={18} />
              ) : (
                <VolumeX className="text-lightGray/60" size={18} />
              )}
              <span className="text-sm text-lightGray/80">
                {isAdhanPlaying ? "Adhan en cours..." : soundEnabled ? "Adhan activé" : "Son désactivé"}
              </span>
            </div>
            <button
              type="button"
              onClick={handleToggleSound}
              className="rounded-lg border border-gold/20 bg-nightBlue/60 px-3 py-1 text-xs text-lightGray hover:bg-nightBlue/80 transition-all cursor-pointer"
            >
              {isAdhanPlaying ? "Arrêter" : soundEnabled ? "Couper" : "Activer"}
            </button>
          </div>
          
          {/* Info notifications */}
          <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-3">
            <p className="text-xs text-blue-300/80">
              🔔 Une notification apparaîtra à l'heure de chaque prière.
            </p>
            <p className="text-xs text-blue-300/60 mt-1">
              L'Adhan complet joue si l'app est ouverte.
            </p>
          </div>
        </div>
      )}

      {audioError && isEnabled && (
        <p className="mt-2 text-xs text-red-400 text-center">
          L'Adhan n'est pas disponible. Vérifiez votre connexion.
        </p>
      )}
    </section>
  );
}
