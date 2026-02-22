import { Heart, Utensils, ExternalLink, QrCode, Download, Users } from "lucide-react";
import { useState } from "react";

export default function Donations() {
  const WAVE_PAYMENT_LINK = "https://pay.wave.com/m/M_sn_6n2XNnTwMXv0/c/sn/";

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

      {/* Note importante - Supprimée car pas de suivi automatique */}

      {/* Wave Payment Button - Primary CTA */}
      <a
        href={WAVE_PAYMENT_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full"
      >
        <button className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-400 hover:to-yellow-400 text-deepBlue font-bold rounded-xl shadow-lg shadow-gold/30 flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-base sm:text-lg"
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-8 sm:h-8" fill="#1a1a2e">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
          </svg>
          Faire un don avec Wave
          <ExternalLink size={18} />
        </button>
      </a>

      {/* QR Code Section */}
      <div className="rounded-xl border border-gold/20 bg-nightBlue/60 backdrop-blur-sm p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <QrCode className="text-gold" size={20} />
          <h3 className="text-gold font-medium text-lg">Scanner le QR Code</h3>
        </div>
        
        <p className="text-sm text-lightGray/70 mb-3 sm:mb-4">
          Scannez ce code QR avec votre application Wave pour faire un don.
        </p>

        {/* QR Code Image */}
        <div className="flex justify-center mb-3">
          <img 
            src="/qr_code.png" 
            alt="Wave QR Code" 
            className="max-w-full h-auto rounded-lg border border-gold/20"
            style={{ maxHeight: '250px' }}
          />
        </div>
        
        {/* Download Link */}
        <a 
          href="/qr_code.png" 
          download="wave_qr_code.png"
          className="flex items-center justify-center gap-2 text-gold hover:text-yellow-400 transition-colors text-sm"
        >
          <Download size={16} />
          <span>Télécharger le QR Code</span>
        </a>
      </div>

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

      {/* Montant minimum info */}
      <div className="rounded-xl border border-gold/10 bg-nightBlue/60 backdrop-blur-sm p-4">
        <p className="text-sm text-lightGray/70 text-center">
          Tout montant est accepté, même 100 Francs CFA - peu importe le montant !
        </p>
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

