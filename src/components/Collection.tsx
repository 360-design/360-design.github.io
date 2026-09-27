import { useState } from "react";
import { ArrowUpRight, Plus } from "@phosphor-icons/react";
import {
  designs,
  type Colorway,
  type Design,
  type DesignId,
  type GarmentSelection,
} from "../collection";
import type { Appearance } from "../appearance";
import GarmentImage from "./GarmentImage";
import ColorSwatches from "./ColorSwatches";
import GarmentPreview from "../garment-preview/GarmentPreview";

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
        <ColorSwatches
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
  const [selected, setSelected] = useState<Design | null>(null);
  return (
    <section
      className="collection section-pad"
      id="collection"
      aria-labelledby="collection-title"
    >
      <div className="section-topline mono" data-reveal="text">
        <span>02 / THE FIRST COLLECTION</span>
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
            onOpen={setSelected}
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
      {selected && (
        <GarmentPreview
          design={selected}
          selection={selections[selected.id]}
          onSelectionChange={(update) => updateSelection(selected.id, update)}
          onClose={() => setSelected(null)}
        />
      )}
    </section>
  );
}
