import { Phone, Copy, Check, Heart, Target, Users, Utensils, Info } from "lucide-react";
import { useState } from "react";

export default function Donations() {
  const [copiedWave, setCopiedWave] = useState(false);
  const [copiedOrange, setCopiedOrange] = useState(false);

  const PHONE_WAVE = "781157773";
  const PHONE_ORANGE = "781157773";

  // NOTE: La progression des dons sera disponible après validation du compte Wave Business
  // Pour le moment, vous pouvez recevoir des dons via Wave ou Orange Money
  const TOTAL_COLLECTED = 0; // À mettre à jour après validation Wave Business
  const DONOR_COUNT = 0; // À mettre à jour après validation Wave Business
  const CAMPAIGN_GOAL = 500000; // Objectif en Francs CFA (sera activé après Wave Business)

  const progress = Math.min((TOTAL_COLLECTED / CAMPAIGN_GOAL) * 100, 100);

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "wave") {
        setCopiedWave(true);
        setTimeout(() => setCopiedWave(false), 2000);
      } else {
        setCopiedOrange(true);
        setTimeout(() => setCopiedOrange(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const dialNumber = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Heart className="text-gold" size={24} />
        <div>
          <h2 className="text-xl font-semibold text-softWhite">Faire un Don</h2>
          <p className="text-sm text-lightGray/70">Soutenez les nécessiteux</p>
        </div>
      </div>

      {/* Note importante */}
      <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4">
        <div className="flex items-start gap-3">
          <Info className="text-blue-400 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-sm text-blue-200 font-medium">Progression des dons</p>
            <p className="text-xs text-blue-300/70 mt-1">
              La progression des dons sera disponible après validation de notre compte Wave Business.
              En attendant, vous pouvez déjà faire un don via Wave ou Orange Money !
            </p>
          </div>
        </div>
      </div>

      {/* Objectif de la collecte - Sera activé après Wave Business */}
      {TOTAL_COLLECTED > 0 && (
        <div className="rounded-xl border border-gold/20 bg-deepBlue/70 backdrop-blur-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <Target className="text-gold" size={20} />
            <h3 className="text-gold font-medium text-lg">Objectif de la collecte</h3>
          </div>
          
          <p className="text-sm text-lightGray/70 mb-4">
            Cette collecte vise à aider les familles dans le besoin pendant ce mois béni du Ramadan.
          </p>

          <div className="bg-nightBlue/50 rounded-xl p-4 border border-gold/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-softWhite font-medium">Progression</span>
              <span className="text-gold font-bold">
                {TOTAL_COLLECTED.toLocaleString()} / {CAMPAIGN_GOAL.toLocaleString()} Francs CFA
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-nightBlue/80 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-gold to-yellow-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2 text-lightGray/60">
                <Users size={16} />
                <span className="text-sm">{DONOR_COUNT} donateurs</span>
              </div>
              <span className="text-gold text-sm font-medium">{progress.toFixed(0)}% atteint</span>
            </div>
          </div>
        </div>
      )}

      {/* Pourquoi donner */}
      <div className="rounded-xl border border-gold/10 bg-nightBlue/60 backdrop-blur-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="text-gold" size={20} />
          <h3 className="text-gold font-medium text-lg">Pourquoi donner ?</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gold/10 rounded-lg flex-shrink-0">
              <Utensils className="text-gold" size={18} />
            </div>
            <div>
              <h4 className="text-softWhite font-medium">Nourriture pour les nécessiteux</h4>
              <p className="text-sm text-lightGray/70">
                Aidez à fournir des repas aux familles dans le besoin pendant ce mois béni.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gold/10 rounded-lg flex-shrink-0">
              <Heart className="text-gold" size={18} />
            </div>
            <div>
              <h4 className="text-softWhite font-medium">Sadaqa Jariya</h4>
              <p className="text-sm text-lightGray/70">
                La charité continue de bénéficier après la mort du donateur. Une récompense éternelle.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gold/10 rounded-lg flex-shrink-0">
              <Users className="text-gold" size={18} />
            </div>
            <div>
              <h4 className="text-softWhite font-medium">Solidarité communautaire</h4>
              <p className="text-sm text-lightGray/70">
                Renforcez les liens de solidarité au sein de notre communauté.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Phone Numbers Section */}
      <div className="rounded-xl border border-gold/10 bg-nightBlue/60 backdrop-blur-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <Phone className="text-gold" size={20} />
          <h3 className="text-gold font-medium text-lg">Effectuer votre don</h3>
        </div>

        <p className="text-sm text-lightGray/70 mb-4">
          Tout montant est accepté, même 100 Francs CFA - peu importe le montant !
        </p>

        {/* Wave Number */}
        <div className="bg-deepBlue/50 rounded-xl p-4 border border-gold/10 mb-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-green-400 font-bold text-lg">WAVE</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-softWhite">{PHONE_WAVE}</span>
            <div className="flex gap-2">
              <button
                onClick={() => dialNumber(PHONE_WAVE)}
                className="p-2 bg-green-500/20 rounded-lg hover:bg-green-500/30 transition-colors"
                title="Appeler"
              >
                <Phone className="text-green-400" size={20} />
              </button>
              <button
                onClick={() => copyToClipboard(PHONE_WAVE, "wave")}
                className="p-2 bg-gold/10 rounded-lg hover:bg-gold/20 transition-colors"
                title="Copier"
              >
                {copiedWave ? (
                  <Check className="text-green-400" size={20} />
                ) : (
                  <Copy className="text-gold" size={20} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Orange Money Number */}
        <div className="bg-deepBlue/50 rounded-xl p-4 border border-gold/10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-orange-400 font-bold text-lg">ORANGE MONEY</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-softWhite">{PHONE_ORANGE}</span>
            <div className="flex gap-2">
              <button
                onClick={() => dialNumber(PHONE_ORANGE)}
                className="p-2 bg-orange-500/20 rounded-lg hover:bg-orange-500/30 transition-colors"
                title="Appeler"
              >
                <Phone className="text-orange-400" size={20} />
              </button>
              <button
                onClick={() => copyToClipboard(PHONE_ORANGE, "orange")}
                className="p-2 bg-gold/10 rounded-lg hover:bg-gold/20 transition-colors"
                title="Copier"
              >
                {copiedOrange ? (
                  <Check className="text-green-400" size={20} />
                ) : (
                  <Copy className="text-gold" size={20} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="rounded-xl border border-gold/20 bg-gradient-to-r from-gold/10 to-transparent p-4">
        <p className="text-sm text-softWhite/80 text-center">
          <span className="text-gold font-semibold">Baraka Allahu fikum</span> pour votre générosité !
        </p>
        <p className="text-xs text-lightGray/60 text-center mt-1">
          Chaque don, aussi petit soit-il, fait une différence
        </p>
      </div>

      {/* Footer Note */}
      <div className="text-center pb-8">
        <p className="text-xs text-lightGray/50">
          Made with ❤️ by Sem's - Coding to Success
        </p>
      </div>
    </div>
  );
}

