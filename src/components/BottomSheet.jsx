import { useEffect } from "react";
import { X } from "lucide-react";

export default function BottomSheet({ isOpen, onClose, title, children }) {
  // Prevent body scroll when sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-nightBlue/80 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
        style={{ opacity: isOpen ? 1 : 0 }}
      />

      {/* Bottom Sheet */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-deepBlue border-t border-gold/20 rounded-t-3xl shadow-glow-strong transition-transform duration-300 ease-out ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{
          maxHeight: "85vh",
          paddingBottom: "env(safe-area-inset-bottom, 20px)"
        }}
      >
        {/* Handle Bar */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-lightGray/30 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gold/10">
          <h2 className="text-xl font-semibold text-gold">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gold/10 transition-colors"
            aria-label="Fermer"
          >
            <X size={24} className="text-lightGray" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto px-6 py-4" style={{ maxHeight: "calc(85vh - 120px)" }}>
          {children}
        </div>
      </div>
    </>
  );
}
