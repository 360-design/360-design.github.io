import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import {
  X,
  MagnifyingGlassPlus,
  MagnifyingGlassMinus,
} from "@phosphor-icons/react";
import type { Design, GarmentSelection, GarmentView } from "../collection";
import { clampPan, zoomAt, zoomScale } from "./geometry";
import GarmentImage from "../components/GarmentImage";
import "./garment-gallery.css";
import PreviewDetails from "./PreviewDetails";

type Zoom = { kind: "fit" } | { kind: "zoom"; x: number; y: number };
type Drag = {
  target: HTMLElement;
  id: number;
  x: number;
  y: number;
  panX: number;
  panY: number;
};
const views: GarmentView[] = ["Back", "Front"];

type Props = {
  design: Design;
  selection: GarmentSelection;
  onSelectionChange: (update: Partial<GarmentSelection>) => void;
  onClose: () => void;
};

export default function GarmentPreview(props: Props) {
  return <PreviewSession key={props.design.id} {...props} />;
}

function PreviewSession({
  design,
  selection,
  onSelectionChange,
  onClose,
}: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const [view, setView] = useState<GarmentView>("Back");
  useEffect(() => {
    const element = dialog.current!;
    if (!opener.current && document.activeElement instanceof HTMLElement) {
      opener.current = document.activeElement;
    }
    if (!element.open) element.showModal();
    element.querySelector<HTMLButtonElement>(".dialog-close")?.focus();
    // Removing the dialog also removes it from the browser's modal top layer.
    // Keeping close() out of cleanup avoids a queued close event during StrictMode replay.
    return () => {
      if (opener.current?.isConnected)
        opener.current.focus({ preventScroll: true });
    };
  }, []);
  const rail = useRef<HTMLDivElement>(null);
  const drag = useRef<Drag | null>(null);
  const moved = useRef(false);
  const [zoom, setZoom] = useState<Zoom>({ kind: "fit" });
  const [dragging, setDragging] = useState(false);
  const zoomed = zoom.kind === "zoom";

  function resetInspection() {
    const active = drag.current;
    drag.current = null;
    if (active?.target.hasPointerCapture(active.id))
      active.target.releasePointerCapture(active.id);
    moved.current = false;
    setDragging(false);
    setZoom({ kind: "fit" });
  }

  useEffect(() => {
    resetInspection();
  }, [selection.color, selection.mark]);

  useEffect(() => {
    const element = rail.current;
    if (!element) return;
    // Initial positioning and resizes are instantaneous; buttons animate via
    // scrollTo below. Native swipes provide their own scrolling physics.
    const align = () => {
      element.scrollLeft = view === "Back" ? 0 : element.clientWidth;
    };
    align();
    resetInspection();
    if (element.contains(document.activeElement)) {
      element
        .querySelector<HTMLElement>(`[data-side="${view}"]`)
        ?.focus({ preventScroll: true });
    }
    const observer = new ResizeObserver(() => {
      align();
      resetInspection();
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [view]);

  function changeView(side: GarmentView) {
    resetInspection();
    const element = rail.current;
    if (!element) return;
    element.scrollTo({
      left: side === "Back" ? 0 : element.clientWidth,
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }

  function toggleZoom(stage: HTMLElement, point?: { x: number; y: number }) {
    if (zoomed) {
      setZoom({ kind: "fit" });
      return;
    }
    const rect = stage.getBoundingClientRect();
    const position = point ?? {
      x: rect.width * (view === "Front" ? 0.645 : 0.5),
      y: rect.height * (view === "Front" ? 0.35 : 0.46),
    };
    setZoom({
      kind: "zoom",
      ...zoomAt(position.x, position.y, rect.width, rect.height),
    });
  }

  function pointerDown(event: PointerEvent<HTMLDivElement>) {
    if (!event.isPrimary || event.button !== 0) return;
    moved.current = false;
    drag.current = {
      target: event.currentTarget,
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      panX: zoomed ? zoom.x : 0,
      panY: zoomed ? zoom.y : 0,
    };
    if (zoomed) {
      event.currentTarget.setPointerCapture(event.pointerId);
      setDragging(true);
    }
  }

  function pointerMove(event: PointerEvent<HTMLDivElement>) {
    const start = drag.current;
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.hypot(dx, dy) > 6) moved.current = true;
    if (zoomed) {
      const rect = event.currentTarget.getBoundingClientRect();
      setZoom({
        kind: "zoom",
        ...clampPan(start.panX + dx, start.panY + dy, rect.width, rect.height),
      });
    }
  }

  function keyboard(event: KeyboardEvent<HTMLDivElement>) {
    if (["Enter", " ", "+", "=", "-"].includes(event.key)) {
      event.preventDefault();
      if (event.key === "-") setZoom({ kind: "fit" });
      else toggleZoom(event.currentTarget);
    } else if (
      ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)
    ) {
      if (!zoomed && (event.key === "ArrowUp" || event.key === "ArrowDown"))
        return;
      event.preventDefault();
      if (zoomed) {
        const rect = event.currentTarget.getBoundingClientRect();
        const dx =
          event.key === "ArrowLeft" ? 60 : event.key === "ArrowRight" ? -60 : 0;
        const dy =
          event.key === "ArrowUp" ? 60 : event.key === "ArrowDown" ? -60 : 0;
        setZoom({
          kind: "zoom",
          ...clampPan(zoom.x + dx, zoom.y + dy, rect.width, rect.height),
        });
      } else changeView(event.key === "ArrowLeft" ? "Back" : "Front");
    }
  }

  return (
    <dialog
      ref={dialog}
      className="product-dialog"
      aria-labelledby="dialog-title"
      onClose={onClose}
      onCancel={(event) => {
        if (zoomed) {
          event.preventDefault();
          resetInspection();
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && zoomed) {
          event.preventDefault();
          event.stopPropagation();
          resetInspection();
        }
      }}
      onClick={(event) => {
        if (event.target === dialog.current) onClose();
      }}
    >
      <div className="dialog-close-bar">
        <button
          className="dialog-close icon-button"
          onClick={onClose}
          aria-label="Close preview"
        >
          <X size={24} />
        </button>
      </div>
      <div className="dialog-layout">
        <div className="dialog-photo">
          <div className="garment-gallery" data-zoomed={zoomed}>
            <div className="gallery-toolbar">
              <span className="mono" role="status">
                {view.toUpperCase()} / {view === "Back" ? "01" : "02"}
              </span>
              <button
                className="gallery-zoom mono"
                aria-pressed={zoomed}
                onClick={() => {
                  const stage = rail.current?.querySelector<HTMLElement>(
                    `[data-side="${view}"]`,
                  );
                  if (stage) toggleZoom(stage);
                }}
              >
                {zoomed ? (
                  <MagnifyingGlassMinus size={18} />
                ) : (
                  <MagnifyingGlassPlus size={18} />
                )}
                {zoomed ? "ZOOM OUT" : "ZOOM IN"}
              </button>
            </div>
            <div
              className="gallery-rail"
              ref={rail}
              onScroll={(event) => {
                const element = event.currentTarget;
                if (element.clientWidth === 0 || zoomed) return;
                const index = Math.round(
                  element.scrollLeft / element.clientWidth,
                );
                const side = index === 0 ? "Back" : "Front";
                if (
                  Math.abs(element.scrollLeft - index * element.clientWidth) <
                    2 &&
                  side !== view
                )
                  setView(side);
              }}
            >
              {views.map((side) => (
                <div
                  className="gallery-stage"
                  key={side}
                  data-side={side}
                  role="button"
                  tabIndex={side === view ? 0 : -1}
                  aria-hidden={side !== view}
                  aria-label={`${side} of ${design.name}. ${zoomed ? "Drag or use arrow keys to inspect. Press Enter to zoom out." : "Press Enter to zoom. Use left and right arrows to change view."}`}
                  aria-pressed={side === view && zoomed}
                  onPointerDown={pointerDown}
                  onPointerMove={pointerMove}
                  onPointerUp={() => {
                    drag.current = null;
                    setDragging(false);
                  }}
                  onPointerCancel={() => {
                    drag.current = null;
                    moved.current = true;
                    setDragging(false);
                  }}
                  onLostPointerCapture={() => {
                    drag.current = null;
                    setDragging(false);
                  }}
                  onDragStart={(event) => event.preventDefault()}
                  onKeyDown={keyboard}
                  onClick={(event) => {
                    if (moved.current) return;
                    const rect = event.currentTarget.getBoundingClientRect();
                    toggleZoom(
                      event.currentTarget,
                      event.detail === 0
                        ? undefined
                        : {
                            x: event.clientX - rect.left,
                            y: event.clientY - rect.top,
                          },
                    );
                  }}
                >
                  <div
                    className="gallery-zoom-layer"
                    data-dragging={dragging}
                    style={{
                      transform:
                        side === view && zoomed
                          ? `translate(${zoom.x}px, ${zoom.y}px) scale(${zoomScale})`
                          : "translate(0px, 0px) scale(1)",
                    }}
                  >
                    <GarmentImage
                      design={design}
                      selection={selection}
                      view={side}
                      preview
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="view-switch" role="group" aria-label="Garment view">
              {views.map((side) => (
                <button
                  key={side}
                  className="mono"
                  aria-pressed={view === side}
                  onClick={() => changeView(side)}
                >
                  {side}
                </button>
              ))}
            </div>
            <p className="gallery-hint">
              {zoomed
                ? "Drag to explore the details. Tap to zoom out."
                : "Swipe to turn. Tap the image to look closer."}
            </p>
          </div>
        </div>
        <PreviewDetails
          design={design}
          selection={selection}
          onSelectionChange={(update) => {
            resetInspection();
            if (update.mark) setView("Front");
            onSelectionChange(update);
          }}
        />
      </div>
    </dialog>
  );
}
