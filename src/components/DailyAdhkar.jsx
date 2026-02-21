import { useEffect, useState } from "react";
import { ArrowRight, ArrowLeft, Sun, Moon, BookOpen, Check, Clock, Volume2 } from "lucide-react";

const MORNING_DHIKR = [
  {
    id: "morning_1",
    arabic: "اللهم بك أصبحنا وبك أمسينا وبك نحيى وبك نموت وإليك المصير",
    phonetic: "Allahumma bika asbahna wa bika amsayna wa bika nahya wa bika namutu wa ilaykal-masir",
    reference: "Sahih Muslim 2713",
    translation: "O Allah, par Toi nous entrons dans la matinée, par Toi nous entrons dans le soir, par Toi nous vivons et par Toi nous mourrons, et vers Toi est la résurrection."
  },
  {
    id: "morning_2",
    arabic: "أصبحنا وأمسينا على فطرة الإسلام",
    phonetic: "Asbahna wa amsayna ala fitratil-islam",
    reference: "Sahih Muslim 2613",
    translation: "Nous entrons dans la matinée et dans le soir sur la fitra de l'Islam."
  },
  {
    id: "morning_3",
    arabic: "سبحان الله وبحمده وتبارك اسمه وتعالى جده ولا إله غيره",
    phonetic: "Subhanallahi wa bihamdihi wa tabarakasmuhu wa ta'ala jadduhu wa la ilaha ghayruhu",
    reference: "Sahih Al-Bukhari 6330",
    translation: "Gloire à Allah et que Son éloge soit célébré, et qu'Il soit exalté, le Seigneur Très Grand."
  },
  {
    id: "morning_4",
    arabic: "لا إله إلا الله وحده لا شريك له له الملك وله الحمد وهو على كل شيء قدير",
    phonetic: "La ilaha illallah wahdahu la sharika lahu lahul-mulku wa lahul-hamdu wa huwa ala kulli shayin qadir",
    reference: "Sahih Al-Bukhari 7376",
    translation: "Il n'y a de divinité qu'Allah, l'Unique, Il n'a point d'associé. À Lui appartient la royauté et à Lui l'éloge, et Il est Omnipotent."
  },
  {
    id: "morning_5",
    arabic: "سبحان الله وبحمده سبحان الله العظيم",
    phonetic: "Subhanallahi wa bihamdihi subhanallahi-l-adhim",
    reference: "Sahih Muslim 2726",
    translation: "Gloire à Allah et que Son éloge soit célébré, cent fois."
  }
];

const EVENING_DHIKR = [
  {
    id: "evening_1",
    arabic: "اللهم بك أمسينا وبك أصبحنا وإلهك وجهت ونبعت سنتك وتعلى جدك ولا إله غيرك",
    phonetic: "Allahumma bika amsayna wa bika asbahna wa ilahika wajjahtu wa nabtutu sunnataka wa ta'ala jadduka wa la ilaha ghayruka",
    reference: "Sahih Muslim 2713",
    translation: "O Allah, par Toi nous entrons dans le soir, par Toi nous entrons dans la matinée, par Toi nous vivons et par Toi nous mourrons, et vers Toi est la résurrection."
  },
  {
    id: "evening_2",
    arabic: "أمسينا وأصبحنا على فطرة الإسلام",
    phonetic: "Amsayna wa asbahna ala fitratil-islam",
    reference: "Sahih Muslim 2613",
    translation: "Nous entrons dans le soir et dans la matinée sur la fitra de l'Islam."
  },
  {
    id: "evening_3",
    arabic: "سبحان الله وبحمده وتبارك اسمه وتعالى جده ولا إله غيره",
    phonetic: "Subhanallahi wa bihamdihi wa tabarakasmuhu wa ta'ala jadduhu wa la ilaha ghayruhu",
    reference: "Sahih Al-Bukhari 6330",
    translation: "Gloire à Allah et que Son éloge soit célébré, et qu'Il soit exalté, le Seigneur Très Grand."
  },
  {
    id: "evening_4",
    arabic: "لا إله إلا الله وحده لا شريك له له الملك وله الحمد وهو على كل شيء قدير",
    phonetic: "La ilaha illallah wahdahu la sharika lahu lahul-mulku wa lahul-hamdu wa huwa ala kulli shayin qadir",
    reference: "Sahih Al-Bukhari 7376",
    translation: "Il n'y a de divinité qu'Allah, l'Unique, Il n'a point d'associé. À Lui appartient la royauté et à Lui l'éloge, et Il est Omnipotent."
  },
  {
    id: "evening_5",
    arabic: "سبحان الله وبحمده سبحان الله العظيم",
    phonetic: "Subhanallahi wa bihamdihi subhanallahi-l-adhim",
    reference: "Sahih Muslim 2726",
    translation: "Gloire à Allah et que Son éloge soit célébré, cent fois."
  }
];

