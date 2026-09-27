import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ColorwayPhoto from "../src/photography/ColorwayPhoto";
import type { Colorway } from "../src/collection";

const sources = {
  Black: { src: "/black.webp" },
  White: { src: "/white.webp" },
};
function photo(mode: Colorway, onReady = () => {}, imageSources = sources) {
  return (
    <ColorwayPhoto
      mode={mode}
      sources={imageSources}
      sizes="100vw"
      describe={(color) => `${color} hoodie`}
      label="Photo"
      className="test-photo"
      onReady={onReady}
    >
      <circle cx={10} cy={10} r={2} />
    </ColorwayPhoto>
  );
}
function pending(image: HTMLImageElement) {
  Object.defineProperties(image, {
    complete: { configurable: true, value: true },
    naturalWidth: { configurable: true, value: 1024 },
  });
  let resolve!: () => void;
  image.decode = vi.fn(
    () =>
      new Promise<void>((done) => {
        resolve = done;
      }),
  );
  fireEvent.load(image);
  return async () => {
    await act(async () => resolve());
  };
}
function images(container: HTMLElement) {
  return Array.from(container.querySelectorAll("img"));
}

describe("photo readiness", () => {
  it("keeps image, print and label together through delayed decoding and rapid mode changes", async () => {
    const ready = vi.fn();
    const { container, rerender } = render(photo("Black", ready));
    const [black, white] = images(container);
    const blackDone = pending(black);
    const whiteDone = pending(white);
    rerender(photo("White", ready));
    rerender(photo("Black", ready));
    expect(screen.getByRole("img").getAttribute("aria-busy")).toBe("true");
    await whiteDone();
    expect(screen.getByRole("img").getAttribute("aria-label")).toBe(
      "White hoodie",
    );
    expect(container.querySelector('[data-visible="true"] img')).toBe(white);
    expect(
      container.querySelector<SVGElement>('[data-visible="true"] svg')?.style
        .color,
    ).toBe("rgb(25, 25, 24)");
    await blackDone();
    expect(screen.getByRole("img").getAttribute("aria-label")).toBe(
      "Black hoodie",
    );
    expect(container.querySelector('[data-visible="true"] img')).toBe(black);
    expect(ready).toHaveBeenCalledTimes(1);
    rerender(photo("White", ready));
    expect(screen.getByRole("img").getAttribute("data-colorway")).toBe("White");
  });
  it("does not release the hero for one failed image while the fallback is still pending", async () => {
    const ready = vi.fn();
    const { container } = render(photo("Black", ready));
    const [black, white] = images(container);
    fireEvent.error(black);
    expect(ready).not.toHaveBeenCalled();
    const done = pending(white);
    await done();
    expect(screen.getByRole("img").getAttribute("data-colorway")).toBe("White");
    expect(ready).toHaveBeenCalledTimes(1);
  });
  it("handles both failures and ignores decode completion after an error", async () => {
    const ready = vi.fn();
    const { container } = render(photo("Black", ready));
    const [black, white] = images(container);
    const done = pending(black);
    fireEvent.error(black);
    fireEvent.error(white);
    await done();
    expect(screen.getByRole("img").getAttribute("aria-label")).toBe(
      "Photo unavailable",
    );
    expect(container.querySelector('[data-visible="true"]')).toBeNull();
    expect(ready).toHaveBeenCalledTimes(1);
  });
  it("discards an old source session and still accepts a loaded photo after decode rejection", async () => {
    const { container, rerender } = render(photo("Black"));
    const done = pending(images(container)[0]);
    rerender(
      photo("Black", undefined, {
        ...sources,
        Black: { src: "/new-black.webp" },
      }),
    );
    await done();
    expect(screen.getByRole("img").getAttribute("aria-busy")).toBe("true");
    const current = images(container)[0];
    Object.defineProperties(current, {
      complete: { value: true },
      naturalWidth: { value: 1024 },
    });
    current.decode = vi.fn().mockRejectedValue(new Error("interrupted"));
    await act(async () => {
      fireEvent.load(current);
    });
    expect(screen.getByRole("img").getAttribute("data-colorway")).toBe("Black");
  });
});
