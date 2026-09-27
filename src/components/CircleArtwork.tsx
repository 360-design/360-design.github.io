import { artworkGrids, ringRadius, ringStroke } from "../artwork";

export default function CircleArtwork({
  artwork,
  x = 0,
  y = 0,
  width,
  height,
}: {
  artwork: keyof typeof artworkGrids;
  x?: number;
  y?: number;
  width: number;
  height: number;
}) {
  const grid = artworkGrids[artwork];
  return (
    <svg
      x={x}
      y={y}
      width={width}
      height={height}
      viewBox={`-0.5 -0.5 ${grid.columns} ${grid.rows}`}
      fill="none"
      aria-hidden="true"
      data-artwork={artwork}
    >
      {grid.cells.map(([cx, cy]) => (
        <circle
          key={`${cx}-${cy}`}
          cx={cx}
          cy={cy}
          r={ringRadius}
          stroke="currentColor"
          strokeWidth={ringStroke}
        />
      ))}
    </svg>
  );
}
