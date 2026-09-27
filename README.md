# 360

A coming-soon homepage for a clothing label built around circular light grids.

```bash
npm install
npm run dev -- --host 100.92.57.21 --port 8000 --strictPort
```

The development server runs at http://100.92.57.21:8000 on this machine's Tailscale interface. `npm run build` checks TypeScript and generates the production site in `dist`. `npm run preview -- --host 100.92.57.21 --port 8000 --strictPort` serves that build after the development server is stopped. Use Node 26 or later.

## Content

- `src/collection.ts` contains the four early garment concepts.
- `src/components/CircleMark.tsx` draws the circle-grid identity.
- `src/components/CircleSign.tsx` displays a non-interactive light sign in the story section. It cycles through all six designs every four seconds, pauses in hidden tabs, and stays still with reduced motion. `src/sign-artwork.ts` places complete artwork on a fixed grid without downsampling.
- `src/components/Hero.tsx` coordinates the opening light sequence and the photo's first visible reveal. Its animation timing is in `src/styles.css`.
- `src/useScrollReveals.ts` observes the page's `data-reveal` elements. `src/scroll-reveals.css` defines their entrances and responsive stagger timing.
- `src/styles.css` contains the responsive design, typography, and Black/White palette tokens. `ModeSwitch.tsx` renders the circle-built light bulb beside the hero action; `src/appearance.ts` coordinates the palette with garment colourways while preserving chest marks. `src/useAppearance.ts` saves the page mode as `360-mode` in localStorage, and the small head script applies it before painting. Individual garment overrides remain session-only.
- `public/images/garment-blanks/` contains eight clean 1024×1536 garment photographs (black/white, tee/hoodie, front/back). `src/artwork.ts` defines six precise circle grids; `CircleArtwork.tsx` renders the vector prints over the photos. All main artwork stays on the back. The front offers the story-style ring of circles or the 360 mark on the wearer's left chest.
- `src/components/GarmentGallery.tsx` provides native front/back swiping, 2.5× zoom, bounded pointer panning, and keyboard controls. `src/gallery-geometry.ts` owns tested pan limits and zoom positioning.
- `src/components/GarmentImage.tsx` selects the image for each garment, colour, side, and chest mark. Choices are remembered separately for each garment during the current page session.
- `design-ideas/product-images/` archives the first generated concepts, including the old printed artwork. The current blank PNG originals are in `design-ideas/garment-blanks/`, with exact built-in image-tool prompts in `docs/clean-garment-prompts.json`. ImageMagick encodes their WebP copies. The printed graphics are native SVG circles, never generated pixels. The original generation prompts remain in `docs/product-image-prompts.json`.
- `design-ideas/references/collection.png` is retained as the original design reference and is no longer used for product images.
- `design-ideas/references/origin.png` preserves the supplied mall photograph as a reference; it is not displayed on the homepage.
- `public/images/campaign/black.webp` and `white.webp` are matching blank campaign photos edited with the built-in image tool. `CampaignPhoto.tsx` overlays the shared vector world grid and slogan, and swaps the complete composition with the page mode after the image decodes. Both layers use the same responsive crop. PNG originals are in `design-ideas/campaign-blanks/`; exact edit prompts are in `docs/campaign-image-prompts.json`. The original `design-ideas/references/campaign.png` is retained as a reference and is no longer displayed.

This is a brand launch preview. There is no checkout, stock, or pricing. All garment descriptions refer to concepts.

## Lookbook

`src/components/Lookbook.tsx` adds four model photographs after the story, with a front view of the World hoodie and rear views of the Time tee, Smiley tee and Butterfly hoodie. The photos follow the collection's individual colour and chest-mark selections, including page-wide mode changes. `lookbook.css` uses a staggered two-column layout on desktop and a single column below 768px. Existing scroll reveals apply to each complete photograph and caption.

The eight blank photos were created with the built-in image-generation tool. PNG originals live in `design-ideas/lookbook/`, exact prompts in `docs/lookbook-image-prompts.json`, and optimized WebP copies in `public/images/lookbook/` (approximately 685KB combined). Every print uses the existing native SVG circle grids, positioned in the photograph's 1024×1536 coordinate system. Images load lazily; each colour's photo and print fade as one layer after decoding, preserving the available layer while its replacement loads. Reduced motion removes the fade.

## Launch assets and deployment metadata

`public/social-preview.png` is a 1200×630 share card using the canonical circle artwork and Space Grotesk lettering. `favicon.svg`, the 16/32/48px `favicon.ico`, and `apple-touch-icon.png` use a simplified grid of eight hollow rings for clarity at small sizes. The outlined share-card source is `design-ideas/launch/social-preview.svg`.

