---
name: 360 Monochrome Architecture
colors:
  surface: '#131315'
  surface-dim: '#131315'
  surface-bright: '#39393b'
  surface-container-lowest: '#0e0e10'
  surface-container-low: '#1c1b1d'
  surface-container: '#201f22'
  surface-container-high: '#2a2a2c'
  surface-container-highest: '#353437'
  on-surface: '#e5e1e4'
  on-surface-variant: '#c4c7c9'
  inverse-surface: '#e5e1e4'
  inverse-on-surface: '#313032'
  outline: '#8e9193'
  outline-variant: '#444749'
  surface-tint: '#c6c6c7'
  primary: '#ffffff'
  on-primary: '#2f3132'
  primary-container: '#e2e2e3'
  on-primary-container: '#636466'
  inverse-primary: '#5d5e60'
  secondary: '#c6c5cf'
  on-secondary: '#2f3038'
  secondary-container: '#4a4b53'
  on-secondary-container: '#bcbbc5'
  tertiary: '#ffffff'
  on-tertiary: '#303033'
  tertiary-container: '#e4e1e5'
  on-tertiary-container: '#656467'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2e2e3'
  primary-fixed-dim: '#c6c6c7'
  on-primary-fixed: '#1a1c1d'
  on-primary-fixed-variant: '#454748'
  secondary-fixed: '#e3e1ec'
  secondary-fixed-dim: '#c6c5cf'
  on-secondary-fixed: '#1a1b22'
  on-secondary-fixed-variant: '#46464e'
  tertiary-fixed: '#e4e1e5'
  tertiary-fixed-dim: '#c8c6c9'
  on-tertiary-fixed: '#1b1b1e'
  on-tertiary-fixed-variant: '#47464a'
  background: '#131315'
  on-background: '#e5e1e4'
  surface-variant: '#353437'
typography:
  display:
    fontFamily: Space Grotesk
    fontSize: 56px
    fontWeight: '500'
    lineHeight: 64px
    letterSpacing: 0.25em
  display-mobile:
    fontFamily: Space Grotesk
    fontSize: 36px
    fontWeight: '500'
    lineHeight: 44px
    letterSpacing: 0.2em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '500'
    lineHeight: 40px
    letterSpacing: 0.15em
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
    letterSpacing: 0.12em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
    letterSpacing: 0.1em
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
    letterSpacing: 0.08em
  body-lg:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: 0.01em
  body-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0.01em
  body-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.02em
  label-lg:
    fontFamily: Space Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.12em
  label-md:
    fontFamily: Space Mono
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.15em
  label-sm:
    fontFamily: Space Mono
    fontSize: 10px
    fontWeight: '400'
    lineHeight: 14px
    letterSpacing: 0.18em
spacing:
  gutter: 1.5rem
  gutter-mobile: 0.75rem
  margin: 2.5rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 2rem
  space-xl: 3.5rem
---

## Brand & Style

This design system establishes an elevated, minimalist streetwear aesthetic rooted in the ethos "SIMPLER THINGS GO FURTHER." Drawing inspiration from contemporary architectural brutalism and high-fashion utility (e.g., A-COLD-WALL*, Acne Studios, Fear of God Essentials), the visual identity balances industrial rigor with refined restraint.

The audience consists of design-conscious tastemakers, architectural enthusiasts, and modern streetwear collectors who prioritize silhouette, material tactile quality, and understated graphic identity over loud commercial branding.

The aesthetic is characterized by:
- **Monochrome Polarity**: Stark transitions between deep zinc/pure black and luminous bone white, evoking studio lookbooks and physical garment tags.
- **Dot-Matrix & Halftone Precision**: Visual accents leverage circular dot structures, rasterized grids, and mathematical matrix patterns (referencing the signature dotted world map, butterfly, and radial smileys).
- **Architectural Division**: Clean structural boundaries, 1px perimeter outlines, hairline dividers, and spacious, unhurried negative space.

## Colors

The palette operates under strict monochrome discipline. It avoids chromatic noise entirely, relying on pure luminance values, zinc undertones, and intentional tonal contrast.

- **Primary (`#f4f4f5`)**: Stark off-white/bone. Serves as the primary foreground text, key CTAs, active states, and focal graphics in dark mode.
- **Neutral (`#09090b`)**: Pitch graphite surface that frames the system. Deep, matte, and non-reflective, allowing white typography and imagery to cut through with maximum contrast.
- **Secondary (`#71717a`)**: Mid-tone muted zinc for technical metadata, dimensional labels, secondary captions, and inactive pagination indicators.
- **Tertiary (`#27272a`)**: Deep border/surface tone utilized for 1px hairline wireframes, gridlines, container outlines, and surface cards.

