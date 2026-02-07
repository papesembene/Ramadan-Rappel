import { Share2 } from "lucide-react";

export default function ReminderCard({ reminder, day, isManual }) {
  const handleShare = async () => {
    const shareText = reminder?.status !== "pending" 
      ? `Rappel du jour ${day} - Ramadan\n\n${reminder?.fr}\n\nSource: ${reminder?.source} ${reminder?.reference}\n\nDhikr: ${reminder?.dhikr}`
      : `En attente de rappel pour le jour ${day}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Rappel Ramadan - Jour ${day}`,
          text: shareText,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Erreur lors du partage:', err);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        alert('Texte copié dans le presse-papier !');
      } catch (err) {
        console.error('Erreur lors de la copie:', err);
      }
    }
  };

  return (
    <section className="group rounded-2xl border border-gold/20 bg-deepBlue/70 backdrop-blur-xs p-6 shadow-card hover:shadow-card-hover transition-all duration-300 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-lightGray/80">Jour {day}</p>
          <p className="text-sm text-lightGray/70">
            {isManual ? "Sélection manuelle" : "Basé sur le calendrier islamique"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-gold/40 bg-gold/5 px-3 py-1 text-xs text-gold font-medium shadow-sm">
            Rappel du jour
          </span>
          <button
            onClick={handleShare}
            className="rounded-full border border-gold/40 p-2 text-gold transition-all hover:bg-gold/10 hover:border-gold/60 hover:shadow-glow active:scale-95"
            title="Partager"
          >
            <Share2 size={16} />
          </button>
        </div>
      </div>

      {reminder?.status === "pending" ? (
        <div className="mt-6 space-y-3 text-sm text-lightGray/80">
          <p>Aucun rappel disponible pour ce jour.</p>
          <p>Revenez bientôt pour de nouveaux rappels spirituels.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-5">
          <div className="space-y-4">
            <p className="font-arabic text-2xl leading-relaxed text-softWhite/95" dir="rtl">
              {reminder?.arabic}
            </p>
            <p className="text-base leading-relaxed text-softWhite/90">{reminder?.fr}</p>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-gold/10 bg-nightBlue/60 backdrop-blur-sm p-4 text-sm hover:bg-nightBlue/70 transition-colors">
              <p className="text-lightGray/70 text-xs uppercase tracking-wider">Dua pour l'Iftar</p>
              <p className="font-arabic mt-2 text-lg text-softWhite/95" dir="rtl">
                {reminder?.dua_ifar || "Allahumma laka sumtu wa bika amantu wa 'alayka tawakkaltu"}
              </p>
            </div>
            <div className="rounded-xl border border-gold/10 bg-nightBlue/60 backdrop-blur-sm p-4 text-sm hover:bg-nightBlue/70 transition-colors">
              <p className="text-lightGray/70 text-xs uppercase tracking-wider">Dua pour le Suhoor</p>
              <p className="font-arabic mt-2 text-lg text-softWhite/95" dir="rtl">
                {reminder?.dua_suhoor || "Allahumma barik lana fi shahrina"}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-gold/10 bg-nightBlue/60 backdrop-blur-sm p-4 text-sm hover:bg-nightBlue/70 transition-colors">
              <p className="text-lightGray/70 text-xs uppercase tracking-wider">Source</p>
              <p className="text-softWhite/90 mt-1">{reminder?.source} {reminder?.reference}</p>
            </div>
            <div className="rounded-xl border border-gold/10 bg-nightBlue/60 backdrop-blur-sm p-4 text-sm hover:bg-nightBlue/70 transition-colors">
              <p className="text-lightGray/70 text-xs uppercase tracking-wider">Dhikr recommandé</p>
              <p className="text-gold mt-1 font-medium">{reminder?.dhikr}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
