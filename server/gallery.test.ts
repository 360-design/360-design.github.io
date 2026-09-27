import { test } from "node:test";
import assert from "node:assert/strict";
import { clampPan, zoomAt } from "../src/garment-preview/geometry.ts";

test("zoomed image cannot be dragged beyond its edges", () => {
  assert.deepEqual(clampPan(999, -999, 320, 480), { x: 240, y: -360 });
  assert.deepEqual(clampPan(-999, 999, 320, 480), { x: -240, y: 360 });
  assert.deepEqual(clampPan(40, -70, 320, 480), { x: 40, y: -70 });
});

test("zoom keeps the tapped point in place, including the left-chest mark", () => {
  assert.deepEqual(zoomAt(160, 240, 320, 480), { x: 0, y: 0 });
  assert.deepEqual(zoomAt(208, 168, 320, 480), { x: -72, y: 108 });
  assert.deepEqual(zoomAt(0, 0, 320, 480), { x: 240, y: 360 });
});

test("pan limits follow the contained photo when the preview height is capped", () => {
  // A 2:3 photo in a 400x500 stage is 333 1/3px wide, not 400px.
  // At 2.5x zoom, panning past 216 2/3px would expose empty space.
  const pan = clampPan(999, -999, 400, 500);
  assert(Math.abs(pan.x - 216.66666666666669) < 0.001);
  assert.equal(pan.y, -375);
  assert.deepEqual(clampPan(999, 999, 1000, 200), { x: 0, y: 150 });
});