const SPECIAL_DHIKR = [
  {
    id: "special_1",
    arabic: "اللهم أنت ربي لا إله إلا أنت خلقتني وأنا عبدك وأنا على عهدك ووعدك ما استطعت أعوذ بك من شر ما صنعت أبوء لك بنعمتك علي وأبوء بذنبي فاغفرني فإنه لا يغفر الذنوب إلا أنت",
    phonetic: "Allahumma anta rabbi la ilaha illa anta khalaqtani wa ana abduka wa ana ala ahdika wa wa'dika ma statatu a'udhu bika min sharri ma sanatu abuu laka bi-ni'matika alayya wa abuu bi-dhanbi faghfir li fa-innahu la yaghfiru-l-dhunuba illa anta",
    reference: "Sahih Al-Bukhari 7405",
    translation: "O Allah, Tu es mon Seigneur, il n'y a de divinité qu'Allah, Tu as créé, Tu es mon Seigneur, à Toi appartiennent les plus beaux noms."
  },
  {
    id: "special_2",
    arabic: "سبحان الله وبحمده سبحان الله العظيم",
    phonetic: "Subhanallahi wa bihamdihi subhanallahi-l-adhim",
    reference: "Sahih Muslim 2726",
    translation: "Gloire à Allah et que Son éloge soit célébré, cent fois."
  },
  {
    id: "special_3",
    arabic: "لا إله إلا الله وحده لا شريك له له الملك وله الحمد وهو على كل شيء قدير",
    phonetic: "La ilaha illallah wahdahu la sharika lahu lahul-mulku wa lahul-hamdu wa huwa ala kulli shayin qadir",
    reference: "Sahih Al-Bukhari 7376",
    translation: "Il n'y a de divinité qu'Allah, l'Unique, Il n'a point d'associé. À Lui appartient la royauté et à Lui l'éloge, et Il est Omnipotent."
  }
];

const QUL_HUWALLAH = [
  {
    id: "qul_1",
    arabic: "قل هو الله أحد",
    phonetic: "Qul huwa Allahu ahad",
    reference: "Sourate Al-Ikhlas 112:1",
    translation: "Dis : 'Il est Allah, l'Unique'."
  },
  {
    id: "qul_2",
    arabic: "الله الصمد",
    phonetic: "Allahus-samad",
    reference: "Sourate Al-Ikhlas 112:2",
    translation: "Allah, le Maître absolu de toute chose."
  },
  {
    id: "qul_3",
    arabic: "لم يلد ولم يولد",
    phonetic: "Lam yalid wa lam yulad",
    reference: "Sourate Al-Ikhlas 112:3",
    translation: "Il n'engendre pas et n'a pas été engendré."
  },
  {
    id: "qul_4",
    arabic: "لم يكن له كفواً أحد",
    phonetic: "Lam yakun lahu kufuwan ahad",
    reference: "Sourate Al-Ikhlas 112:4",
    translation: "Et nul n'est égal à Lui."
  }
];

