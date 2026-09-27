import type { Colorway } from "../collection";
export default function ColorSwatches({
  color,
  onChange,
  name,
}: {
  color: Colorway;
  onChange: (color: Colorway) => void;
  name: string;
}) {
  return (
    <div className="swatches" role="group" aria-label={`${name} colorway`}>
      {(["Black", "White"] as const).map((value) => (
        <button
          key={value}
          className={`swatch ${value.toLowerCase()}`}
          aria-label={`${name} in ${value}`}
          aria-pressed={value === color}
          onClick={() => onChange(value)}
        >
          <span />
        </button>
      ))}
    </div>
  );
}
