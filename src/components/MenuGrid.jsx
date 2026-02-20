export default function MenuGrid({ items, onItemClick, currentPage }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = currentPage === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => onItemClick(item.id)}
            className={`flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all duration-200 ${
              isActive
                ? "bg-gradient-to-br from-gold/20 to-gold/5 border-gold/40 shadow-glow"
                : "bg-nightBlue/40 border-gold/10 hover:border-gold/30 hover:bg-nightBlue/60"
            }`}
          >
            <div
              className={`p-4 rounded-2xl transition-colors ${
                isActive ? "bg-gold/20" : "bg-deepBlue"
              }`}
            >
              <Icon
                size={28}
                className={isActive ? "text-gold" : "text-lightGray"}
                strokeWidth={2}
              />
            </div>
            <span
              className={`text-sm font-medium ${
                isActive ? "text-gold" : "text-softWhite"
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
