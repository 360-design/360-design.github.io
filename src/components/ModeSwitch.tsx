import type { Colorway } from "../collection";
import "./mode-switch.css";

export type ModeSwitchProps = {
  mode: Colorway;
  onModeChange: (mode: Colorway) => void;
};

// Hollow rings on one square lattice, including the filament and light rays.
const bulb = [
  "000111000",
  "001000100",
  "010000010",
  "100000001",
  "100000001",
  "100000001",
  "010000010",
  "001000100",
  "001000100",
  "000111000",
  "000101000",
  "000111000",
];
const filament = [
  [3, 4],
  [5, 4],
  [4, 5],
  [4, 6],
  [4, 7],
];
const rays = [
  [4, -3],
  [4, -2],
  [-2, 0],
  [-1, 1],
  [9, 1],
  [10, 0],
  [-3, 4],
  [-2, 4],
  [10, 4],
  [11, 4],
];

export default function ModeSwitch({ mode, onModeChange }: ModeSwitchProps) {
  const lit = mode === "White";
  return (
    <button
      className="mode-switch"
      type="button"
      role="switch"
      aria-checked={lit}
      aria-label="Light mode"
      title={lit ? "Switch to Black mode" : "Switch to White mode"}
      onClick={() => onModeChange(lit ? "Black" : "White")}
    >
      <svg
        viewBox="-4 -4 17 17"
        fill="none"
        stroke="currentColor"
        strokeWidth=".16"
        aria-hidden="true"
      >
        <g className="bulb-outline">
          {bulb.flatMap((row, y) =>
            [...row].map((cell, x) =>
              cell === "1" ? (
                <circle key={`${x}-${y}`} cx={x} cy={y} r=".3" />
              ) : null,
            ),
          )}
        </g>
        <g className="bulb-filament">
          {filament.map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r=".3" />
          ))}
        </g>
        <g className="bulb-rays">
          {rays.map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r=".3" />
          ))}
        </g>
      </svg>
    </button>
  );
}
