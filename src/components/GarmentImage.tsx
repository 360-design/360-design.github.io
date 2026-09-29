import { memo } from "react";
import type { Design, GarmentSelection, GarmentView } from "../collection";
import CircleArtwork from "./CircleArtwork";

export default memo(function GarmentImage({
  design,
  selection,
  view = "Back",
  preview = false,
}: {
  design: Design;
  selection: GarmentSelection;
  view?: GarmentView;
  preview?: boolean;
}) {
  const color = selection.color.toLowerCase();
  const filename = `${design.garment}-${color}-${view.toLowerCase()}`;
  const detail =
    view === "Back"
      ? `${design.name} circle artwork on the back`
      : `${selection.mark === "circle" ? "a ring made of small grid-aligned circles" : "a small circle-built 360 logo"} on the wearer's left chest`;
  const description = `${selection.color} ${design.type}, ${view.toLowerCase()} view with ${detail}`;
  return (
    <span className="garment-image" role="img" aria-label={description}>
      <img
        className="garment-photo"
        src={`/images/garment-blanks/${filename}.webp`}
        srcSet={
          preview
            ? undefined
            : `/images/garment-blanks/${filename}-384.webp 384w, /images/garment-blanks/${filename}-640.webp 640w, /images/garment-blanks/${filename}.webp 1024w`
        }
        sizes={preview ? undefined : "(max-width: 767px) 50vw, 25vw"}
        alt={description}
        aria-hidden="true"
        width={1024}
        height={1536}
        loading={preview ? "eager" : "lazy"}
        decoding="async"
      />
      <svg
        className="garment-print"
        viewBox="0 0 1024 1536"
        aria-hidden="true"
        style={{ color: selection.color === "Black" ? "#f0efe9" : "#161615" }}
      >
        {view === "Front" ? (
          <CircleArtwork
            artwork={selection.mark}
            x={design.garment === "hoodie" ? 618 : 610}
            y={design.garment === "hoodie" ? 522 : 486}
            width={88}
            height={88}
          />
        ) : design.artwork === "world" ? (
          <>
            <CircleArtwork
              artwork="world"
              x={264}
              y={518}
              width={496}
              height={390}
            />
            <text
              x={512}
              y={986}
              textAnchor="middle"
              fill="currentColor"
              fontFamily="Arial, sans-serif"
              fontSize={19}
              letterSpacing={9}
            >
              A BRIGHTER
            </text>
            <text
              x={512}
              y={1024}
              textAnchor="middle"
              fill="currentColor"
              fontFamily="Arial, sans-serif"
              fontSize={19}
              letterSpacing={9}
            >
              TOMORROW
            </text>
          </>
        ) : design.artwork === "butterfly" ? (
          <>
            <CircleArtwork
              artwork="butterfly"
              x={280}
              y={525}
              width={464}
              height={360}
            />
            <text
              x={512}
              y={929}
              textAnchor="middle"
              fill="currentColor"
              fontFamily="Arial, sans-serif"
              fontSize={21}
              letterSpacing={12}
            >
              CHANGE
            </text>
          </>
        ) : design.artwork === "360" ? (
          <g transform="translate(617 440) rotate(90)">
            <CircleArtwork artwork="360" width={510} height={210} />
          </g>
        ) : (
          <CircleArtwork
            artwork={design.artwork}
            x={302}
            y={455}
            width={420}
            height={design.artwork === "time" ? 450 : 420}
          />
        )}
      </svg>
    </span>
  );
});
