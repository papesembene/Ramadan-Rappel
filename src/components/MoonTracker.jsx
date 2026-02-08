import { Moon, Sun, Calendar, Bell, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

export default function MoonTracker() {
  const [currentPhase, setCurrentPhase] = useState(null);
  const [daysToRamadan, setDaysToRamadan] = useState(null);
  const [daysToAid, setDaysToAid] = useState(null);
  const [sightingNews, setSightingNews] = useState([]);

  // Calculer la phase actuelle de la lune (approximatif)
  useEffect(() => {
    const calculateMoonPhase = () => {
      const now = new Date();
      const knownNewMoon = new Date("2025-01-01"); // Nouvelle lune de référence
      
      const lunarCycle = 29.53059; // Durée moyenne du cycle lunaire en jours
      const diffTime = now - knownNewMoon;
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      const cyclePosition = diffDays % lunarCycle;
      const phaseIndex = Math.floor((cyclePosition / lunarCycle) * 8);
      
      const phases = [
        { name: "Nouvelle Lune", icon: "🌑", illumination: 0 },
        { name: "Premier Croissant", icon: "🌒", illumination: 15 },
        { name: "Premier Quartier", icon: "🌓", illumination: 50 },
        { name: "Gibbeuse Croissante", icon: "🌔", illumination: 75 },
        { name: "Pleine Lune", icon: "🌕", illumination: 100 },
        { name: "Gibbeuse Décroissante", icon: "🌖", illumination: 75 },
        { name: "Dernier Quartier", icon: "🌗", illumination: 50 },
        { name: "Dernier Croissant", icon: "🌘", illumination: 15 }
      ];
      
      return phases[phaseIndex];
    };

    setCurrentPhase(calculateMoonPhase());

    // Calculer les jours jusqu'à Ramadan 2026 (approximatif)
    // Ramadan 2026 commence vers le 18 février 2026 (sous réserve de sighting)
    const ramadanStart = new Date("2026-02-18");
    const today = new Date();
    const daysToRamadanCalc = Math.ceil((ramadanStart - today) / (1000 * 60 * 60 * 24));
    setDaysToRamadan(daysToRamadanCalc > 0 ? daysToRamadanCalc : null);

    // Aid al-Fitr (Korité) - 29 ou 30 jours après le début de Ramadan
    const aidDate = new Date("2026-03-19"); // Approximatif
    const daysToAidCalc = Math.ceil((aidDate - today) / (1000 * 60 * 60 * 24));
    setDaysToAid(daysToAidCalc > 0 ? daysToAidCalc : null);
  }, []);

  const sightingAnnouncements = [
    {
      date: "2026-02-15",
      title: "Nuit du Tarawih",
      description: "Attente de l'annonce officielle du début du Ramadan 2026",
      status: "upcoming"
    },
    {
      date: "2026-03-18",
      title: "Nuit du doute (Korité)",
      description: "Observation de la lune pour l'Aïd el-Fitr",
      status: "upcoming"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Moon className="text-gold" size={24} />
        <div>
          <h2 className="text-xl font-semibold text-softWhite">Suivi de la Lune</h2>
          <p className="text-sm text-lightGray/70">Calendrier lunaire du Ramadan</p>
        </div>
      </div>

      {/* Current Moon Phase */}
      <div className="rounded-xl border border-gold/20 bg-deepBlue/70 backdrop-blur-xs p-6 shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-lightGray/80">Phase Actuelle</p>
            <h3 className="text-2xl font-semibold text-softWhite mt-1">
              {currentPhase?.name || "Chargement..."}
            </h3>
          </div>
          <div className="text-6xl">
            {currentPhase?.icon || "🌑"}
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-xs text-lightGray/60 mb-1">
            <span>Éclairage lunaire</span>
            <span>{currentPhase?.illumination || 0}%</span>
          </div>
          <div className="h-2 bg-nightBlue/60 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gold rounded-full transition-all duration-500"
              style={{ width: `${currentPhase?.illumination || 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Countdowns */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-gold/20 bg-nightBlue/60 backdrop-blur-sm p-5">
          <div className="flex items-center gap-3 mb-3">
            <Calendar className="text-gold" size={20} />
            <span className="text-sm text-lightGray/80">Awal Ramadan 2026</span>
          </div>
          {daysToRamadan !== null ? (
            <div className="text-3xl font-bold text-softWhite">
              {daysToRamadan} <span className="text-sm font-normal text-lightGray/60">jours</span>
            </div>
          ) : (
            <div className="text-lg text-softWhite/70">
              Ramadan 2026 a commencé ! 🎉
            </div>
          )}
          <p className="text-xs text-lightGray/50 mt-2">*~18 février 2026</p>
        </div>

        <div className="rounded-xl border border-gold/20 bg-nightBlue/60 backdrop-blur-sm p-5">
          <div className="flex items-center gap-3 mb-3">
            <Sun className="text-gold" size={20} />
            <span className="text-sm text-lightGray/80">Korité 2026</span>
          </div>
          {daysToAid !== null ? (
            <div className="text-3xl font-bold text-softWhite">
              {daysToAid} <span className="text-sm font-normal text-lightGray/60">jours</span>
            </div>
          ) : (
            <div className="text-lg text-softWhite/70">
              Aid el-Fitr célébré ! 🌙
            </div>
          )}
          <p className="text-xs text-lightGray/50 mt-2">*~19 mars 2026</p>
        </div>
      </div>

      {/* Moon Sighting Announcements */}
      <div className="rounded-xl border border-gold/10 bg-nightBlue/60 backdrop-blur-sm p-5">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="text-gold" size={20} />
          <h3 className="text-lg font-medium text-softWhite">Annonces de visibilité</h3>
        </div>
        
        <div className="space-y-3">
          {sightingAnnouncements.map((item, index) => (
            <div 
              key={index}
              className="flex items-start gap-3 p-3 rounded-lg bg-nightBlue/40 hover:bg-nightBlue/60 transition-colors"
            >
              <div className="flex-shrink-0 w-2 h-2 rounded-full bg-gold mt-2" />
              <div>
                <p className="text-sm font-medium text-softWhite">{item.title}</p>
                <p className="text-xs text-lightGray/60">{item.description}</p>
                <p className="text-xs text-gold mt-1">{item.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info Card */}
      <div className="rounded-xl border border-gold/10 bg-gradient-to-r from-gold/5 to-transparent p-5">
        <p className="text-sm text-softWhite/80 leading-relaxed">
          <span className="text-gold font-medium">Note :</span> Les dates du Ramadan et de l'Aïd 
          sont approximatives et dépendent de l'observation de la lune (hilal) par les autorités 
          religieuses compétentes au Sénégal.
        </p>
      </div>
    </div>
  );
}
