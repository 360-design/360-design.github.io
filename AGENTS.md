# Agent guidance

360 is a clothing-label launch preview. Garments are concepts; the site collects launch signups and has no checkout, stock, or pricing.

## Before exploring

- Read [domain guidance](docs/agents/domain.md), then `CONTEXT.md` and any relevant ADRs as it directs.
- Read the relevant sections of [README.md](README.md) for setup, module contracts, signup delivery, and asset workflows. Check `package.json` for available commands and `.github/workflows/pages.yml` for deployment checks.

## Interface and artwork

- Before visual or interaction changes, read the relevant sections of [DESIGN.md](DESIGN.md). Its homepage implementation guidance and later feature sections refine the original design concept. Reuse the current tokens in `src/styles.css`.
- Before changing garment prints or photography, read the README's Content and Lookbook sections and DESIGN's Precise circle artwork section. Keep prints sourced from the shared native SVG grids and aligned with their photographs.
- Before regenerating assets, read the README's Launch assets and deployment metadata section. Generation depends on local originals excluded from Git; normal builds use checked-in production assets.

## Signup and deployment

- Before changing signup delivery or publishing, read the README's GitHub Pages, Local waitlist, and Module contracts sections. Preserve the hosted Formspree and local SQLite paths, including their distinct confirmation behavior.
- Use temporary databases and mocked hosted submissions for automated checks. Keep subscriber data and exports outside the repository and `public/`.

## Verification

- For code changes, run `npm run format:check`, `npm test`, and `npm run build`. For deployment changes, also validate the Pages build using the configuration described in the README.
- For interface changes, check the affected flow at desktop and phone sizes, in Black and White modes, with keyboard navigation and reduced motion.
- For documentation-only changes, verify referenced paths and instructions and run `git diff --check`.

## Issues and triage

- Use GitHub Issues. Read [issue tracker guidance](docs/agents/issue-tracker.md) before ticket operations.
- Read [triage label guidance](docs/agents/triage-labels.md) before triaging issues or changing triage labels. Use the five default labels defined there.
