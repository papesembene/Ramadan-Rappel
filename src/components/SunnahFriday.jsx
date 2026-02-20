import { useState, useEffect, useRef } from "react";
import reminders from "../data/reminders.json";
import { BookOpen, Sparkles, Shirt, Droplet, Clock, Headphones, Star, Wind, Smile, Sparkle } from "lucide-react";

export default function SunnahFriday() {
  const [currentReminder, setCurrentReminder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    // Trouver le rappel de la Sunnah du Vendredi (jour 31)
    const sunnahReminder = reminders.find(item => item.day === 31);
    setCurrentReminder(sunnahReminder);
    setIsLoading(false);
  }, []);

  const audioRef = useRef();

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
      </div>
    );
  }

  if (!currentReminder) {
    return (
      <div className="p-6 rounded-xl border border-gold/10 bg-gold/5">
        <h2 className="text-xl font-semibold text-gold mb-4">Sunnah du Vendredi</h2>
        <p className="text-lightGray">
          La Sunnah du Vendredi sera disponible aujourd'hui.
        </p>
      </div>
    );
  }

  const sunnahList = [
    {
      title: "Lire la Sourate Al-Kahf",
      description: "Lire ou écouter la sourate Al-Kahf (18:1-110)",
      icon: <BookOpen size={20} strokeWidth={2} />
    },
    {
      title: "Se laver et se purifier",
      description: "Faire le ghusl (lavage complet) avant d'aller à la mosquée",
      icon: <Wind size={20} strokeWidth={2} />
    },
    {
      title: "Utiliser le miswak",
      description: "Nettoyer les dents avec le miswak ou une brosse à dents",
      icon: <Smile size={20} strokeWidth={2} />
    },
    {
      title: "Porter de beaux vêtements",
      description: "S'habiller avec les plus beaux vêtements disponibles",
      icon: <Shirt size={20} strokeWidth={2} />
    },
    {
      title: "Utiliser du parfum",
      description: "Se parfumer avec un parfum pur (non alcoolisé)",
      icon: <Sparkles size={20} strokeWidth={2} />
    },
    {
      title: "Aller tôt à la mosquée",
      description: "Arriver tôt pour la prière du vendredi",
      icon: <Clock size={20} strokeWidth={2} />
    },
    {
      title: "Écouter le sermon attentivement",
      description: "Prêter attention au khutba du vendredi",
      icon: <Headphones size={20} strokeWidth={2} />
    },
    {
      title: "Faire beaucoup de prières sur le Prophète",
      description: "Réciter beaucoup de salawat sur le Prophète Muhammad",
      icon: <Star size={20} strokeWidth={2} />
    },
    {
      title: "Faire des invocations",
      description: "Faire des dou'as entre l'adhan et l'iqama",
      icon: <Sparkle size={20} strokeWidth={2} />
    }
  ];

  return (
    <div className="p-6 rounded-xl border border-gold/10 bg-gold/5">
      <h2 className="text-xl font-semibold text-gold mb-4">Sunnah du Vendredi</h2>
      
      {/* Section Sourate Al-Kahf */}
      <div className="mb-8">
        <div className="bg-gold/20 rounded-lg p-4 mb-4">
          <h3 className="text-semibold text-gold mb-2">
            Sourate Al-Kahf
            <span className="ml-2 text-sm text-lightGray">(18:1-110)</span>
          </h3>
          <p className="text-lightGray">
            {currentReminder.arabic}
          </p>
          <p className="text-softWhite mt-2">
            {currentReminder.fr}
          </p>
        </div>

        {/* Lecteur audio */}
        <div className="bg-gold/20 rounded-lg p-4">
          <h3 className="text-semibold text-gold mb-3">Écouter la Sourate Al-Kahf</h3>
          
          <div className="flex items-center justify-between mb-3">
            <button 
              onClick={togglePlay}
              className="p-3 bg-gold/30 rounded-lg transition-colors hover:bg-gold/50">
              {isPlaying ? (
                <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6h4M4 18h16" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </button>
            
            <audio 
              ref={audioRef}
              src="/Al%20Kahf.mp3"
              onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
              onLoadedMetadata={(e) => setDuration(e.target.duration)}
              preload="metadata"
            />
            
            <div className="flex items-center">
              <span className="text-xs text-lightGray mr-2">
                {formatTime(currentTime)}
              </span>
              <div className="w-32 bg-gold/50 rounded-full h-1">
                <div 
                  className="bg-gold h-full rounded-full" 
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                ></div>
              </div>
              <span className="text-xs text-lightGray ml-2">
                {formatTime(duration)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Section Sunnah du Vendredi */}
      <div className="mb-8">
        <h3 className="text-semibold text-gold mb-4">Les Sunnah du Vendredi</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sunnahList.map((sunnah, index) => (
            <div key={index} className="bg-gold/20 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-semibold text-gold mb-1">{sunnah.icon} {sunnah.title}</h4>
                  <p className="text-lightGray text-sm">{sunnah.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section Dou'a */}
      <div className="bg-gold/20 rounded-lg p-4">
        <h3 className="text-semibold text-gold mb-2">Dou'a du Vendredi</h3>
        <p className="text-lightGray">
          {currentReminder.dua_ifar}
        </p>
      </div>
    </div>
  );
}

