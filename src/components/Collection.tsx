import { useRef, useState } from "react";
import { ArrowUpRight, Plus, X } from "@phosphor-icons/react";
import {
  designs,
  type Colorway,
  type Design,
  type DesignId,
  type GarmentSelection,
  type GarmentView,
} from "../collection";
import type { Appearance } from "../appearance";
import GarmentImage from "./GarmentImage";
import CircleArtwork from "./CircleArtwork";
import GarmentGallery from "./GarmentGallery";

function Swatches({
  color,
  onChange,
  name,
}: {
  color: Colorway;
  onChange: (color: Colorway) => void;
  name: string;
}) {
  return (
    <div className="swatches" role="group" aria-label={`${name} colorway`}>
      {(["Black", "White"] as const).map((value) => (
        <button
          key={value}
          className={`swatch ${value.toLowerCase()}`}
          aria-label={`${name} in ${value}`}
          aria-pressed={value === color}
          onClick={() => onChange(value)}
        >
          <span />
        </button>
      ))}
    </div>
  );
}

function DesignCard({
  design,
  index,
  onOpen,
  selection,
  onColorChange,
}: {
  design: Design;
  index: number;
  onOpen: (design: Design) => void;
  selection: GarmentSelection;
  onColorChange: (color: Colorway) => void;
}) {
  return (
    <article
      className="design-card"
      data-reveal="image"
      data-reveal-order={index}
    >
      <button
        className="garment-button"
        onClick={() => onOpen(design)}
        aria-label={`Preview ${design.name}`}
      >
        <GarmentImage design={design} selection={selection} />
        <span className="garment-front" aria-hidden="true">
          <GarmentImage design={design} selection={selection} view="Front" />
        </span>
        <span className="image-index mono">360 / {design.id}</span>
        <span className="preview-icon">
          <Plus size={18} weight="light" />
        </span>
      </button>
      <div className="garment-meta">
        <div>
          <h3>{design.name}</h3>
          <p className="mono">{design.type}</p>
        </div>
        <Swatches
          color={selection.color}
          onChange={onColorChange}
          name={design.type}
        />
      </div>
    </article>
  );
}

export default function Collection({
  selections,
  onSelectionChange: updateSelection,
}: {
  selections: Appearance["selections"];
  onSelectionChange: (id: DesignId, update: Partial<GarmentSelection>) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<Design>(designs[0]);
  const [view, setView] = useState<GarmentView>("Back");
  const selection = selections[selected.id];
  const open = (design: Design) => {
    setSelected(design);
    setIsOpen(true);
    setView("Back");
    dialog.current?.showModal();
  };
  return (
    <section
      className="collection section-pad"
      id="collection"
      aria-labelledby="collection-title"
    >
      <div className="section-topline mono" data-reveal="text">
        <span>01 / THE FIRST COLLECTION</span>
      </div>
      <div className="collection-heading">
        <h2 id="collection-title" data-reveal="text">
          Small circles.
          <br />
          <span>Everyday statements.</span>
        </h2>
        <p
          className="collection-status mono"
          data-reveal="text"
          data-reveal-order="1"
        >
          <span className="tiny-ring" /> COMING SOON
        </p>
      </div>
      <div className="product-grid">
        {designs.map((design, index) => (
          <DesignCard
            key={design.id}
            design={design}
            index={index}
            onOpen={open}
            selection={selections[design.id]}
            onColorChange={(color) => updateSelection(design.id, { color })}
          />
        ))}
      </div>
      <div className="collection-note mono" data-reveal="text">
        <span>ARTWORK ON THE BACK. YOUR CHOICE OF MARK ON THE FRONT.</span>
        <span>
          COLLECTION 001 <ArrowUpRight size={14} />
        </span>
      </div>
      <dialog
        ref={dialog}
        className="product-dialog"
        aria-labelledby="dialog-title"
        onClose={() => setIsOpen(false)}
        onClick={(event) => {
          if (event.target === dialog.current) dialog.current.close();
        }}
      >
        <div className="dialog-close-bar">
          <button
            className="dialog-close icon-button"
            autoFocus
            onClick={() => dialog.current?.close()}
            aria-label="Close preview"
          >
            <X size={24} />
          </button>
        </div>
        <div className="dialog-layout">
          <div className="dialog-photo">
            {isOpen && (
              <GarmentGallery
                key={`${selected.id}-${selection.color}-${selection.mark}`}
                design={selected}
                selection={selection}
                view={view}
                onViewChange={setView}
              />
            )}
          </div>
          <div className="dialog-copy">
            <p className="mono">COLLECTION 001 / {selected.id}</p>
            <h2 id="dialog-title">{selected.name}</h2>
            <p className="dialog-type">{selected.type}</p>
            <p>{selected.description}</p>
            <div className="dialog-color">
              <span className="mono">{selection.color.toUpperCase()}</span>
              <Swatches
                color={selection.color}
                onChange={(color) => updateSelection(selected.id, { color })}
                name={selected.type}
              />
            </div>
            <fieldset className="chest-mark-options">
              <legend className="mono">YOUR FRONT MARK</legend>
              <div className="chest-mark-choices">
                {(["circle", "360"] as const).map((mark) => (
                  <button
                    key={mark}
                    type="button"
                    aria-pressed={selection.mark === mark}
                    onClick={() => {
                      updateSelection(selected.id, { mark });
                      setView("Front");
                    }}
                  >
                    <CircleArtwork artwork={mark} width={51} height={20} />
                    <span className="mono">
                      {mark === "circle" ? "CIRCLE" : "360 LOGO"}
                    </span>
                  </button>
                ))}
              </div>
              <p>
                Small mark on your left chest. The full artwork stays on the
                back.
              </p>
            </fieldset>
            <div className="coming-note">
              <span className="tiny-ring" />
              <div>
                <span className="mono">STILL TAKING SHAPE</span>
                <p>
                  This is an early design preview. The first collection is
                  coming soon.
                </p>
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </section>
  );
}
