import { normalizeTime } from "../lib/prayerTimes.js";

const PRAYER_NAMES = {
  Fajr: { label: "Fajr", icon: "🌅" },
  Sunrise: { label: "Sunrise", icon: "☀️" },
  Dhuhr: { label: "Dhuhr", icon: "🌞" },
  Asr: { label: "Asr", icon: "🌤️" },
  Maghrib: { label: "Maghrib", icon: "🌅" },
  Isha: { label: "Isha", icon: "🌙" }
};

export default function PrayerTimesCard({ city, timings, date, status }) {
  return (
    <section className="rounded-2xl border border-gold/20 bg-deepBlue/70 backdrop-blur-xs p-6 shadow-card hover:shadow-card-hover transition-all duration-300 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-lightGray/80">Horaires des prières</p>
          <p className="text-sm text-lightGray/70">{city}</p>
        </div>
        <span className="text-xs text-lightGray/60 font-medium">{date || "--"}</span>
      </div>

      {status === "ready" && timings ? (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {Object.entries(PRAYER_NAMES).map(([key, prayer]) => {
            const time = timings[key];
            if (!time) return null;
            
            const isSpecial = key === "Fajr" || key === "Maghrib";
            
            return (
              <div 
                key={key}
                className={`rounded-xl border p-3 transition-all duration-300 ${
                  isSpecial 
                    ? 'border-gold/30 bg-nightBlue/70 hover:bg-nightBlue/80' 
                    : 'border-gold/10 bg-nightBlue/50 hover:bg-nightBlue/60'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{prayer.icon}</span>
                  <p className={`text-xs uppercase tracking-wider ${isSpecial ? 'text-gold' : 'text-lightGray/70'}`}>
                    {prayer.label}
                  </p>
                </div>
                <p className={`text-xl font-semibold tabular-nums ${isSpecial ? 'text-gold' : 'text-softWhite'}`}>
                  {normalizeTime(time)}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-xl border border-gold/10 bg-nightBlue/40 p-3 animate-pulse">
              <div className="h-3 w-12 bg-nightBlue/60 rounded mb-2" />
              <div className="h-5 w-16 bg-nightBlue/60 rounded" />
            </div>
          ))}
        </div>
      )}

      {status === "error" ? (
        <p className="mt-4 text-sm text-gold">
          Erreur lors du chargement. Veuillez réessayer.
        </p>
      ) : null}
    </section>
  );
}
