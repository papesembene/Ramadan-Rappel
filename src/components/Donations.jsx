import { useState, useEffect } from "react";
import { Heart, QrCode, TrendingUp, Users, Utensils, HandHeart, Gift, ChevronUp } from "lucide-react";

export default function Donations() {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [donations, setDonations] = useState([
    { amount: 100, count: 12 },
    { amount: 500, count: 8 },
    { amount: 1000, count: 5 }
  ]);
  const [totalRaised, setTotalRaised] = useState(0);
  const [goal] = useState(50000); // Objectif de 50,000 XOF

  useEffect(() => {
    // Calculer le total des dons
    const total = donations.reduce((acc, d) => acc + (d.amount * d.count), 0);
    setTotalRaised(total);
  }, [donations]);

  const progress = Math.min((totalRaised / goal) * 100, 100);

  const amounts = [
    { value: 100, label: "100 XOF" },
    { value: 500, label: "500 XOF" },
    { value: 1000, label: "1000 XOF" }
  ];

  const handleAmountClick = (amount) => {
    setSelectedAmount(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Heart className="text-gold" size={24} />
        <div>
          <h2 className="text-xl font-semibold text-softWhite">Dons</h2>
          <p className="text-sm text-lightGray/70">Soutenez les nécessiteux</p>
        </div>
      </div>

      {/* Progress Counter */}
      <div className="rounded-xl border border-gold/20 bg-deepBlue/70 backdrop-blur-xs p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="text-gold" size={20} />
            <span className="text-softWhite font-medium">Progression</span>
          </div>
          <span className="text-gold font-bold">{totalRaised.toLocaleString()} / {goal.toLocaleString()} XOF</span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-nightBlue/50 rounded-full h-4 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-gold to-yellow-400 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <p className="text-sm text-lightGray/70 mt-3 text-center">
          {donations.reduce((acc, d) => acc + d.count, 0)} donateurs ont contribué
        </p>
      </div>

      {/* Why Give Section */}
      <div className="rounded-xl border border-gold/10 bg-nightBlue/60 backdrop-blur-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="text-gold" size={20} />
          <h3 className="text-gold font-medium text-lg">Pourquoi donner ?</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gold/10 rounded-lg">
              <Utensils className="text-gold" size={18} />
            </div>
            <div>
              <h4 className="text-softWhite font-medium">Nourriture pour les nécessiteux</h4>
              <p className="text-sm text-lightGray/70">Aidez à fournir des repas aux familles dans le besoin pendant ce mois béni.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gold/10 rounded-lg">
              <HandHeart className="text-gold" size={18} />
            </div>
            <div>
              <h4 className="text-softWhite font-medium">Aide aux mendiants</h4>
              <p className="text-sm text-lightGray/70">Soutenez les personnes dans la rue avec un repas chaud et des nécessités.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gold/10 rounded-lg">
              <Gift className="text-gold" size={18} />
            </div>
            <div>
              <h4 className="text-softWhite font-medium">Sadaqa Jariya</h4>
              <p className="text-sm text-lightGray/70">La charité continue de bénéficier après la mort du donateur. Une récompense éternelle.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Amount Selection */}
      <div className="rounded-xl border border-gold/10 bg-nightBlue/60 backdrop-blur-sm p-5">
        <h3 className="text-gold font-medium text-lg mb-4">Choisir un montant</h3>
        
        <div className="grid grid-cols-3 gap-3 mb-4">
          {amounts.map((amount) => (
            <button
              key={amount.value}
              onClick={() => handleAmountClick(amount.value)}
              className={`py-3 px-4 rounded-xl border transition-all duration-200 ${
                selectedAmount === amount.value
                  ? "bg-gold/20 border-gold/40 text-gold shadow-glow"
                  : "bg-nightBlue/40 border-gold/10 text-softWhite hover:border-gold/30"
              }`}
            >
              <span className="font-bold text-lg">{amount.value}</span>
              <span className="text-xs ml-1">XOF</span>
            </button>
          ))}
        </div>
        
        {selectedAmount && (
          <div className="text-center text-sm text-lightGray/70">
            <p>Sélectionné: <span className="text-gold font-bold">{selectedAmount} XOF</span></p>
            <p className="mt-1">Scannez le QR code ci-dessous pour effectuer votre don</p>
          </div>
        )}
      </div>

      {/* QR Codes Section */}
      <div className="rounded-xl border border-gold/10 bg-nightBlue/60 backdrop-blur-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <QrCode className="text-gold" size={20} />
          <h3 className="text-gold font-medium text-lg">Scanner pour donner</h3>
        </div>
        
        <p className="text-sm text-lightGray/70 mb-4">
          Scannez le QR code avec votre application Wave ou Orange Money
        </p>
        
        <div className="grid grid-cols-2 gap-4">
          {/* Wave QR */}
          <div className="bg-white p-4 rounded-xl">
            <div className="flex items-center justify-center mb-2">
              <span className="font-bold text-deepBlue">WAVE</span>
            </div>
            <div className="bg-gray-200 aspect-square rounded-lg flex items-center justify-center">
              <QrCode className="text-gray-400" size={80} />
            </div>
            <p className="text-center text-xs text-gray-600 mt-2">
              Ouvrez Wave → Scan
            </p>
          </div>
          
          {/* Orange Money QR */}
          <div className="bg-orange-500 p-4 rounded-xl">
            <div className="flex items-center justify-center mb-2">
              <span className="font-bold text-white">ORANGE</span>
            </div>
            <div className="bg-white aspect-square rounded-lg flex items-center justify-center">
              <QrCode className="text-gray-400" size={80} />
            </div>
            <p className="text-center text-xs text-white mt-2">
              Ouvrez Orange Money → Payer
            </p>
          </div>
        </div>
      </div>

      {/* Info Note */}
      <div className="rounded-xl border border-gold/20 bg-gradient-to-r from-gold/10 to-gold/5 p-4">
        <p className="text-sm text-softWhite/80 text-center">
          <span className="text-gold font-semibold">Baraka Allahu fikum</span> pour votre générosité !
        </p>
        <p className="text-xs text-lightGray/60 text-center mt-2">
          Tous les dons sont destinés aux nécessiteux de la communauté.
        </p>
      </div>
    </div>
  );
}

