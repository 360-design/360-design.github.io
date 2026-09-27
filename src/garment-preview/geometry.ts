export const zoomScale = 2.5;

export function clampPan(x: number, y: number, width: number, height: number) {
  // The shared 2:3 photo and print use object-fit: contain. Height caps can
  // leave space beside the photo; pan against its painted edges, not the stage.
  const photoWidth = Math.min(width, (height * 2) / 3);
  const photoHeight = Math.min(height, (width * 3) / 2);
  const limitX = Math.max(0, (photoWidth * zoomScale - width) / 2);
  const limitY = Math.max(0, (photoHeight * zoomScale - height) / 2);
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
