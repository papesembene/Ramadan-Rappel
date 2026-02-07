import { useState, useEffect } from "react";
import { GiPrayerBeads } from "react-icons/gi";
import { Plus, RotateCcw, Trophy } from "lucide-react";

const STORAGE_KEY = "dhikr-counters";

const DHIKR_TYPES = [
  { id: "subhanallah", labelKey: "subhanAllah", arabic: "سُبْحَانَ اللَّهِ", goal: 33 },
  { id: "alhamdoullah", labelKey: "alHamdouLillah", arabic: "الْحَمْدُ لِلَّهِ", goal: 33 },
  { id: "allahua", labelKey: "allahuaakbar", arabic: "اللَّهُ أَكْبَرُ", goal: 33 },
  { id: "lailahaillallah", labelKey: "lailahaillallah", arabic: "لَا إِلَهَ إِلَّا اللَّهُ", goal: 100 },
];

export default function DhikrCounter() {
  const [counters, setCounters] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const today = new Date().toDateString();
        if (parsed.date === today) {
          return parsed.counters;
        }
      }
    } catch {
      // ignore
    }
    return DHIKR_TYPES.reduce((acc, type) => {
      acc[type.id] = { count: 0, goal: type.goal };
      return acc;
    }, {});
  });

  const [lastDate, setLastDate] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored).date;
      }
    } catch {
      // ignore
    }
    return null;
  });

  const [activeDhikr, setActiveDhikr] = useState("subhanallah");
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    const today = new Date().toDateString();
    if (lastDate && lastDate !== today) {
      setCounters(
        DHIKR_TYPES.reduce((acc, type) => {
          acc[type.id] = { count: 0, goal: type.goal };
          return acc;
        }, {})
      );
    }
    setLastDate(today);
  }, [lastDate]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ date: new Date().toDateString(), counters })
      );
    } catch {
      // ignore
    }
  }, [counters]);

  const handleIncrement = (dhikrId) => {
    setCounters((prev) => ({
      ...prev,
      [dhikrId]: {
        ...prev[dhikrId],
        count: prev[dhikrId].count + 1,
      },
    }));
  };

  const handleReset = () => {
    setCounters((prev) => ({
      ...prev,
      [activeDhikr]: { ...prev[activeDhikr], count: 0 },
    }));
  };

  const handleResetAll = () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser tous les compteurs ?')) {
      setCounters(
        DHIKR_TYPES.reduce((acc, type) => {
          acc[type.id] = { count: 0, goal: type.goal };
          return acc;
        }, {})
      );
    }
  };

  const getProgress = (dhikrId) => {
    const counter = counters[dhikrId];
    if (!counter) return 0;
    return Math.min((counter.count / counter.goal) * 100, 100);
  };

  const getTotalCount = () => {
    return Object.values(counters).reduce((sum, c) => sum + c.count, 0);
  };

  const getCompletedCount = () => {
    return Object.values(counters).filter((c) => c.count >= c.goal).length;
  };

  const activeCounter = counters[activeDhikr] || { count: 0, goal: 33 };

  const handleQuickAdd = (num) => {
    setCounters((prev) => ({
      ...prev,
      [activeDhikr]: {
        ...prev[activeDhikr],
        count: prev[activeDhikr].count + num,
      },
    }));
  };

  return (
    <section className="rounded-2xl border border-gold/20 bg-deepBlue/70 backdrop-blur-xs p-6 shadow-card hover:shadow-card-hover transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.2s' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <GiPrayerBeads className="text-gold animate-pulse-glow" size={24} />
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-lightGray/80">Compteur Dhikr</p>
            <p className="text-sm text-lightGray/70">Tasbih quotidien</p>
          </div>
        </div>
        <button
          onClick={() => setShowStats(!showStats)}
          className={`flex items-center gap-1 rounded-lg border border-gold/20 px-3 py-1 text-xs transition-all ${showStats ? 'bg-gold/20 text-gold' : 'text-lightGray hover:bg-nightBlue/70'}`}
        >
          <Trophy size={14} />
          Stats
        </button>
      </div>

      {showStats && (
        <div className="mt-4 rounded-xl border border-gold/10 bg-nightBlue/60 p-4 animate-fade-in">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-semibold text-gold">{getTotalCount()}</p>
              <p className="text-xs text-lightGray/70">Total aujourd'hui</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-gold">{getCompletedCount()}/{DHIKR_TYPES.length}</p>
              <p className="text-xs text-lightGray/70">Objectifs atteints</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-gold">{Math.round((getTotalCount() / 200) * 100)}%</p>
              <p className="text-xs text-lightGray/70">Progression</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {DHIKR_TYPES.map((type) => (
          <button
            key={type.id}
            onClick={() => setActiveDhikr(type.id)}
            className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs transition-all ${
              activeDhikr === type.id
                ? 'border-gold/40 bg-gold/10 text-gold'
                : 'border-gold/10 text-lightGray/70 hover:bg-nightBlue/60'
            }`}
          >
            <span className="font-arabic">{type.arabic}</span>
          </button>
        ))}
      </div>

      <div className="mt-6 relative h-2.5 rounded-full bg-nightBlue/80 overflow-hidden shadow-inner">
        <div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-mutedGold via-gold to-gold shadow-glow transition-all duration-500 ease-smooth"
          style={{ width: `${getProgress(activeDhikr)}%` }}
        />
        {activeCounter.count >= activeCounter.goal && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
        )}
      </div>

      <div className="mt-4 text-center">
        <p className="text-6xl font-semibold text-gold tabular-nums">
          {activeCounter.count}
        </p>
        <p className="mt-2 text-sm text-lightGray/70">
          {activeCounter.count >= activeCounter.goal ? (
            <span className="text-gold font-medium">Objectif atteint !</span>
          ) : (
            <>sur {activeCounter.goal}</>
          )}
        </p>
        <p className="mt-1 text-xs text-lightGray/60 font-arabic" dir="rtl">
          {DHIKR_TYPES.find((t) => t.id === activeDhikr)?.arabic}
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          onClick={() => handleIncrement(activeDhikr)}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-gold to-mutedGold px-6 py-4 text-nightBlue font-medium shadow-glow hover:shadow-glow-strong hover:scale-[1.02] active:scale-95 transition-all"
        >
          <Plus size={20} />
          Ajouter
        </button>
        <button
          onClick={handleReset}
          className="flex items-center justify-center gap-2 rounded-xl border border-gold/30 bg-nightBlue/60 backdrop-blur-sm px-6 py-4 text-gold font-medium hover:bg-nightBlue/80 hover:border-gold/50 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <RotateCcw size={20} />
          Réinitialiser
        </button>
      </div>

      <button
        onClick={handleResetAll}
        className="mt-3 w-full rounded-lg border border-gold/10 bg-transparent px-4 py-2 text-xs text-lightGray/60 hover:bg-nightBlue/40 transition-all"
      >
        Réinitialiser tout
      </button>

      <div className="mt-4 flex justify-center gap-2">
        {[5, 10, 25].map((num) => (
          <button
            key={num}
            onClick={() => handleQuickAdd(num)}
            className="rounded-lg border border-gold/20 bg-nightBlue/40 px-3 py-1 text-xs text-lightGray hover:bg-nightBlue/60 transition-all"
          >
            +{num}
          </button>
        ))}
      </div>
    </section>
  );
}
