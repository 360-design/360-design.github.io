export const zoomScale = 2.5;

export function clampPan(x: number, y: number, width: number, height: number) {
  const limitX = (width * (zoomScale - 1)) / 2;
  const limitY = (height * (zoomScale - 1)) / 2;
  return {
    x: Math.max(-limitX, Math.min(limitX, x)),
    y: Math.max(-limitY, Math.min(limitY, y)),
  };
}

export function zoomAt(x: number, y: number, width: number, height: number) {
  return clampPan(
    (width / 2 - x) * (zoomScale - 1),
    (height / 2 - y) * (zoomScale - 1),
    width,
    height,
  );
}