### Functional Roles & Accents
- **Canvas Base**: `#09090b` (Deep Graphite)
- **Container Elevated**: `#121214`
- **Border / Divider Wireframe**: `#27272a`
- **Ghost Accent / Subtle Hover**: `rgba(244, 244, 245, 0.08)`
- **Inverted Canvas (Light Mode)**: `#ffffff` base, `#f4f4f5` container, `#09090b` primary ink.

## Typography

Typography establishes an industrial, editorial cadence through a stark hierarchy:

1. **Space Grotesk (Headlines & Brand Displays)**: Used predominantly in uppercase with generous tracking (`0.1em` to `0.25em`). Key branding, collection titles, and seasonal mottos mimic stamped apparel labels and brutalist editorial spreads (e.g., `C I R C L E S`).
2. **Geist (Body & Commerce Copy)**: Clean, neutral, and hyper-legible sans-serif engineered for digital interfaces. Manages product specs, descriptions, editorial essays, and sizing charts without visual friction.
3. **Space Mono (Labels, Data & Metadata)**: Fixed-width technical mono used exclusively for micro-labels, pricing, inventory statuses (`[IN STOCK: 014]`), sizing pills, and coordinate references. Always displayed with expanded letter-spacing to reinforce technical precision.

## Layout & Spacing

The layout model is governed by an architectural grid structure with visible or felt structural alignments.

### Grid & Breakpoints
- **Desktop (1200px+)**: 12-column layout with 24px gutters and 40px outer margins. Supports asymmetrical split-screen viewports (e.g., 50/50 dual product showcase, or 4-column product matrices).
- **Tablet (768px – 1199px)**: 8-column layout with 20px gutters and 24px margins. Product feeds collapse into 2-column structural blocks.
- **Mobile (< 768px)**: 4-column layout with 12px gutters and 20px margins. Product grids reflow into an uninterrupted single-column or alternating 2-column list with razor-thin dividing rules.

### Spatial Discipline
Whitespace is deliberate and generous. Major modules and garment showcase units maintain breathing room through `space-xl` (56px) separation, preventing visual crowding and treating the screen like an open gallery wall. Hairline borders (`1px solid #27272a`) act as containment frames, anchoring floating imagery within strict spatial boundaries.

## Elevation & Depth

This design system rejects conventional diffused drop shadows and skeuomorphic blur stacks in favor of high-precision flat layering and tonal containment.

- **Flat Architectural Planarity**: Surfaces exist along crisp, planar cuts. Rather than relying on z-index drop shadows, layered depth is achieved by nesting darker or lighter matte planes (`#09090b` canvas to `#121214` elevated card surface) bound by `#27272a` hairline outlines.
- **Low-Contrast Hairlines**: 1px sharp structural lines demarcate panels, navigation bars, and product trays.
- **Subtle Backdrops & Overlays**: Modals, drawer navigations, and quick-add trays utilize pure backdrop blur with minimal transparency (`rgba(9, 9, 11, 0.88)` with `backdrop-filter: blur(12px)`), retaining a frosted graphite veil that obscures background chaos while maintaining focus on the immediate tactile component.

## Shapes

The primary shape language is strictly **Sharp (`0`)**.

- **Containers, Cards, & Panels**: 0px border radius across all primary structural frames, imagery viewports, product cards, dialog windows, and form inputs. This reinforces brutalist architecture and technical precision.
- **Graphic Exceptions & Pill Accents**: While structural surfaces remain rigid squares and rectangles (`roundedness: 0`), specific functional UI micro-elements—such as size selection tokens, filter tags, and the central motif graphics—mirror the brand's circular and dot-matrix motif by utilizing full circles (`rounded-full` / `50%`) and geometric dots (`4px` to `8px` diameter matrix points).

## Components

### Buttons
- **Primary**: Full stark off-white fill (`#f4f4f5`), pure black typography (`#09090b`), `Space Mono` uppercase, 0px border radius, 14px padding vertical, 24px horizontal. On hover, inverts smoothly to `#09090b` background with 1px `#f4f4f5` border and white text.
- **Secondary / Outline**: Transparent fill, 1px `#27272a` border, `#f4f4f5` text. On hover, border transitions to `#f4f4f5` with an internal ghost fill (`rgba(244, 244, 245, 0.06)`).
- **Utility / Pill CTA**: Select micro-actions (e.g., "SWATCH TOGGLE", "QUICK VIEW") adopt a full pill shape (`rounded-full`) with uppercase Space Mono typography to harmonize with the circular motif.

