# Contract generator

A single-page form that generates a Finnish/English freelancer consulting contract as a PDF, entirely in the browser. Live at https://sopimusgeneraattori.ohjelmistofriikit.fi/.

## Running

The site is static HTML/JS/CSS and **runs from the committed files as-is**: there is no runtime build, and Node is not needed to run or deploy it. Serve the repo root with any static server:

```sh
npx live-server            # or: python3 -m http.server
```

Pass no path argument: `live-server index.html` serves `index.html` in place of every file, which shows up as "Unexpected token '<'" errors. The pdf.js preview needs HTTP; opening `index.html` via `file://` works for the form but not for the preview.

## Build step (CSS only)

`vendor/tailwind.min.css` is **generated and committed**. It contains only the Tailwind 4 classes found in `index.html` and `js/`. The input file is `tailwind.css`; there is no `tailwind.config.js` (Tailwind 4 is configured in CSS).

```sh
npm install                # once; dev tooling only
npm run build:css          # regenerates vendor/tailwind.min.css
```

- **Re-run `npm run build:css` and commit the output whenever you add a Tailwind class** that isn't used anywhere yet. Otherwise the class silently has no styling. Not needed for changes that only reuse existing classes or touch JS logic.
- Write class names out in full (in `class` or as string literals in `:class`). Tailwind scans the source text, so a class assembled at runtime (e.g. `'px-' + n`) is not generated.
- `tailwind.css` scans only `index.html` and `js/` (`source(none)` + `@source`). Without that, Tailwind would scan `vendor/` and add thousands of unused classes.
- Don't put two utilities for the same property on one element (e.g. `px-4 px-6`). Tailwind 4 decides which one wins by its own sort order, not by class order.
- Use Tailwind 4 names: `shrink-0` (not `flex-shrink-0`), `bg-gray-800/90` (not `bg-opacity-*`), `rounded-sm` for the old bare `rounded`. The page was built with Tailwind 2, whose `yellow`/`green` are `amber`/`emerald` today.
- Always pair a border width with a colour class (`border-2 border-gray-700`); Tailwind 4's default border colour is `currentColor`, which is white-ish on this page.
- Tailwind 4 doesn't give buttons a pointer cursor or placeholders a gray colour by default. The `<style>` block sets both: `button:not(:disabled) { cursor: pointer }` (like the existing `label` rule) and `.input-text::placeholder`. New text inputs should use the `.input-text` class.
- The `<style>` block in `index.html` (custom colours like `bg-blueish`, `.input-text`, …) is wrapped in `@layer utilities` on purpose. Tailwind 4 puts its utilities in cascade layers, and unlayered CSS would always override them; in the same layer, the inline rules win by specificity and order as they did before. Put new custom CSS inside that layer; keep `@font-face` outside it.
- Tailwind 4 needs a modern browser (Safari 16.4+, Chrome 111+, Firefox 128+). Older browsers get a mostly unstyled page.

## Files

- `index.html`: the whole UI. Alpine.js directives on one big form, one `<fieldset>` per form step.
- `js/globalstate.js`: `getAlpineState()`, the single Alpine state object: fields, validation, step progression, language switching, PDF preview/download.
- `js/pdfgeneration.js`: `getPDF(state)`, the contract text and layout (jsPDF).
- `js/translations.js`: UI strings (`translations.fi` / `.en`) and `locations` (district court → default travel area, per language).
- `vendor/`: third-party builds. Never edit by hand; replace on upgrade.
  - `alpinejs.min.js` (Alpine 3.14.9), `jspdf.umd.min.js` (jsPDF 2.5.1)
  - `pdfjs/` (pdf.js 5.3.31 viewer for the preview), trimmed: no source maps, demo PDF, debugger, `standard_fonts`, `cmaps`, `wasm` or `iccs` (our PDFs embed their font and have no images, so pdf.js never loads them); viewer locales only `fi`, `sv-SE`, `en-US`. When upgrading, apply the same trim and keep `web/locale/locale.json` in sync with the locale folders, or browsers in a missing language get a failed request instead of the English fallback.
  - `tailwind.min.css`: generated, see Build step.
