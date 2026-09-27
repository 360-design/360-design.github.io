import { useState } from "react";
import type { Appearance } from "../appearance";
import {
  designs,
  type Colorway,
  type Design,
  type DesignId,
  type GarmentSelection,
} from "../collection";
import CircleArtwork from "./CircleArtwork";
import "./lookbook.css";

const looks: Record<
  DesignId,
  {
    image: string;
    side: "Front" | "Back";
    x: number;
    y: number;
    width: number;
    height: number;
  }
> = {
  "01": {
    image: "world-front",
    side: "Front",
    x: 627,
    y: 556,
    width: 64,
    height: 64,
  },
  "02": {
    image: "time-back",
    side: "Back",
    x: 390,
    y: 470,
    width: 250,
    height: 300,
  },
  "03": {
    image: "smiley-back",
    side: "Back",
    x: 388,
    y: 340,
    width: 255,
    height: 255,
  },
  "04": {
    image: "butterfly-back",
    side: "Back",
    x: 365,
    y: 585,
    width: 325,
    height: 290,
  },
};
const colors: Colorway[] = ["Black", "White"];

function LookbookPhoto({
  design,
  selection,
}: {
  design: Design;
  selection: GarmentSelection;
}) {
  const [ready, setReady] = useState({ Black: false, White: false });
  const [failed, setFailed] = useState({ Black: false, White: false });
  const other = selection.color === "Black" ? "White" : "Black";
  const shown = ready[selection.color]
    ? selection.color
    : ready[other]
      ? other
      : null;
  const unavailable = failed.Black && failed.White;
  const look = looks[design.id];
  const artwork = look.side === "Front" ? selection.mark : design.artwork;

  async function loaded(image: HTMLImageElement, color: Colorway) {
    try {
      await image.decode();
    } catch {
      // A successful load still provides a usable image when decode is interrupted.
    }
    setReady((current) => ({ ...current, [color]: true }));
  }

  return (
    <div
      className="lookbook-photo"
      role="img"
      aria-label={
        shown
          ? `${look.side} view of a model wearing the ${shown.toLowerCase()} ${design.type}, with ${look.side === "Front" ? `${selection.mark} artwork on the wearer's left chest` : `${design.name} circle artwork on the back`}`
          : `${design.type} photo ${unavailable ? "unavailable" : "loading"}`
      }
      aria-busy={shown === null && !unavailable}
      data-colorway={shown ?? "loading"}
    >
      {colors.map((color) => (
        <div
          className="lookbook-colorway"
          key={color}
          data-visible={shown === color}
          aria-hidden="true"
        >
          <img
            src={`/images/lookbook/${look.image}-${color.toLowerCase()}.webp`}
            srcSet={`/images/lookbook/${look.image}-${color.toLowerCase()}-480.webp 480w, /images/lookbook/${look.image}-${color.toLowerCase()}-768.webp 768w, /images/lookbook/${look.image}-${color.toLowerCase()}.webp 1024w`}
            sizes="(max-width: 524px) calc(100vw - 44px), (max-width: 767px) 480px, (max-width: 1508px) 42vw, 574px"
            alt=""
            width={1024}
            height={1536}
            loading="lazy"
            decoding="async"
            onLoad={(event) => void loaded(event.currentTarget, color)}
            onError={() =>
              setFailed((current) => ({ ...current, [color]: true }))
            }
          />
          <svg
            className="lookbook-print"
            viewBox="0 0 1024 1536"
            style={{ color: color === "Black" ? "#eeede8" : "#191918" }}
          >
            <CircleArtwork
              artwork={artwork}
              x={look.x}
              y={look.y}
              width={look.width}
              height={look.height}
            />
            {design.artwork === "butterfly" && (
              <text
                x={527.5}
                y={925}
                textAnchor="middle"
                fill="currentColor"
                fontFamily="Arial, sans-serif"
                fontSize={15}
                letterSpacing={8}
              >
                CHANGE
              </text>
            )}
          </svg>
        </div>
      ))}
      {unavailable && (
        <span className="lookbook-unavailable mono">Photo unavailable</span>
      )}
    </div>
  );
}

export default function Lookbook({
  selections,
}: {
  selections: Appearance["selections"];
}) {
  return (
    <section
      className="lookbook section-pad"
      id="lookbook"
      aria-labelledby="lookbook-title"
    >
      <div className="lookbook-heading">
        <div>
          <p className="mono eyebrow" data-reveal="text">
            03 / THE LOOKBOOK
          </p>
          <h2 id="lookbook-title" data-reveal="text" data-reveal-order="1">
            One shape.
            <br />
            <span>A different perspective.</span>
          </h2>
        </div>
        <p className="lookbook-intro" data-reveal="text" data-reveal-order="2">
          The first collection, in motion.
          <br />A closer look at what’s taking shape.
        </p>
      </div>
      <div className="lookbook-grid">
        {designs.map((design) => (
          <figure
            className="lookbook-look"
            key={design.id}
            data-look={design.id}
            data-reveal="image"
          >
            <LookbookPhoto design={design} selection={selections[design.id]} />
            <figcaption>
              <div>
                <span className="mono lookbook-number">{design.id}</span>
                <span>{design.name}</span>
              </div>
              <span className="mono lookbook-detail">
                {design.type} / {looks[design.id].side}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