### Chips & Badges
- Constructed with a 1px `#27272a` boundary and `#09090b` surface.
- Sizing selection chips (e.g., `S`, `M`, `L`, `XL`) appear as rigid square boxes (44x44px) or minimal circular pills. Active states feature an inverted off-white fill with dark mono labeling.
- Status badges (e.g., `[ARCHIVE]`, `[EDITION OF 100]`) feature a leading 6px dotted circular matrix glyph.

### Product & Editorial Cards
- Fully squared (0px radius) with seamless hairline borders (`1px solid #27272a`).
- High-contrast garment photography (alternating between white studio sweeps and dark voids).
- Bottom metadata bar cleanly divided by a horizontal 1px rule, separating garment name (`Space Grotesk`, uppercase) from SKU and price (`Space Mono`, `#71717a`).

### Form Inputs & Text Fields
- Matte graphite background (`#121214`), 0px radius, 1px `#27272a` border.
- Placeholder text in `#71717a` with monospace styling.
- Focus state: Border transitions instantly to pure off-white (`#f4f4f5`) with no ambient glow or drop-shadow halo.

### Checkboxes & Radio Controls
- **Radio Buttons**: Concentric circular dot motif—a 16px circular ring with a 6px central solid dot upon selection.
- **Checkboxes**: 16x16px sharp square (`0px` radius) with 1px border. Selected state fills `#f4f4f5` with a high-contrast cross or solid inner block.

### Specialized Graphic Modules (Brand Dot Matrix)
- **Dot-Grid Matrix Loader**: Loading and skeleton states use an animated 3x3 or 5x5 circular dot grid that pulses in sequence.
- **Halftone Dividers**: Section dividers can alternate between standard 1px lines and horizontal tracks of 2px rasterized monochrome dots spaced at 6px intervals.

## 360 homepage implementation, September 2026

The first site is a coming-soon brand launch. Its hero action is "A first look", leading to the collection preview. It has no prices, shopping bag, checkout, or stock claims. Four garment concepts can be viewed in black and white, with an accessible dialog for each design. The closing "Join the circle" form collects launch interest in a local waitlist.

The implemented homepage uses the following refinements to the initial system above:

- Brand name: **360**, represented by hollow circles arranged in a three-digit matrix. Open rings directly reference the original illuminated sign.
- Canvas: `#111110`; primary text: `#eeede8`; secondary text: `#a4a49c`; dividers: `#343430`. Keep all imagery and UI monochrome.
- Space Grotesk handles both headlines and body copy. Space Mono handles short labels. Fonts are self-hosted through Fontsource.
- Large display text uses tight tracking from `-0.045em` to `-0.065em`, sentence case, and roughly `1.02` line height. Wide tracking is reserved for small uppercase labels. This replaces the original all-uppercase, widely tracked display treatment on the homepage.
- The hero pairs a short brand statement with a campaign image. On phones below 540px, copy appears above photography. The four-column collection becomes two columns below 768px.
- Rings are brand artwork and selected functional details. Structural panels, buttons, and imagery keep square corners. Motion uses the opening light sequence, photo and scroll reveals, and the repeating scroll cue. There are no decorative gradients or invented inventory badges.
- Individual 1024×1536 product images replace cropped contact-sheet panels. The original design sheet remains the artwork reference. Product images and the campaign photograph are generated concepts, not claims about manufactured garments. The origin story uses text and circle artwork; the mall photograph is retained only as a reference asset.
- Keyboard-visible focus, native dialog focus containment, explicit control labels, responsive layouts, and reduced-motion support are required.

Launch date, garment specifications, pricing, and an eventual email platform remain decisions for the brand owner.

The homepage has no header or navigation bar. The 360 logo sits directly above the hero headline, aligned to its left edge. The hero retains equal outer spacing above and below, and its circular scroll button bounces as a whole, with reduced-motion support. It omits the hero eyebrow, lower-left motto, image captions, and slogan strip. The collection heading has a single "Coming soon" label beside it. Preserve the main headline, scroll arrow, collection numbering, and garment controls.

## Opening motion

The opening recalls the original illuminated sign. The logo lights first, followed by the three headline lines at 80ms intervals. Each has two brief, uneven dips in brightness before becoming steady. A soft white glow disappears as the lights settle; the final typography and colours stay unchanged. Supporting copy and controls fade in afterward. The opening finishes in roughly two seconds and does not repeat when scrolling back.

