import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Colorway } from "../collection";
import "./colorway-photo.css";

type Source = { src: string; srcSet?: string };
type Props = {
  mode: Colorway;
  sources: Record<Colorway, Source>;
  sizes: string;
  describe: (color: Colorway) => string;
  label: string;
  className: string;
  sceneClassName?: string;
  priority?: boolean;
  onReady?: () => void;
  children: ReactNode;
};
type Status = "loading" | "ready" | "failed";
const colors: Colorway[] = ["Black", "White"];

// Source changes start a new loading session; colour changes retain decoded photos.
export default function ColorwayPhoto(props: Props) {
  const identity = JSON.stringify(props.sources);
  return <PhotoSession key={identity} {...props} />;
}

function PhotoSession({
  mode,
  sources,
  sizes,
  describe,
  label,
  className,
  sceneClassName = "colorway-scene",
  priority = false,
  onReady,
  children,
}: Props) {
  const [status, setStatus] = useState<Record<Colorway, Status>>({
    Black: "loading",
    White: "loading",
  });
  const versions = useRef({ Black: 0, White: 0 });
  const notified = useRef(false);
  const other = mode === "Black" ? "White" : "Black";
  const shown =
    // Static HTML describes its default photo without waiting for browser
    // decoding. The client still tracks actual loading and fallback readiness.
    import.meta.env.SSR || status[mode] === "ready"
      ? mode
      : status[other] === "ready"
        ? other
        : null;
  const unavailable = colors.every((color) => status[color] === "failed");

  useEffect(() => {
    if (!notified.current && (shown || unavailable)) {
      notified.current = true;
      onReady?.();
    }
  }, [shown, unavailable, onReady]);

  async function loaded(image: HTMLImageElement, color: Colorway) {
    const version = ++versions.current[color];
    const source = image.currentSrc;
    try {
      await image.decode();
    } catch {
      // A responsive-source change can interrupt decode despite a usable image.
    }
    if (
      !image.isConnected ||
      versions.current[color] !== version ||
      image.currentSrc !== source
    )
      return;
    setStatus((current) => ({
      ...current,
      [color]: image.complete && image.naturalWidth > 0 ? "ready" : "failed",
    }));
  }

  return (
    <div
      className={className}
      role="img"
      aria-label={
        shown
          ? describe(shown)
          : `${label} ${unavailable ? "unavailable" : "loading"}`
      }
      aria-busy={!shown && !unavailable}
      data-colorway={shown ?? (unavailable ? "unavailable" : "loading")}
    >
      <div className={sceneClassName}>
        {colors.map((color) => (
          <div
            key={color}
            className="colorway-layer"
            data-visible={shown === color}
            aria-hidden="true"
          >
            <img
              {...sources[color]}
              sizes={sizes}
              alt=""
              width={1024}
              height={1536}
              loading={priority ? "eager" : "lazy"}
              fetchPriority={
                priority ? (mode === color ? "high" : "low") : "auto"
              }
              decoding="async"
              onLoad={(event) => void loaded(event.currentTarget, color)}
              onError={() => {
                versions.current[color]++;
                setStatus((current) => ({ ...current, [color]: "failed" }));
              }}
            />
            <svg
              className="colorway-print"
              viewBox="0 0 1024 1536"
              style={{ color: color === "Black" ? "#eeede8" : "#191918" }}
            >
              {children}
            </svg>
          </div>
        ))}
      </div>
      {unavailable && (
        <span className="colorway-unavailable mono">{label} unavailable</span>
      )}
    </div>
  );
}
