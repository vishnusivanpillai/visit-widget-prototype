import { useState, useEffect } from "react";
import { AlertCircle, X } from "lucide-react";

interface SummaryBannerProps {
  count: number;
  onClick: () => void;
  onDismiss: () => void;
  autoHideDuration?: number; // milliseconds, default 10000
}

export function SummaryBanner({
  count,
  onClick,
  onDismiss,
  autoHideDuration = 10000,
}: SummaryBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Start fading 1 second before auto-dismiss
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, autoHideDuration - 1000);

    // Fully hide and call onDismiss callback
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      onDismiss();
    }, autoHideDuration);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [autoHideDuration, onDismiss]);

  if (!isVisible || count === 0) return null;

  const handleDismissClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering banner click
    setIsVisible(false);
    onDismiss();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleDismissClick(e as any);
    }
  };

  return (
    <div
      className={`mb-4 px-4 py-3 bg-[#E3F2FD] border-l-4 border-[#003781] rounded-r-lg shadow-sm transition-all duration-1000 ${
        isFading ? "opacity-0" : "opacity-100"
      }`}
      role="alert"
      aria-live="polite"
      aria-label={`You have ${count} ${count === 1 ? "visit" : "visits"} awaiting confirmation. Click to filter calendar.`}
    >
      <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
        {/* Icon */}
        <AlertCircle className="w-5 h-5 text-[#003781] flex-shrink-0" />

        {/* Content */}
        <div
          className="flex-1 cursor-pointer pr-8 md:pr-0"
          onClick={onClick}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <p className="text-sm font-semibold text-[#003781]">
            You have {count} {count === 1 ? "visit" : "visits"} awaiting
            confirmation
          </p>
          <p className="text-xs text-[#5A6872] mt-1 md:mt-0.5">
            Click to view actionable visits
          </p>
        </div>

        {/* Close button */}
        <button
          onClick={handleDismissClick}
          className="absolute top-3 right-3 md:relative md:top-0 md:right-0 text-[#5A6872] hover:text-[#003781] transition-colors p-1"
          aria-label="Dismiss notification"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
