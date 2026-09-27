import { test } from "node:test";
import assert from "node:assert/strict";
import { clampPan, zoomAt } from "../src/gallery-geometry.ts";

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
