type BannerTone = "success" | "error" | "info";

interface Props {
  tone: BannerTone;
  message: string;
  onDismiss?: () => void;
}

/** Inline feedback strip, used instead of the old alert() calls. */
function Banner({ tone, message, onDismiss }: Props) {
  return (
    <div className={`banner banner-${tone}`} role={tone === "error" ? "alert" : "status"}>
      <span>{message}</span>
      {onDismiss && (
        <button type="button" className="banner-close" onClick={onDismiss} aria-label="Dismiss">
          ×
        </button>
      )}
    </div>
  );
}

export default Banner;
