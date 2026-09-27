import { useState } from "react";
import type { Colorway } from "../collection";
import CircleArtwork from "./CircleArtwork";
import "./campaign-photo.css";

const colorways: Colorway[] = ["Black", "White"];

export default function CampaignPhoto({
  mode,
  onReady,
}: {
  mode: Colorway;
  onReady: () => void;
}) {
  const [ready, setReady] = useState({ Black: false, White: false });
  const [failed, setFailed] = useState({ Black: false, White: false });
  const other = mode === "Black" ? "White" : "Black";
  const shown = ready[mode] ? mode : ready[other] ? other : null;
  const unavailable = failed.Black && failed.White;

  async function loaded(image: HTMLImageElement, color: Colorway) {
    try {
      await image.decode();
    } catch {
      // onLoad has already confirmed the file is available for rendering.
    }
    setReady((current) => ({ ...current, [color]: true }));
    onReady();
  }

  return (
    <div
      className="campaign-photo"
      role="img"
      aria-label={
        shown
          ? `Back view of a model wearing a ${shown.toLowerCase()} 360 hoodie with a precise circle-grid world map and A brighter tomorrow slogan`
          : unavailable
            ? "360 world hoodie campaign photo unavailable"
            : "360 world hoodie campaign photo loading"
      }
      aria-busy={shown === null && !unavailable}
      data-colorway={shown ?? "loading"}
    >
      <div className="campaign-scene">
        {colorways.map((color) => (
          <div
            key={color}
            className="campaign-colorway"
            data-visible={shown === color}
            aria-hidden="true"
          >
            <img
              src={`/images/campaign/${color.toLowerCase()}.webp`}
              srcSet={`/images/campaign/${color.toLowerCase()}-640.webp 640w, /images/campaign/${color.toLowerCase()}.webp 1024w`}
              sizes="(max-width: 540px) 100vw, 50vw"
              alt=""
              width={1024}
              height={1536}
              fetchPriority={mode === color ? "high" : "low"}
              decoding="async"
              onLoad={(event) => void loaded(event.currentTarget, color)}
              onError={() => {
                setFailed((current) => ({ ...current, [color]: true }));
                onReady();
              }}
            />
            <svg
              className="campaign-print"
              viewBox="0 0 1024 1536"
              style={{ color: color === "Black" ? "#eeede8" : "#191918" }}
            >
              <CircleArtwork
                artwork="world"
                x={337}
                y={556}
                width={366}
                height={272}
              />
              <g
                fill="currentColor"
                fontFamily="Arial, sans-serif"
                fontSize={14}
                letterSpacing={7}
                textAnchor="middle"
              >
                <text x={520} y={873}>
                  A BRIGHTER
                </text>
                <text x={520} y={903}>
                  TOMORROW
                </text>
              </g>
            </svg>
          </div>
        ))}
      </div>
      {unavailable && (
        <span className="campaign-unavailable mono">
          Campaign photo unavailable
        </span>
      )}
    </div>
  );
}