The campaign photo brightens steadily while settling from 103.5% scale to 100%. It does not flicker. On phones, the copy fills the first viewport and the photo reveal waits until the image enters view. The image must be loaded before its reveal starts.

Only opacity and transform animate. A font-loading wait is capped at 600ms. Keyboard focus immediately reveals the hero controls. With reduced motion enabled, all text, controls, and imagery are visible immediately, with no flicker, zoom, or bouncing arrow.

## Scroll reveals

Collection headings, garment cards, story artwork and copy, launch content, and footer items reveal once as they enter the viewport. Related content moves together, with no nested reveals. Text fades in and rises 16px over 720ms. Images and artwork rise 24px and settle from 98.5% scale over 900ms. Both use the shared strong ease-out curve.

Related elements stagger by 80ms. On phones, the product stagger resets on each two-column row. Revealed elements stay visible when scrolling back. After an entrance, animation styles are removed. Content already visible on an initial section link is not hidden. Keyboard focus immediately reveals its containing group; reduced-motion preferences and browsers without IntersectionObserver show all content without scroll effects.

## Join the circle

The closing section pairs a large two-line "Join the circle." heading with one labelled email field and an off-white rectangular submit button. It replaces the former "Good things take time" block. Keep the existing warm monochrome palette, quiet consent text, and generous spacing. Below 768px, the form sits under the headline; on the narrowest phones, the button sits below the input. The entire form reveals as one group so that its labels and controls remain together.

Submitting shows a small ring indicator, with a static alternative for reduced motion. Confirm membership only after a successful server response. Errors keep the entered email available for retry. Success is announced through a live region. Signups go to a persistent local SQLite waitlist for now; no emails are sent automatically.

## Garment artwork and individual images

The world map, typography, smiley, and butterfly are always printed on the back. The front has only a small mark on the wearer's left upper chest (the viewer's right in a front-facing photograph). Each garment offers a choice of the same ring of small circles used in the story artwork, or the circle-built 360 wordmark, in contrast to its black or white fabric.

Collection cards show the back artwork. On devices with a fine pointer and hover, the selected front image fades in over 180ms while hovering and the back returns on pointer exit. Keyboard focus also reveals the front; reduced motion removes the fade. Touch devices retain the explicit preview controls. Product dialogs provide explicit Front/Back controls and a "Your front mark" selector; selecting a mark automatically shows the front. Colour and mark choices are independent for each design and remain selected when reopening a preview during the current page session. These are design previews, not purchase options or saved orders. Image alt text describes the garment, side, and artwork placement. Full garments remain visible without image cropping, including on phones.

## Precise circle artwork

Product imagery combines clean blank garment photographs with native SVG prints. The world, butterfly, smiley, typography, 360, and front ring all use integer row/column positions on a square lattice. Every ring has radius 0.28 and stroke width 0.12 grid units, leaving a 0.32-unit gap between neighbouring outlines. No circles are offset onto a staggered diagonal grid, no rings overlap, and all interiors are transparent. The front ring and story artwork share the same source grid, placed on the sign; faint inactive circles are omitted from the garment print. Keep SVG and photo in matching 1024×1536 coordinate systems with uniform scaling. Automated checks enforce lattice alignment, uniqueness, spacing, and bounds.

## Product preview gestures

The preview gallery uses two native horizontal scroll-snap pages for Back and Front, with explicit side buttons and a small view counter. Phone users can swipe; vertical scrolling through the dialog remains available while the image is fitted. Tapping the image or pressing the zoom button magnifies it to 2.5×. Dragging then pans within the image bounds without changing sides. The garment photo and vector print zoom together. Front zoom defaults to the chest mark. A drag must not be treated as a tap.

The focused image supports Enter/Space to toggle zoom, left/right arrows to switch sides when fitted, and arrow keys to pan when zoomed. Escape from the gallery exits zoom before dismissing the dialog. Button navigation uses native smooth scrolling unless reduced motion is requested. Side, colour, mark, garment, viewport changes and reopening reset zoom. A sticky close button remains available when the dialog scrolls.

## Cycling circle sign

The story artwork is a non-interactive 49×49 light sign. It cycles through Circle, World, Good things take time, Smiley, Butterfly, and 360, changing every four seconds. The lights stay on a fixed square lattice. Smaller artwork enlarges only by whole-number factors, preserving every source cell and keeping thin lettering and the smiley's mouth intact. No controls, drawing handlers, focusable cells, counters, or help text are present.

