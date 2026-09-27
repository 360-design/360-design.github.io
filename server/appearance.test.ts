import { test } from "node:test";
import assert from "node:assert/strict";
import { appearanceReducer, createAppearance } from "../src/appearance.ts";
import { designs } from "../src/collection.ts";

test("a saved page mode initializes every garment in its matching colour", () => {
  for (const mode of ["Black", "White"] as const) {
    const state = createAppearance(mode);
    assert.equal(state.mode, mode);
    assert.deepEqual(
      Object.values(state.selections).map((s) => s.color),
      Array(designs.length).fill(mode),
    );
  }
});

test("switching page mode changes every colour and preserves each chest mark", () => {
  const original = appearanceReducer(createAppearance("Black"), {
    type: "garment",
    id: "02",
    update: { mark: "360" },
  });
  const white = appearanceReducer(original, { type: "mode", mode: "White" });
  assert.equal(white.mode, "White");
  assert(Object.values(white.selections).every((s) => s.color === "White"));
  assert.equal(white.selections["02"].mark, "360");
  assert.equal(white.selections["01"].mark, "circle");
  assert.equal(original.selections["02"].color, "Black");
  const black = appearanceReducer(white, { type: "mode", mode: "Black" });
  assert(Object.values(black.selections).every((s) => s.color === "Black"));
  assert.equal(black.selections["02"].mark, "360");
});

test("individual colour choices leave the page and other garments alone", () => {
  const state = appearanceReducer(createAppearance("White"), {
    type: "garment",
    id: "03",
    update: { color: "Black" },
  });
  assert.equal(state.mode, "White");
  assert.equal(state.selections["03"].color, "Black");
  assert.equal(state.selections["01"].color, "White");
  const restored = appearanceReducer(state, { type: "mode", mode: "White" });
  assert(Object.values(restored.selections).every((s) => s.color === "White"));
});