export default function DailyAdhkar() {
  const [activeTab, setActiveTab] = useState("morning");
  const [completed, setCompleted] = useState({});
  const [showDetails, setShowDetails] = useState(false);

  const toggleCompletion = (id) => {
    setCompleted(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getDhikrForTime = () => {
    const now = new Date();
    const hour = now.getHours();
    
    if (hour >= 5 && hour < 12) return MORNING_DHIKR;
    if (hour >= 12 && hour < 18) return SPECIAL_DHIKR;
    return EVENING_DHIKR;
  };

  const dhikrList = getDhikrForTime();

  return (
    <section className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className=" font-bold text-gold">Adhkar Quotidiens</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("morning")}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
              activeTab === "morning" ? "bg-gold/20 text-gold" : "bg-nightBlue/80 text-lightGray"
            }`}
          >
            Matin
          </button>
          <button
            onClick={() => setActiveTab("evening")}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
              activeTab === "evening" ? "bg-gold/20 text-gold" : "bg-nightBlue/80 text-lightGray"
            }`}
          >
            Soir
          </button>
          <button
            onClick={() => setActiveTab("special")}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
              activeTab === "special" ? "bg-gold/20 text-gold" : "bg-nightBlue/80 text-lightGray"
            }`}
          >
            Spéciales
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {activeTab === "morning" && (
          <>
            <h3 className="text-lg font-semibold text-softWhite mb-3">Adhkar du Matin</h3>
            {MORNING_DHIKR.map((dhikr) => (
              <div
                key={dhikr.id}
                className="flex items-center justify-between p-4 rounded-xl border border-gold/20 bg-nightBlue/60 backdrop-blur-sm"
              >
                <div className="flex-1">
                  <p className="text-lg font-medium text-softWhite mb-1">{dhikr.arabic}</p>
                  <p className="text-sm font-medium text-gold mb-1">{dhikr.phonetic}</p>
                  <p className="text-xs text-lightGray">{dhikr.translation}</p>
                  <p className="text-xs text-gold mt-1">{dhikr.reference}</p>
                </div>
                <button
                  onClick={() => toggleCompletion(dhikr.id)}
                  className="p-2 rounded-lg transition-all"
                >
                  {completed[dhikr.id] ? (
                    <Check className="text-gold" size={20} />
                  ) : (
                    <Clock className="text-lightGray" size={20} />
                  )}
                </button>
              </div>
            ))}
          </>
        )}

        {activeTab === "evening" && (
          <>
            <h3 className="text-lg font-semibold text-softWhite mb-3">Adhkar du Soir</h3>
            {EVENING_DHIKR.map((dhikr) => (
              <div
                key={dhikr.id}
                className="flex items-center justify-between p-4 rounded-xl border border-gold/20 bg-nightBlue/60 backdrop-blur-sm"
              >
                <div className="flex-1">
                  <p className="text-lg font-medium text-softWhite mb-1">{dhikr.arabic}</p>
                  <p className="text-sm font-medium text-gold mb-1">{dhikr.phonetic}</p>
                  <p className="text-xs text-lightGray">{dhikr.translation}</p>
                  <p className="text-xs text-gold mt-1">{dhikr.reference}</p>
                </div>
                <button
                  onClick={() => toggleCompletion(dhikr.id)}
                  className="p-2 rounded-lg transition-all"
                >
                  {completed[dhikr.id] ? (
                    <Check className="text-gold" size={20} />
                  ) : (
                    <Clock className="text-lightGray" size={20} />
                  )}
                </button>
              </div>
            ))}
          </>
        )}

        {activeTab === "special" && (
          <>
            <h3 className="text-lg font-semibold text-softWhite mb-3">Adhkar Spéciales</h3>
            {SPECIAL_DHIKR.map((dhikr) => (
              <div
                key={dhikr.id}
                className="flex items-center justify-between p-4 rounded-xl border border-gold/20 bg-nightBlue/60 backdrop-blur-sm"
              >
                <div className="flex-1">
                  <p className="text-lg font-medium text-softWhite mb-1">{dhikr.arabic}</p>
                  <p className="text-sm font-medium text-gold mb-1">{dhikr.phonetic}</p>
                  <p className="text-xs text-lightGray">{dhikr.translation}</p>
                  <p className="text-xs text-gold mt-1">{dhikr.reference}</p>
                </div>
                <button
                  onClick={() => toggleCompletion(dhikr.id)}
                  className="p-2 rounded-lg transition-all"
                >
                  {completed[dhikr.id] ? (
                    <Check className="text-gold" size={20} />
                  ) : (
                    <Clock className="text-lightGray" size={20} />
                  )}
                </button>
              </div>
            ))}
            
            <div className="mt-6 p-4 rounded-xl border border-gold/20 bg-nightBlue/60 backdrop-blur-sm">
              <h4 className="text-sm font-semibold text-softWhite mb-3">Récitation de la Sourate Al-Ikhlas</h4>
              <div className="grid grid-cols-2 gap-2">
                {QUL_HUWALLAH.map((ayah) => (
                  <div
                    key={ayah.id}
                    className="p-3 rounded-lg border border-gold/20 bg-nightBlue/60 backdrop-blur-sm text-center"
                  >
                    <p className="text-sm font-medium text-softWhite mb-1">{ayah.arabic}</p>
                    <p className="text-xs text-gold">{ayah.reference}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="mt-6 p-4 rounded-xl border border-gold/20 bg-nightBlue/60 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-softWhite mb-3">Temps recommandés</h3>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <Sun className="mx-auto text-gold mb-1" size={20} />
            <p className="text-xs text-lightGray">Matin (Fajr-Dhuhr)</p>
          </div>
          <div>
            <Moon className="mx-auto text-gold mb-1" size={20} />
            <p className="text-xs text-lightGray">Soir (Maghrib-Isha)</p>
          </div>
          <div>
            <BookOpen className="mx-auto text-gold mb-1" size={20} />
            <p className="text-xs text-lightGray">Spéciales (N'importe quand)</p>
          </div>
        </div>
      </div>
    </section>
  );
}

