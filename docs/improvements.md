# Improvement backlog

Findings from a code review (2026-10-28). Each item was checked against the code; items marked **Check** need a human decision. Check items off as they are fixed. Line numbers refer to the code at the time of the review and may drift.

## 1. Bugs

Fix these first. Items 1.1–1.3 affect the text of generated contracts.

- [ ] **1.1 Wrong sentence in the English fixed-price contract.**
  [pdfgeneration.js:206](../pdfgeneration.js#L206): the English billing paragraph for `urakkalaskutus` contains "Should the Supplier not meet the allocation due to reasons attributable to the Supplier, the Supplier is entitled to invoice only the actual hours." That sentence was copy-pasted from the allocation contract and makes no sense in a fixed-price one. The Finnish version says something else: if the Client does not give billing details, the Supplier may send the invoice in any reasonable way. Replace the English sentence with a translation of the Finnish one. Every English fixed-price contract generated so far contains this error.

- [ ] **1.2 Changing language after picking a court produces a mixed-language contract.**
  The court list comes from `getCourts()`, which depends on the current language, but `karajaoikeusRaaka`/`karajaoikeusValmis` and the travel area derived from it (`matkustusalue*`) keep the value from the language that was active when they were picked. Example: pick "Helsingin käräjäoikeus", switch to EN, generate → an English contract that says "shall be resolved in Helsingin käräjäoikeudessa". Fix: in `changeLanguage`, clear these fields or map them to the other language (the keys of `locations.fi` and `locations.en` are in matching order).

- [ ] **1.3 Finnish travel area means "to", not "within", for the capital region.**
  [translations.js](../translations.js), `locations.fi`: the three Uusimaa courts map to `"pääkaupunkiseudulle"` ("to the capital region"). In the contract this reads "Pääkaupunkiseudulle tapahtuvasta matkustamisesta ei veloiteta…" (no charge for travel *to* the capital region). That is grammatical, but every other region uses the "in" ending (`Etelä-Karjalassa`, `Pirkanmaalla`…), and the English contract says "within Helsinki metropolitan area". Change it to `"pääkaupunkiseudulla"`. The UI sentence "poislukien matkustaminen …" reads correctly with either form.

- [ ] **1.4 Dates can show the previous day.**
  [globalstate.js:150](../globalstate.js#L150) and [globalstate.js:164](../globalstate.js#L164): `new Date('YYYY-MM-DD')` reads the string as UTC midnight, and `getDate()` returns local time, so users in time zones west of UTC see the day before. Fix: split the `YYYY-MM-DD` string directly. The same formatting code appears twice (and a third time in `downloadClicked`), so turn it into one helper.

- [ ] **1.5 Supplier Y-tunnus check differs from the client one.**
  [globalstate.js:266](../globalstate.js#L266): in `kirjaaValmisToimittajanYtunnus`, the empty-field branch does not clear `toimittajanYtunnusValmis`, unlike the client version. If a valid Y-tunnus is entered and then deleted, the old value stays and is still shown in the collapsed summary. Low impact: the continue button is disabled while the field is empty (`canContinue` checks the raw value), so the user can't generate with the stale value without noticing.

- [ ] **1.6 Missing `:` in a binding.**
  [index.html:718](../index.html#L718): `title="t('placeholderInputWeeklyHours')"` shows that literal text as the tooltip. It should be `:title="…"`.

- [ ] **1.7 Variables leak into global scope.**
  [pdfgeneration.js:577-593](../pdfgeneration.js#L577-L593): `doc.text(text = …, x = …, y = …, options = …)` assigns to undeclared variables, which creates globals named `text`, `x`, `y` and `options`. Pass plain arguments instead.

- [ ] **1.8 Dead and redundant code.**
  - [globalstate.js:564](../globalstate.js#L564): `!this.radioSijainti === ''` is always `false`, so the line never runs. Remove it, or fix the condition if it is needed.
  - [globalstate.js:129-131](../globalstate.js#L129-L131): `this.tuntihintaValmis && this.tuntihintaValmis` (and the same for `urakkahintaValmis`) repeats the same check.

## 2. Text fixes in the English contract

All in [pdfgeneration.js](../pdfgeneration.js):

- [ ] "Cient’s" → "Client’s" (line 381)
- [ ] "its’ Consultants" → "its Consultants" (lines 308, 313)
- [ ] Double spaces: "decides independently  the working hours", "working space  and" (308), "create  employment relationship" (287)
- [ ] "likely to occur ," → "likely to occur," (486)
- [ ] "terminate the Agreement to end without a notice period" / "to end with N weeks' notice" (232, 241): reword, e.g. "terminate the Agreement without notice" / "with N weeks' notice"
- [ ] "according to the then-current Tax Administration's current guidelines" (366): "current" appears twice
- [ ] Mixed `'` and `’` apostrophes throughout: pick one
- [ ] **Check:** [pdfgeneration.js:209](../pdfgeneration.js#L209) uses the **payment term** (`maksuaikaValmis`) as the deadline for accepting fixed-price deliverables. Confirm whether that is intentional or should be a separate field.

## 3. Performance and repo size

- [ ] **Purge Tailwind.** `assets/tailwind.min.css` is the full Tailwind 2.2.19 build (2.9 MB), sent to every visitor. A one-time run of the Tailwind CLI against `index.html` would cut it to about 20 KB. Commit the output so there is still no build step at runtime, and add the regeneration command to the README, because new classes need a re-run.
- [ ] **Defer the PDF scripts.** `jspdf.umd.min.js` and the three `PlusJakartaSans-*.js` font files (~740 KB together) block page rendering in `<head>`. They are only needed when the user clicks generate, so add `defer`. `translations.js` and `globalstate.js` must still load before Alpine (Alpine already uses `defer`).
- [ ] **Delete the unused pdf.js files (~10 MB):**
  - `assets/pdfjs/build/*.map`, `assets/pdfjs/web/viewer.mjs.map`
  - `assets/pdfjs/web/compressed.tracemonkey-pldi-09.pdf` (the pdf.js demo document)
  - `assets/pdfjs/web/debugger.css`, `assets/pdfjs/web/debugger.mjs`
  - Possibly most of `assets/pdfjs/web/locale/` (2.3 MB) if only fi/en are needed. **Caveat:** also remove the deleted languages from `locale/locale.json`. The viewer picks the browser's language from that file, so a listed language whose `.ftl` file is missing makes the fetch fail. Languages missing from the file fall back to `en-us`.
  - The demo PDF is only the viewer's `defaultUrl`; we always pass `?file=`, so it is never loaded. The debugger only loads with the `#pdfbug` hash.
- [ ] **Move the jsPDF fonts.** `assets/pdfjs/fonts/PlusJakartaSans-*.js` are jsPDF font files and have nothing to do with pdf.js. Move them to `assets/fonts/` so a pdf.js upgrade doesn't delete them.
- [ ] **Fix the web font.** The `@font-face` rule in `index.html` declares `format('woff2')` for a `.ttf` file. Convert the font to real woff2 (~110 KB saved) or change the hint to `format('truetype')`.
- [ ] **Compress `assets/og-image.png`** (509 KB).

## 4. Simplification and code quality

- [ ] **Remove the client/supplier duplication** in [globalstate.js](../globalstate.js). The `kirjaaValmis*` handlers for company, Y-tunnus, contact person, email and phone are near-copies for `tilaajan*` and `toimittajan*`. Generic helpers (e.g. `commitYtunnus('tilaajan')`, `commitEmail(prefix)`, `commitPhone(prefix)`) would remove about 120 lines and fix 1.5 as a side effect.
- [ ] **Simplify PDF output.** Remove `dataURItoBlob` ([globalstate.js:735](../globalstate.js#L735)): get a blob directly with `doc.output('blob')` and use one blob URL for both the preview and the download. Revoke the previous URL with `URL.revokeObjectURL` when the user generates again; the current code leaks one per generation.
- [ ] **Move hard-coded texts to `translations.js`:**
  - the fixed-price `confirm()` message in `continueClicked` ([globalstate.js:724](../globalstate.js#L724))
  - the hard-coded Finnish `title` attributes in `index.html`: `"Valmis"`, `"Muokkaa"`, `"Numero, esimerkiksi 100 tai 100,00"`, `"Valitse päivämäärä jolloin työ alkaa"`, `"Useimmissa sopimuksissa nykypäivänä IPR menee tilaajalle"`
- [ ] **Bind `<html lang>` to the language.** It is fixed to `"en"`, but the default language is Finnish. Set it from `currentLanguage` (e.g. in `changeLanguage` and at init) for screen readers and hyphenation.
- [ ] **Fix the section-number comments** in [pdfgeneration.js](../pdfgeneration.js). The comments number sections 1–23, but optional sections shift the real numbering. Drop the numbers, or keep them as names only.
- [ ] **Remove the 12 copies of the edit-icon SVG** in `index.html`. Use a CSS class with a background image, or one `<symbol>` referenced with `<use href>`.
- [ ] **Small cleanups:**
  - fix the indentation in `downloadClicked` and stop it creating `new Date()` three times
  - turn the literal `270` page-bottom limit ([pdfgeneration.js:26](../pdfgeneration.js#L26)) and the `200` signature-section limit ([pdfgeneration.js:540](../pdfgeneration.js#L540)) into named constants next to `MARGIN_TOP`
  - Finnish and English identifiers are mixed; not worth a rename, but stick to the existing convention in new code

## 5. Documentation (README)

- [ ] **The Raaka/Valmis convention.** Explain the `*Raaka` (raw input) / `*Valmis` (value committed on blur by `kirjaaValmis*`) pattern, and why the `show*()` functions are computed instead of using flags (see the comment at [globalstate.js:479](../globalstate.js#L479)). This is the main thing a new contributor needs to know.
- [ ] **File map:** `index.html` (form UI), `globalstate.js` (Alpine state and validation), `pdfgeneration.js` (contract text and layout), `translations.js` (UI strings and court/region data).
- [ ] **Updating the vendored libraries:** which versions of jsPDF, pdf.js, Alpine and Tailwind are bundled, where to get them, which pdf.js files can be left out, and how the jsPDF font files were generated (jsPDF font converter).
- [ ] **Deployment:** how and where the site is published.
- [ ] **Checklist after editing contract text:** generate every combination (hourly with no fixed hours / hourly with allocation / fixed-price × remote / on-site × fi / en) and compare with `sample_output_*.pdf`. Regenerate the sample PDFs when the text changes.
