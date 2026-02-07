export default function Header() {
  return (
    <header className="text-center space-y-4 animate-fade-in">
      <div className="mx-auto h-1 w-20 rounded-full bg-gradient-to-r from-mutedGold via-gold to-mutedGold shadow-glow-strong animate-pulse-glow" />
      <div className="space-y-2">
        <h1 className="text-4xl font-semibold tracking-tight text-softWhite bg-gradient-to-b from-softWhite to-lightGray bg-clip-text text-transparent">
          Ramadan Rappel
        </h1>
        <p className="text-base text-lightGray/90">
          Votre companion spirituel pour le mois de Ramadan
        </p>
      </div>
    </header>
  );
}
