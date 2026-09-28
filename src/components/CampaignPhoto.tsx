import type { Colorway } from "../collection";
import CircleArtwork from "./CircleArtwork";
import ColorwayPhoto from "../photography/ColorwayPhoto";
import "./campaign-photo.css";

const sources = {
  Black: {
    src: "/images/campaign/black.webp",
    srcSet:
      "/images/campaign/black-640.webp 640w, /images/campaign/black-672.webp 672w, /images/campaign/black-736.webp 736w, /images/campaign/black-832.webp 832w, /images/campaign/black.webp 1024w",
  },
  White: {
    src: "/images/campaign/white.webp",
    srcSet:
      "/images/campaign/white-640.webp 640w, /images/campaign/white-672.webp 672w, /images/campaign/white-736.webp 736w, /images/campaign/white-832.webp 832w, /images/campaign/white.webp 1024w",
  },
};
export default function CampaignPhoto({
  mode,
  onReady,
}: {
  mode: Colorway;
  onReady: () => void;
}) {
  return (
    <ColorwayPhoto
      mode={mode}
      sources={sources}
      sizes="(max-width: 540px) 100vw, 50vw"
      className="campaign-photo"
      sceneClassName="campaign-scene"
      priority
      onReady={onReady}
      label="Campaign photo"
      describe={(color) =>
        `Back view of a model wearing a ${color.toLowerCase()} 360 hoodie with a precise circle-grid world map and A brighter tomorrow slogan`
      }
    >
      <CircleArtwork artwork="world" x={337} y={556} width={366} height={272} />
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
    </ColorwayPhoto>
  );
}