- `assets/`: our own static files.
  - `fonts/PlusJakartaSans-VariableFont_wght.woff2`: web font.
  - `fonts/PlusJakartaSans-{normal,bold,italic}.js`: the same font embedded for jsPDF (made with jsPDF's font converter from static TTF instances).
  - `logo.svg`, `bg-mesh.svg`, `og-image.png`.
- `sample_output_fi.pdf`, `sample_output_en.pdf`: example contracts linked from the page.
- `docs/improvements.md`: the improvement backlog. Tick items off when fixing them.

**Keep these URLs stable:** `assets/og-image.png` (absolute URL in the Open Graph/Twitter meta tags; link previews are cached by URL) and the two sample PDFs at the root (public links).

## Deployment

Netlify publishes the repo root as committed (settings live in the Netlify UI; there is no `netlify.toml`). Every PR gets a deploy preview at `https://deploy-preview-<PR number>--sopimusgeneraattori.netlify.app`, which is the quickest way to check a change on a real deployment. How to update the vendored libraries and fonts is in the README.

## Contract text: do not change without legal review

Clause text in `js/pdfgeneration.js` must not be changed, even for typos or "obvious" fixes, without explicit approval: wording changes can change the legal meaning. This includes the Finnish and English strings passed to `addSectionTitle` / `addParagraph`. Code changes that leave the generated text identical are fine; verify that they do (see Verifying changes).

Each generated PDF is in **one** language: `addParagraph(fi, en)` picks by `state.currentLanguage`. When editing a clause with approval, update both languages.

## State conventions (js/globalstate.js)

Identifiers are mostly Finnish; follow the existing names.

- `fooRaaka` is the raw value bound with `x-model`. `fooValmis` is the committed value, copied (and validated) by `kirjaaValmisFoo()` on blur / Enter. The PDF and the collapsed summaries use `*Valmis`; `canContinue()` checks `*Raaka`.
- `radioFoo` holds a radio choice; `fooValmis: false` booleans mark that the user has moved past a radio-only step.
- `onkoValmisFieldsetFoo()` says whether a step is complete. `showFoo()` says whether a step is visible. These are **computed on purpose**, not flags (see the comment above `showTuntimaara`): users can go back and change earlier answers, and the form must advance with a single click.
- Some steps are conditional: `tuntimaara` only for hourly billing, `tyoajat` (remote) vs. `tyovalineet` (on-site) depending on `radioSijainti`. Keep `getFormProgress()`, `getContinueButtonText()` and `canContinue()` consistent when adding or changing steps.
- `locations.fi` and `locations.en` list the same courts **in the same order**; `changeLanguage` maps the selected court between languages by position. Add or reorder courts in both lists together.
- Supported languages are the keys of `translations`; anything else in `?lang=` or localStorage falls back to `fi`.

## Alpine gotchas

- Timing hacks are deliberate: `setTimeout` waits for Alpine to update the DOM (`tarvittaessaScrollaaAlas`, the `piilotaFormi` initial-load guard, re-syncing the court `<select>` after a language switch). `$nextTick`, `:selected` and `:key` were tried for the select and did not work.
- Each fieldset has its own `x-data="{ onFocus: false }"` scope for expand/collapse, so an `x-ref` inside a fieldset belongs to that scope, not to the root state.
- Script order in `<head>` matters: `js/translations.js` and `js/globalstate.js` load synchronously before Alpine (`defer`). The PDF scripts (jsPDF, the three font files, `js/pdfgeneration.js`) are `defer`red because they're only needed on generate; keep jsPDF before the font files.

## Verifying changes

There are no automated tests. After changes:

- **Contract logic or `js/pdfgeneration.js`:** generate contracts in **both languages** across the main branches: hourly with no fixed hours / hourly with allocation / fixed-price, remote / on-site, both IPR options. For refactors, confirm the generated text is unchanged: wrap `window.jspdf.jsPDF` in a headless browser (Playwright), record every `doc.text()` call for each combination, and diff before/after.
- **Markup, CSS, Tailwind or asset moves:** compare full-page screenshots before/after in both languages at desktop and phone width, including the PDF preview, and check the browser console for errors and 404s. The hero's bouncing "↓" arrow differs between runs; ignore it.
- `sample_output_fi.pdf` / `sample_output_en.pdf`: regenerate them if the contract text changes.
