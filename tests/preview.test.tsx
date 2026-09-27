import { StrictMode, useState } from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";
import GarmentPreview from "../src/garment-preview/GarmentPreview";
import { designs, type GarmentSelection } from "../src/collection";

let resize: () => void;
beforeEach(() => {
  const focus = HTMLElement.prototype.focus;
  vi.spyOn(HTMLElement.prototype, "focus").mockImplementation(function (
    this: HTMLElement,
    options?: FocusOptions,
  ) {
    const modal = document.querySelector("dialog[open]");
    // Native modal dialogs make everything outside them inert. Preserve this
    // rule during StrictMode replay so cleanup cannot overwrite the opener.
    if (!modal || modal.contains(this)) focus.call(this, options);
  });
  vi.stubGlobal("matchMedia", () => ({ matches: true }));
  vi.stubGlobal(
    "ResizeObserver",
    class {
      constructor(callback: () => void) {
        resize = callback;
      }
      observe() {}
      disconnect() {}
    },
  );
  HTMLDialogElement.prototype.showModal = function () {
    this.open = true;
  };
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
    width: 400,
    height: 500,
    x: 0,
    y: 0,
    left: 0,
    top: 0,
    right: 400,
    bottom: 500,
    toJSON() {},
  });
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(400);
  HTMLElement.prototype.scrollTo = function (
    options: ScrollToOptions | number = {},
  ) {
    this.scrollLeft =
      typeof options === "number" ? options : (options.left ?? 0);
    fireEvent.scroll(this);
  };
  HTMLElement.prototype.setPointerCapture = vi.fn();
  HTMLElement.prototype.hasPointerCapture = () => true;
  HTMLElement.prototype.releasePointerCapture = vi.fn();
});
function Host() {
  const [open, setOpen] = useState(false);
  const [selection, setSelection] = useState<GarmentSelection>({
    color: "Black",
    mark: "circle",
  });
  return (
    <>
      <button onClick={() => setOpen(true)}>Open garment</button>
      {open && (
        <GarmentPreview
          design={designs[0]}
          selection={selection}
          onSelectionChange={(update) =>
            setSelection((old) => ({ ...old, ...update }))
          }
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
function open() {
  const result = render(
    <StrictMode>
      <Host />
    </StrictMode>,
  );
  const opener = screen.getByRole("button", { name: "Open garment" });
  opener.focus();
  fireEvent.click(opener);
  return { ...result, opener };
}
function stage(side: string) {
  return screen.getByRole("button", { name: new RegExp(`^${side} of`) });
}
function zoom() {
  fireEvent.click(screen.getByRole("button", { name: "ZOOM IN" }));
}

it("resets zoom for choices without replacing focused controls, and previews a chosen chest mark on the front", () => {
  open();
  zoom();
  const mark = screen.getByRole("button", { name: "360 LOGO" });
  mark.focus();
  fireEvent.click(mark);
  expect(
    screen.getByRole("button", { name: "Front" }).getAttribute("aria-pressed"),
  ).toBe("true");
  expect(screen.getByRole("button", { name: "ZOOM IN" })).toBeTruthy();
  expect(document.activeElement).toBe(mark);
  zoom();
  fireEvent.click(
    screen.getByRole("button", { name: "World hoodie in White" }),
  );
  expect(screen.getByRole("button", { name: "ZOOM IN" })).toBeTruthy();
  expect(stage("Front").querySelector("img")?.src).toContain("white");
  expect(mark.getAttribute("aria-pressed")).toBe("true");
  // Choosing the same mark must also end inspection.
  zoom();
  fireEvent.click(mark);
  expect(screen.getByRole("button", { name: "ZOOM IN" })).toBeTruthy();
});
it("settles native swipes, moves keyboard focus with the side, and realigns after resizing", () => {
  const { container } = open();
  stage("Back").focus();
  fireEvent.keyDown(stage("Back"), { key: "ArrowRight" });
  expect(document.activeElement).toBe(stage("Front"));
  const rail = container.querySelector<HTMLElement>(".gallery-rail")!;
  rail.scrollLeft = 0;
  fireEvent.scroll(rail);
  expect(stage("Back").tabIndex).toBe(0);
  zoom();
  act(() => resize());
  expect(screen.getByRole("button", { name: "ZOOM IN" })).toBeTruthy();
  expect(rail.scrollLeft).toBe(0);
});
it("uses the first Escape to exit zoom even outside the image, then closes and restores focus", () => {
  const { opener } = open();
  zoom();
  const close = screen.getByRole("button", { name: "Close preview" });
  close.focus();
  expect(fireEvent.keyDown(close, { key: "Escape" })).toBe(false);
  expect(screen.getByRole("dialog")).toBeTruthy();
  expect(screen.getByRole("button", { name: "ZOOM IN" })).toBeTruthy();
  expect(fireEvent.keyDown(close, { key: "Escape" })).toBe(true);
  // jsdom has no native Escape default action; emulate cancel + close.
  const dialog = screen.getByRole("dialog");
  expect(fireEvent(dialog, new Event("cancel", { cancelable: true }))).toBe(
    true,
  );
  fireEvent(dialog, new Event("close"));
  expect(screen.queryByRole("dialog")).toBeNull();
  expect(document.activeElement).toBe(opener);
  fireEvent.click(opener);
  expect(stage("Back").getAttribute("aria-pressed")).toBe("false");
});
it("zooms around the tapped point and clamps dragging; changing a choice releases pointer capture", () => {
  const { container } = open();
  const back = stage("Back");
  fireEvent.click(back, { detail: 1, clientX: 0, clientY: 0 });
  const layer = back.querySelector<HTMLElement>(".gallery-zoom-layer")!;
  expect(layer.style.transform).toBe("translate(300px, 375px) scale(2.5)");
  fireEvent.pointerDown(back, {
    isPrimary: true,
    button: 0,
    pointerId: 1,
    clientX: 0,
    clientY: 0,
  });
  fireEvent.pointerMove(back, { pointerId: 1, clientX: -2000, clientY: -2000 });
  expect(layer.style.transform).toBe("translate(-300px, -375px) scale(2.5)");
  fireEvent.click(
    screen.getByRole("button", { name: "World hoodie in White" }),
  );
  expect(back.releasePointerCapture).toHaveBeenCalledWith(1);
  expect(container.querySelector('[data-dragging="true"]')).toBeNull();
  expect(layer.style.transform).toBe("translate(0px, 0px) scale(1)");
});