The sign sits directly on the page with no background panel. Each incoming artwork uses the hero’s light-ignite animation: two brief, uneven brightness dips before the lights settle, within a one-second animation. The inactive grid remains steady; only the lit artwork flickers. The timer pauses in hidden tabs; returning gives the current design a full four seconds before advancing. Reduced motion keeps the current design still and removes the flicker. The sign has one descriptive image label without repeated screen-reader announcements. Theme changes preserve its position in the sequence.

## Black / white mode

A single light-bulb switch made from hollow circles sits to the right of the hero’s "A first look" button. There is no mode control in the collection. The bulb is off in Black mode and lights its filament and rays in White mode. There is still no header. Black uses the original dark canvas; White uses an off-white canvas (`#eeede8`), dark ink (`#171716`), and secondary text (`#62625c`). Shared colour tokens cover the story board, signup field, buttons, and product dialog. Garment and campaign colourways use their actual matching photographs and contrasting prints, never an inverted image.

Choosing a mode applies its colour to all four garment previews, preserving each chest-mark choice. Individual garment swatches still work independently. First visits use Black; a saved mode is read before the page paints and restored on reload. The browser colour scheme and theme colour follow the palette. If storage is blocked, the switch still works for the current page.

The bulb’s filament and rays fade over 180ms using the shared ease-out curve; keyboard focus and reduced motion remove that transition. The palette changes immediately to retain text contrast. The bulb has a 48px target, a keyboard focus outline, and an accessible Light mode switch label with its on/off state. Theme changes do not remount the hero, restart the circle sign, or clear signup input. Individual garment overrides and chest-mark choices remain session-only.


## Clean campaign colourways

The hero uses matching black and white hoodie photographs in the same pose and concrete-wall setting. Both photographic bases are blank; the printed world map is the same native SVG grid used on the World hoodie preview. All 432 circles use integer grid coordinates with transparent interiors and uniform spacing. The slogan is native text below the map. No generated print fragments remain in the photographic bases.

Black mode shows the black hoodie with off-white print. White mode shows the white hoodie with dark print. Both images are loaded eagerly, with the selected colour prioritized. The complete photo-and-print layer changes only once its image has decoded; the available layer remains visible while waiting. The swap uses a 180ms opacity transition, removed with reduced motion. Switching colours does not replay the opening reveal.

A single 1024×1536 coordinate system positions the image and print. The composite uses cover cropping together, retaining the existing desktop and mobile focal positions. Never crop the photo separately from its artwork. Generated originals and exact prompts are archived alongside the project; the optimized WebP bases total approximately 330KB.

## First-collection lookbook

The lookbook follows the story and precedes signup. Four portrait photographs show the World hoodie from the front, then the Time tee, Smiley tee and Butterfly hoodie from the back. Large designs remain on the back; the only front artwork is the visitor's selected small circle or 360 mark on the wearer's left chest. These are concept images, not photographs of manufactured products.

Use a spacious two-column layout with the right column offset by 100px, switching to one column below 768px. Retain full 2:3 photographs without independent cropping of their prints. Captions pair the design name with a small garment/side label. Each figure and its caption reveal together using the existing image entrance. No new gallery controls or purchase actions.

Black and white photos follow each garment's collection selection. Both variants share the same precise SVG artwork and positioning. A complete photo-and-print layer appears only after image decoding; keep the current layer visible while loading its replacement. Use a 180ms opacity fade, disabled with reduced motion. Lazy-load the eight WebP images and preserve the blank originals and exact prompts in the project.

## Launch identity and image delivery

The 1200×630 share card uses the circle-built 360 logo, the existing headline and a small story ring on the dark canvas. Use precise vector circles and outlined Space Grotesk text; keep artwork and copy legible when the image is reduced. The favicon simplifies the identity to eight hollow circles on a 3×3 grid, with a blank centre, so it stays recognizable at 16px. SVG, multi-size ICO and 180px Apple touch formats share this symbol.

Social metadata lives in the initial HTML. The canonical URL and absolute share-image URLs come from the configured public `SITE_URL`; private previews must not invent a public domain. Public deployment remains separate from preparing these assets.

Responsive photo sources retain the original composition and uniform print alignment. Deliver smaller WebP variants to collection cards and lookbook images while preserving full-resolution photos for gallery zoom. Keep archival concepts and unused references outside `public/` so production builds contain only current assets.

The public GitHub Pages site keeps the “Join the circle” email form. When configured for Formspree, it submits natively to the verified form endpoint, allowing the provider to present confirmation and any CAPTCHA checks. The private local version keeps its SQLite API and inline success state. A hosted submission must work before publication; do not replace the form with a signups-coming-soon notice.
