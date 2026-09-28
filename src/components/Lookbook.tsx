import type { Appearance } from "../appearance";
import {
  designs,
  type Design,
  type DesignId,
  type GarmentSelection,
} from "../collection";
import CircleArtwork from "./CircleArtwork";
import "./lookbook.css";
import ColorwayPhoto from "../photography/ColorwayPhoto";

type Look = {
  image: string;
  side: "Front" | "Back";
  x: number;
  y: number;
  width: number;
  height: number;
};

const looks: Partial<Record<DesignId, Look>> = {
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
function LookbookPhoto({
  design,
  selection,
  look,
}: {
  design: Design;
  selection: GarmentSelection;
  look: Look;
}) {
  const artwork = look.side === "Front" ? selection.mark : design.artwork;
  const source = (color: string) => ({
    src: `/images/lookbook/${look.image}-${color}.webp`,
    srcSet: `/images/lookbook/${look.image}-${color}-480.webp 480w, /images/lookbook/${look.image}-${color}-576.webp 576w, /images/lookbook/${look.image}-${color}-648.webp 648w, /images/lookbook/${look.image}-${color}-768.webp 768w, /images/lookbook/${look.image}-${color}.webp 1024w`,
  });
  return (
    <ColorwayPhoto
      mode={selection.color}
      sources={{ Black: source("black"), White: source("white") }}
      sizes="(max-width: 524px) calc(100vw - 44px), (max-width: 767px) 480px, min(41.769vw, 573.3px)"
      className="lookbook-photo"
      label={`${design.type} photo`}
      describe={(color) =>
        `${look.side} view of a model wearing the ${color.toLowerCase()} ${design.type}, with ${look.side === "Front" ? `${selection.mark} artwork on the wearer's left chest` : `${design.name} circle artwork on the back`}`
      }
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
    </ColorwayPhoto>
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
            01 / THE LOOKBOOK
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
        {designs.map((design) => {
          const look = looks[design.id];
          if (!look) return null;
          return (
            <figure
              className="lookbook-look"
              key={design.id}
              data-look={design.id}
              data-reveal="image"
            >
              <LookbookPhoto
                design={design}
                selection={selections[design.id]}
                look={look}
              />
              <figcaption>
                <div>
                  <span className="mono lookbook-number">{design.id}</span>
                  <span>{design.name}</span>
                </div>
                <span className="mono lookbook-detail">
                  {design.type} / {look.side}
                </span>
              </figcaption>
            </figure>
          );
        })}
      </div>
    </section>
  );
}