Open Graph and Twitter metadata are present in the server-delivered HTML. The public site is `https://360-design.github.io`. The Pages workflow sets this as `SITE_URL`, and the Vite metadata plugin adds the canonical URL, `og:url`, and absolute share-image URLs during the build. Without this value, private previews use a relative image path and omit canonical URLs. See `.env.example`. Protocol fields follow the [Open Graph specification](https://ogp.me/).

Campaign photos have 640/1024px sources, collection cards have 384/640/1024px sources, and lookbook photos have 480/768/1024px sources. Browsers select a source for the rendered size and screen density; gallery zoom retains the full 1024px photo. All sources retain the same aspect ratio and SVG coordinate system. Unused references are archived under `design-ideas/references/`, and obsolete product WebPs under `design-ideas/retired-product-webps/`, outside the production public folder.

Run `npm run assets:generate` to regenerate the launch graphics and smaller WebP sources. This optional asset-authoring command needs Python with `fontTools`, Node, ImageMagick, and installed npm dependencies. Normal development and production builds use the checked-in assets and do not need Python or ImageMagick.

The large PNG design archives, historical references and generation prompt records remain local and are excluded from Git. Asset regeneration needs those local originals. The public repository includes the production images and outlined launch artwork.

## GitHub Pages

Live at [360-design.github.io](https://360-design.github.io/). The initial deployment and all 17 checks passed on 2026-09-27.

The `origin` remote is `https://github.com/360-design/360-design.github.io.git`. The `.github/workflows/pages.yml` installs locked dependencies, checks formatting, runs tests, builds and deploys `dist` to GitHub Pages. The workflow uses Node 26 and scoped deployment permissions. It only runs when the repository variable `SIGNUP_READY` is `true`; leave it unset until the Formspree endpoint has been verified. Store the public endpoint in the `FORMSPREE_ENDPOINT` repository variable. The workflow passes it as `VITE_FORMSPREE_ENDPOINT` and runs `npm run build:pages`, which rejects missing or invalid signup configuration.

GitHub Pages cannot run the local signup API. The user selected Formspree and requires a working hosted form before publication. The verified form endpoint is `https://formspree.io/f/mqpayvwr`, configured in the repository variable `FORMSPREE_ENDPOINT`. `SIGNUP_READY` is enabled after a successful verification submission. The local Tailscale form and SQLite storage continue working. Keep the email form in the public site, and do not substitute a coming-soon signup notice.

With `VITE_FORMSPREE_ENDPOINT` configured, the same form posts directly to that Formspree endpoint. Native submission lets Formspree handle its confirmation page, validation and CAPTCHA checks. It sends the email, the `_gotcha` honeypot, and the launch consent text/version. No private API key enters the browser. Without an endpoint, the original JSON request to `/api/signup` and inline confirmation remain in use. A failed hosted submission is never copied silently into the local database or reported as saved.

Create a form in the [Formspree dashboard](https://formspree.io/forms), verify the account email, and copy its public `/f/…` endpoint from the Integration tab. See [Formspree's setup instructions](https://help.formspree.io/articles/building-your-form/building-an-html-form/). Verify a submission reaches the intended form before setting `SIGNUP_READY=true` and enabling Pages. Formspree stores the submissions; it is not the launch email campaign itself. Do not import existing local subscribers automatically.

## Local waitlist

The closing “Join the circle” form posts to `/api/signup`. The Vite development and preview servers both run the local API. Signups are saved in `~/.local/share/360/waitlist.sqlite`, outside the served project, with owner-only file permissions. Each address is stored once, with a UTC signup timestamp and the `launch-updates-v1` consent version. The form's consent text is “By joining, you agree to receive email updates about the 360 launch.” Back up this file to preserve the waitlist when moving or replacing the machine.

No confirmation or marketing emails are sent. The form confirms that the address was saved; it does not verify ownership. Before sending launch emails, import the list into an email platform and configure its consent and unsubscribe flow.

Export a CSV locally (keep the export outside `public/`):

```bash
npm run --silent waitlist:export > ~/360-waitlist.csv
```

The database is created on the first successful signup. The export command requires it to exist. There is no public subscriber-list endpoint. The API validates input, limits request size, rejects cross-origin browser submissions, and limits each connection address to 10 attempts per minute. This is a local preview backend; deploying `dist/` alone does not include it. A public deployment needs a hosted signup API or mailing-list integration.

Run `npm test` for real HTTP and SQLite integration checks, `npm run build` for type checking and bundling, and `npm run format:check` for formatting.
