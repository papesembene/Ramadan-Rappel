import { BookOpen, ArrowLeft } from "lucide-react";

export default function FastingRules() {
  const rules = [
    {
      title: "Qui doit jeûner ?",
      content: `Le jeûne est obligatoire pour tout musulman adulte, sain d'esprit et en bonne santé physique. Il devient obligatoire à la puberté, mais les enfants sont encouragés à pratiquer de courts jeûnes pour apprendre progressivement.

Ceux qui parcourent de longues distances peuvent reporter le jeûne et rattraper les jours manqués après le Ramadan.`
    },
    {
      title: "L'intention (Niyyah) du matin",
      content: `"Nawaitu sauma ghadin 'an ada'i fardhi syahri Ramadan hadzihi sanata lillahi ta'ala»

نَوَيْتُ صَوْمَ غَدٍ عَنْ أَدَاءِ فَرْضِ شَهْرِ رَمَضَانِ هَذِهِ السَّنَةِ لِلَّهِ تَعَالَى

« Je compte jeûner demain pour accomplir les devoirs du mois de Ramadan de cette année, pour l'amour d'Allah le Très-Haut. »

Cette intention doit être formulée dans le cœur avant l'aube (Fajr). La niyya est une question de sincérité. Elle transforme l'acte physique du jeûne en un acte d'adoration accompli uniquement pour Allah.`
    },
    {
      title: "Qu'est-ce qui rompt le jeûne ?",
      content: `Certaines actions invalident le jeûne si elles sont effectuées intentionnellement après Fajr et avant Maghrib :

• Manger ou boire intentionnellement
• Relations sexuelles pendant le jeûne
• Se faire vomir délibérément
• Menstruations ou saignements post-partum
• Alimentation par injections intraveineuses

Manger ou boire par erreur ne rompt pas le jeûne.`
    },
    {
      title: "Exemptions valables",
      content: `L'islam autorise les croyants à manquer un jour de jeûne pour des raisons valables, sans commettre de péché :

• Maladie qui pourrait s'aggraver
• Grossesse ou allaitement
• Menstruations ou récupération postnatale
• Vieillesse avec difficultés physiques
• Voyage sur de longues distances

Ces jours sont généralement rattrapés ultérieurement.`
    },
    {
      title: "Rattrapage (Qada) et Fidya",
      content: `Les jours de jeûne manqués pour des raisons valables sont rattrapés ultérieurement (Qada).

Si le jeûne est totalement impossible (maladie chronique, grand âge), la personne s'acquitte de la fidya en offrant un repas à une personne pauvre pour chaque jour manqué.`
    },
    {
      title: "Dua de rupture du jeûne (Iftar)",
      content: `"Allahumma laka sumtu, wa bika amantu, wa 'ala rizqika aftartu, faghfir li ma qaddamtu wa ma akhkhartu»

اللَّهُمَّ إِنِّي لَكَ صَمْتُ، وَبِكَ آمَنْتُ، وَعَلَى رِزْقِكَ أَفْطَرْتُ، فَاغْفِرْ لِي مَا قَدَّمْتُ وَمَا أَخَّرْتُ

« Ô Allah, pour Toi j'ai jeûné, en Toi j'ai cru, et avec Ta subsistance je romps mon jeûne ; pardonne-moi mes péchés passés et futurs. »

Cette dua est recommandée immédiatement à la rupture du jeûne.`
    },
    {
      title: "Dua du Suhoor",
      content: `"Allahumma barik lana fi shahrina wa qinna wa barikna fihi»

اللَّهُمَّ بَارِكْ لَنَا فِي شَهْرِنَا وَقِنَا وَبَارِكْ لَنَا فِيهِ

« Ô Allah, bénis-nous pendant ce mois, protège-nous et bénis-nous en lui. »

Cette dua est récitée pendant le suhoor (repas d'avant l'aube).`
    },
    {
      title: "But spirituel du jeûne",
      content: `Allah dit dans la sourate Al-Baqarah (2:183) : « Ô vous qui croyez, le jeûne vous a été prescrit comme il a été prescrit à ceux qui vous ont précédés, afin que vous atteigniez la taqwa (la conscience de Dieu). »

Le jeûne développe la maîtrise de soi, la patience et l'empathie. Il nous rapproche d'Allah en détournant notre attention des distractions quotidiennes pour la recentrer sur la prière, la récitation du Coran et la charité.`
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="text-gold" size={24} />
        <div>
          <h2 className="text-xl font-semibold text-softWhite">Règles du Jeûne</h2>
          <p className="text-sm text-lightGray/70">Guide complet du Ramadan</p>
        </div>
      </div>

      {/* Introduction */}
      <div className="rounded-xl border border-gold/20 bg-deepBlue/70 backdrop-blur-xs p-6 shadow-card">
        <p className="font-arabic text-2xl leading-relaxed text-softWhite/95 mb-4" dir="rtl">
          بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
        </p>
        <p className="text-sm text-lightGray/80 italic mb-2">
          « Au nom de Dieu, le Tout Miséricordieux, le Très Miséricordieux. »
        </p>
        <p className="text-softWhite/90 leading-relaxed">
          Le jeûne du Ramadan est l'un des actes d'adoration les plus précieux en Islam.
          C'est un commandement d'Allah et un pilier fondamental de notre foi.
          Le jeûne ne se limite pas à l'abstinence de nourriture et de bebida ;
          c'est un temps de discipline, de patience et de ressourcement spirituel.
        </p>
      </div>

      {/* Rules */}
      <div className="space-y-4">
        {rules.map((rule, index) => (
          <div
            key={index}
            className="rounded-xl border border-gold/10 bg-nightBlue/60 backdrop-blur-sm p-5 hover:bg-nightBlue/70 transition-all"
          >
            <h3 className="text-gold font-medium text-lg mb-3">{rule.title}</h3>
            <div className="text-sm text-softWhite/80 leading-relaxed whitespace-pre-line">
              {rule.content}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="rounded-xl border border-gold/20 bg-gradient-to-r from-gold/10 to-gold/5 p-5">
        <p className="text-sm text-softWhite/70 text-center">
          Que ce Ramadan soit une source de bénédictions et de rapprochement vers Allah.
        </p>
        <p className="text-xs text-gold text-center mt-2">
          Ramadan Kareem / Mubarak
        </p>
      </div>
    </div>
  );
}
