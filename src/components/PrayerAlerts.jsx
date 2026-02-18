import { useState, useEffect, useRef, useCallback } from "react";
import { Bell, Volume2, VolumeX, BellRing, BellOff, X, AlertCircle } from "lucide-react";
import { normalizeTime } from "../lib/prayerTimes.js";

// URL locale pour l'Adhan
const ADHAN_URL = "/adhan.mp3";
const PRAYER_ORDER = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
const PRAYER_WINDOW_MS = 5 * 60 * 1000;

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
  const [errorMessage, setErrorMessage] = useState(null);
  
  const audioRef = useRef(null);
  const playedToday = useRef(new Set());
  const adhanTimeoutRef = useRef(null);
  const tickerIntervalRef = useRef(null);
  const audioUnlockedRef = useRef(false);

  // Initialize audio once
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.preload = "auto";
    
    const handleEnded = () => {
      setIsAdhanPlaying(false);
    };
    
    const handleError = (e) => {
      console.log("Audio error:", e);
      setIsAdhanPlaying(false);
      setAudioError(true);
    };
    
    audioRef.current.addEventListener("ended", handleEnded);
    audioRef.current.addEventListener("error", handleError);

    const unlockAudio = async () => {
      if (!audioRef.current || audioUnlockedRef.current) return;
      try {
        audioRef.current.src = ADHAN_URL;
        audioRef.current.muted = true;
        await audioRef.current.play();
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.muted = false;
        audioUnlockedRef.current = true;
      } catch {
        audioRef.current.muted = false;
      }
    };
    
    window.addEventListener("pointerdown", unlockAudio, { once: true });
    
    return () => {
      audioRef.current?.removeEventListener("ended", handleEnded);
      audioRef.current?.removeEventListener("error", handleError);
      window.removeEventListener("pointerdown", unlockAudio);
      stopAdhan();
    };
  }, []);

  // Save sound preference
  useEffect(() => {
    localStorage.setItem("prayerSound", soundEnabled.toString());
  }, [soundEnabled]);

  const stopAdhan = useCallback(() => {
    console.log("Stopping adhan...");
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsAdhanPlaying(false);
    
    if (adhanTimeoutRef.current) {
      clearTimeout(adhanTimeoutRef.current);
      adhanTimeoutRef.current = null;
    }
  }, []);

  const playAdhan = useCallback(async () => {
    if (!audioRef.current || !soundEnabled) return false;
    
    // Stop any playing audio first
    stopAdhan();
    
    try {
      audioRef.current.src = ADHAN_URL;
      audioRef.current.currentTime = 0;
      setIsAdhanPlaying(true);
      setAudioError(false);
      
      await audioRef.current.play();
      
      // Auto stop after 30 seconds
      adhanTimeoutRef.current = setTimeout(() => {
        console.log("Auto stopping adhan after 30 seconds");
        stopAdhan();
      }, 30000);
      
      return true;
    } catch (err) {
      console.log("Audio playback failed:", err);
      setIsAdhanPlaying(false);
      setAudioError(true);
      return false;
    }
  }, [soundEnabled, stopAdhan]);

  // Envoyer notification via Service Worker
  const sendPrayerNotification = useCallback(async (prayerName) => {
    if (!("serviceWorker" in navigator)) return;
    if (!("Notification" in window) || Notification.permission !== "granted") return;
    
    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(`🕌 C'est l'heure de ${prayerName} !`, {
        body: "Il est temps d'accomplir votre prière.",
        icon: "/icons/icon.svg",
        badge: "/icons/icon.svg",
        tag: `prayer-${prayerName.toLowerCase()}`,
        vibrate: [200, 100, 200, 100, 200],
        requireInteraction: true
      });
    } catch (error) {
      console.error("Notification error:", error);
    }
  }, []);

  const getPrayerTime = useCallback((prayerName) => {
    const raw = timings?.[prayerName];
    if (!raw) return null;
    const clean = normalizeTime(raw);
    const [hoursStr, minutesStr] = clean.split(":");
    const hours = Number(hoursStr);
    const minutes = Number(minutesStr);
    
    if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;
    
    const prayerDate = new Date();
    prayerDate.setHours(hours, minutes, 0, 0);
    return prayerDate;
  }, [timings]);

  useEffect(() => {
    if (!timings) return;

    const updatePrayerState = () => {
      const now = new Date();
      let foundCurrent = null;
      let foundNext = null;
      let minFutureDiff = Infinity;

      for (const prayer of PRAYER_ORDER) {
        const prayerTime = getPrayerTime(prayer);
        if (!prayerTime) continue;

        const diff = prayerTime.getTime() - now.getTime();

        if (diff <= 0 && diff > -PRAYER_WINDOW_MS) {
          foundCurrent = { name: prayer, time: prayerTime, diff };
        }

        if (diff >= 0 && diff < minFutureDiff) {
          minFutureDiff = diff;
          foundNext = { name: prayer, time: prayerTime, diff };
        }
      }

      if (foundCurrent) {
        const todayKey = `${foundCurrent.name}-${now.toDateString()}`;
        setIsPrayerTime(true);
        setNextPrayer(foundCurrent);
        setCountdown("Maintenant");

        if (!playedToday.current.has(todayKey)) {
          playedToday.current.add(todayKey);

          if (isEnabled && soundEnabled) {
            playAdhan();
          }
          if (isEnabled) {
            sendPrayerNotification(foundCurrent.name);
          }
        }
        return;
      }

      setIsPrayerTime(false);
      if (!foundNext) {
        setNextPrayer(null);
        setCountdown("");
        return;
      }

      setNextPrayer(foundNext);
      const diff = foundNext.time.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (hours > 0) {
        setCountdown(`${hours}h ${minutes}m ${seconds}s`);
      } else if (minutes > 0) {
        setCountdown(`${minutes}m ${seconds}s`);
      } else {
        setCountdown(`${Math.max(seconds, 0)}s`);
      }
    };

    updatePrayerState();
    if (tickerIntervalRef.current) {
      clearInterval(tickerIntervalRef.current);
    }
    tickerIntervalRef.current = setInterval(updatePrayerState, 1000);

    return () => {
      if (tickerIntervalRef.current) {
        clearInterval(tickerIntervalRef.current);
        tickerIntervalRef.current = null;
      }
    };
  }, [getPrayerTime, isEnabled, playAdhan, sendPrayerNotification, soundEnabled, timings]);

  const prayerIcons = {
    Fajr: "🌅",
    Dhuhr: "🌞",
    Asr: "🌤️",
    Maghrib: "🌙",
    Isha: "🌃"
  };

  const handleStopAdhan = useCallback(() => {
    stopAdhan();
  }, [stopAdhan]);

  const handleToggleSound = useCallback(() => {
    if (isAdhanPlaying) {
      stopAdhan();
    }
    setSoundEnabled(prev => !prev);
  }, [isAdhanPlaying, stopAdhan]);

  const handleNotificationToggle = useCallback(() => {
    if (onToggle) {
      onToggle();
    }
  }, [onToggle]);

  // Error boundary fallback
  if (errorMessage) {
    return (
      <section className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6">
        <div className="flex items-center gap-3">
          <AlertCircle className="text-red-400" size={24} />
          <div>
            <p className="text-red-300 font-medium">Erreur</p>
            <p className="text-sm text-red-200/70">{errorMessage}</p>
          </div>
        </div>
        <button
          onClick={() => {
            setErrorMessage(null);
            setAudioError(false);
            stopAdhan();
          }}
          className="mt-4 w-full rounded-lg bg-red-500/20 border border-red-500/30 px-4 py-2 text-sm text-red-300 hover:bg-red-500/30"
        >
          Réessayer
        </button>
      </section>
    );
  }

  return (
    <section className={`rounded-2xl border border-gold/20 bg-deepBlue/70 backdrop-blur-xs p-6 shadow-card hover:shadow-card-hover transition-all duration-300 animate-slide-up ${isPrayerTime ? 'ring-2 ring-gold' : ''}`} style={{ animationDelay: '0.15s' }}>
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
        <div className="mt-4 rounded-xl border border-gold bg-gradient-to-r from-gold/20 to-gold/5 p-4">
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
                onClick={handleStopAdhan}
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
              <p className="text-xl font-semibold text-gold tabular-nums">
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
                {isAdhanPlaying ? "🔊 Adhan en cours..." : soundEnabled ? "🔔 Adhan activé" : "🔕 Son désactivé"}
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
          ⚠️ L'Adhan n'est pas disponible. Vérifiez votre connexion.
        </p>
      )}
    </section>
  );
}
