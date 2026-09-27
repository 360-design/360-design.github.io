import { test } from "node:test";
import assert from "node:assert/strict";
import { artworkGrids, ringRadius, ringStroke } from "../src/artwork.ts";

test("all artwork circles use a square lattice with no duplicates or overlapping strokes", () => {
  const diameter = 2 * ringRadius + ringStroke;
  assert(diameter < 1, "Adjacent circles must have a visible gap");
  for (const [name, grid] of Object.entries(artworkGrids)) {
    assert(grid.cells.length > 0, `${name} must not be blank`);
    assert.equal(
      new Set(grid.cells.map(([x, y]) => `${x},${y}`)).size,
      grid.cells.length,
      name,
    );
    for (const [x, y] of grid.cells) {
      assert(
        Number.isInteger(x) && Number.isInteger(y),
        `${name}: off-grid circle`,
      );
      assert(
        x >= 0 && x < grid.columns && y >= 0 && y < grid.rows,
        `${name}: clipped circle`,
      );
    }
    for (let i = 0; i < grid.cells.length; i++) {
      for (let j = i + 1; j < grid.cells.length; j++) {
        assert(
          Math.hypot(
            grid.cells[i][0] - grid.cells[j][0],
            grid.cells[i][1] - grid.cells[j][1],
          ) > diameter,
          `${name}: overlapping circles`,
        );
      }
    }
  }
});

test("front circle uses the same annular grid as the story artwork", () => {
  assert.equal(artworkGrids.circle.columns, 21);
  assert.equal(artworkGrids.circle.rows, 21);
  const cells = new Set(artworkGrids.circle.cells.map(([x, y]) => `${x},${y}`));
  for (let y = 0; y < 21; y++) {
    for (let x = 0; x < 21; x++) {
      const distance = Math.hypot(x - 10, y - 10);
      assert.equal(cells.has(`${x},${y}`), distance > 6.5 && distance < 9.4);
    }
  }
});
