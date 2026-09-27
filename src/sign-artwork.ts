import { artworkGrids } from "./artwork.ts";

export const signSize = 49;
export const signInterval = 4000;

// Integer enlargement preserves every source cell, including thin lettering
// and the smiley's mouth. No rows or columns are dropped by downsampling.
export const signDesigns = (
  ["circle", "world", "time", "smiley", "butterfly", "360"] as const
).map((id) => {
  const source = artworkGrids[id];
  const scale = Math.floor(
    (signSize - 2) / Math.max(source.columns, source.rows),
  );
  const left = Math.floor((signSize - source.columns * scale) / 2);
  const top = Math.floor((signSize - source.rows * scale) / 2);
  const cells = new Set<number>();
  for (const [x, y] of source.cells) {
    for (let dy = 0; dy < scale; dy++) {
      for (let dx = 0; dx < scale; dx++) {
        cells.add((top + y * scale + dy) * signSize + left + x * scale + dx);
      }
    }
  }
  return { id, cells };
});
