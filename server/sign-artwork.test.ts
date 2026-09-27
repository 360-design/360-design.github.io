import { test } from "node:test";
import assert from "node:assert/strict";
import { artworkGrids } from "../src/artwork.ts";
import { signDesigns, signSize } from "../src/sign-artwork.ts";

test("the sign includes every garment design and logo without losing source cells", () => {
  assert.deepEqual(
    new Set(signDesigns.map((d) => d.id)),
    new Set(Object.keys(artworkGrids)),
  );
  for (const { id, cells } of signDesigns) {
    const source = artworkGrids[id];
    const ratio = cells.size / source.cells.length;
    assert(
      Number.isInteger(Math.sqrt(ratio)) && ratio >= 1,
      `${id}: source details lost`,
    );
    for (const cell of cells) {
      assert(Number.isInteger(cell));
      const x = cell % signSize,
        y = Math.floor(cell / signSize);
      assert(
        x > 0 && x < signSize - 1 && y > 0 && y < signSize - 1,
        `${id}: clipped light`,
      );
    }
  }
});

test("smiley mouth stays connected after placement on the sign", () => {
  const smiley = signDesigns.find((d) => d.id === "smiley")!;
  // The 31x31 smiley is centred without resampling in the 49x49 sign.
  const offset = (signSize - artworkGrids.smiley.columns) / 2;
  const mouth = new Set(
    [...smiley.cells].filter((cell) => {
      const x = (cell % signSize) - offset,
        y = Math.floor(cell / signSize) - offset;
      return y >= 18 && Math.hypot(x - 15, y - 15) < 11;
    }),
  );
  assert.equal(mouth.size, 25);
  const remaining = new Set(mouth);
  const queue = [remaining.values().next().value!];
  while (queue.length) {
    const cell = queue.pop()!;
    if (!remaining.delete(cell)) continue;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const next = cell + dy * signSize + dx;
        if (remaining.has(next)) queue.push(next);
      }
    }
  }
  assert.equal(remaining.size, 0, "Mouth has disconnected lights");
});
