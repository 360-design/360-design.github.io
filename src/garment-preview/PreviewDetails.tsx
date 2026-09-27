import type { Design, GarmentSelection } from "../collection";
import CircleArtwork from "../components/CircleArtwork";
import ColorSwatches from "../components/ColorSwatches";

export default function PreviewDetails({
  design,
  selection,
  onSelectionChange,
}: {
  design: Design;
  selection: GarmentSelection;
  onSelectionChange: (update: Partial<GarmentSelection>) => void;
}) {
  return (
    <div className="dialog-copy">
      <p className="mono">COLLECTION 001 / {design.id}</p>
      <h2 id="dialog-title">{design.name}</h2>
      <p className="dialog-type">{design.type}</p>
      <p>{design.description}</p>
      <div className="dialog-color">
        <span className="mono">{selection.color.toUpperCase()}</span>
        <ColorSwatches
          color={selection.color}
          onChange={(color) => onSelectionChange({ color })}
          name={design.type}
        />
      </div>
      <fieldset className="chest-mark-options">
        <legend className="mono">YOUR FRONT MARK</legend>
        <div className="chest-mark-choices">
          {(["circle", "360"] as const).map((mark) => (
            <button
              key={mark}
              type="button"
              aria-pressed={selection.mark === mark}
              onClick={() => {
                onSelectionChange({ mark });
              }}
            >
              <CircleArtwork artwork={mark} width={51} height={20} />
              <span className="mono">
                {mark === "circle" ? "CIRCLE" : "360 LOGO"}
              </span>
            </button>
          ))}
        </div>
        <p>
          Small mark on your left chest. The full artwork stays on the back.
        </p>
      </fieldset>
      <div className="coming-note">
        <span className="tiny-ring" />
        <div>
          <span className="mono">STILL TAKING SHAPE</span>
          <p>
            This is an early design preview. The first collection is coming
            soon.
          </p>
        </div>
      </div>
    </div>
  );
}
