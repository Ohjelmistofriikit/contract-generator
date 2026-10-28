# Improvement backlog

Findings from a code review (2026-10-28). Each item was checked against the code; items marked **Check** need a human decision. Check items off as they are fixed. Line numbers refer to the code at the time of the review and may drift.

> **Policy: contract clause text is not changed without legal review.** Even small, well-meant wording changes can change the legal meaning of a clause. Items that touch the text in `pdfgeneration.js` (1.1, 1.3, section 2 and section 6) are marked **⚖ legal review** and are deferred until reviewed. Code-only fixes can go ahead.

## 1. Bugs

Fix these first. Items 1.1–1.3 affect the text of generated contracts.

- [ ] **1.1 Wrong sentence in the English fixed-price contract.** ⚖ legal review
  [pdfgeneration.js:206](../js/pdfgeneration.js#L206): the English billing paragraph for `urakkalaskutus` contains "Should the Supplier not meet the allocation due to reasons attributable to the Supplier, the Supplier is entitled to invoice only the actual hours." That sentence was copy-pasted from the allocation contract and makes no sense in a fixed-price one. The Finnish version says something else: if the Client does not give billing details, the Supplier may send the invoice in any reasonable way. Replace the English sentence with a translation of the Finnish one. Every English fixed-price contract generated so far contains this error.

- [x] **1.2 Changing language after picking a court produces a mixed-language contract.**
  The court list comes from `getCourts()`, which depends on the current language, but `karajaoikeusRaaka`/`karajaoikeusValmis` and the travel area derived from it (`matkustusalue*`) keep the value from the language that was active when they were picked. Example: pick "Helsingin käräjäoikeus", switch to EN, generate → an English contract that says "shall be resolved in Helsingin käräjäoikeudessa". Fix: in `changeLanguage`, clear these fields or map them to the other language (the keys of `locations.fi` and `locations.en` are in matching order). Fixed by mapping by position. **Caveat:** this relies on both lists keeping the same order; a court added or reordered in only one language would silently map to the wrong court. A test should check that the lists line up.

- [ ] **1.3 Finnish travel area means "to", not "within", for the capital region.** ⚖ legal review
  [translations.js](../js/translations.js), `locations.fi`: the three Uusimaa courts map to `"pääkaupunkiseudulle"` ("to the capital region"). In the contract this reads "Pääkaupunkiseudulle tapahtuvasta matkustamisesta ei veloiteta…" (no charge for travel *to* the capital region). That is grammatical, but every other region uses the "in" ending (`Etelä-Karjalassa`, `Pirkanmaalla`…), and the English contract says "within Helsinki metropolitan area". Change it to `"pääkaupunkiseudulla"`. The UI sentence "poislukien matkustaminen …" reads correctly with either form.

- [x] **1.4 Dates can show the previous day.**
  `kirjaaValmisAlkupaivamaara` and `kirjaaValmisLoppupaivamaara` in [globalstate.js](../js/globalstate.js): `new Date('YYYY-MM-DD')` reads the string as UTC midnight, and `getDate()` returns local time, so users in time zones west of UTC see the day before. Fix: split the `YYYY-MM-DD` string directly. Fixed with a `formatIsoDate` helper. `downloadClicked` still formats today's date inline for the filename; that one isn't affected by the bug and is listed under small cleanups in section 4.

- [x] **1.5 Supplier Y-tunnus check differs from the client one.**
  In `kirjaaValmisToimittajanYtunnus` ([globalstate.js](../js/globalstate.js)), the empty-field branch does not clear `toimittajanYtunnusValmis`, unlike the client version. If a valid Y-tunnus is entered and then deleted, the old value stays and is still shown in the collapsed summary. Low impact: the continue button is disabled while the field is empty (`canContinue` checks the raw value), so the user can't generate with the stale value without noticing.

- [x] **1.6 Missing `:` in a binding.**
  [index.html:718](../index.html#L718): `title="t('placeholderInputWeeklyHours')"` shows that literal text as the tooltip. It should be `:title="…"`.

- [x] **1.7 Variables leak into global scope.**
  [pdfgeneration.js:577-593](../js/pdfgeneration.js#L577-L593): `doc.text(text = …, x = …, y = …, options = …)` assigns to undeclared variables, which creates globals named `text`, `x`, `y` and `options`. Pass plain arguments instead.

- [x] **1.8 Dead and redundant code.**
  - `getContinueButtonText`: `!this.radioSijainti === ''` is always `false`, so the line never runs. Remove it, or fix the condition if it is needed.
  - `onkoValmisFieldsetLaskutusperuste`: `this.tuntihintaValmis && this.tuntihintaValmis` (and the same for `urakkahintaValmis`) repeats the same check.

- [x] **1.9 Wrong continue-button label while the location is unanswered.**
  Found while removing the dead line in 1.8, which apparently tried to handle this case. When the location section is shown but neither option is picked, the (disabled) button reads "Jatka referenssioikeuteen →" instead of a generic "Jatka". Cosmetic: the button is disabled, so the user can't skip ahead. Fix in `getContinueButtonText`: return `t('continue')` when `showSijainti() && !radioSijainti`.

- [x] **1.10 Stale PDF after switching language.**
  If the user generates a contract and then switches language, the preview and download keep the old-language PDF, while `downloadClicked` names the file from the new language (e.g. `ConsultingContract_….pdf` for a Finnish contract). Fix: in `changeLanguage`, hide the preview (`previewRendered = false`, clear `pdfDataUri`) or regenerate it.

## 2. Text fixes in the English contract ⚖ legal review

All in [pdfgeneration.js](../js/pdfgeneration.js). These look like typos and wording slips, but they are still clause text, so they follow the policy above.

- [ ] "Cient’s" → "Client’s" (line 381)
- [ ] "its’ Consultants" → "its Consultants" (lines 308, 313)
- [ ] Double spaces: "decides independently  the working hours", "working space  and" (308), "create  employment relationship" (287)
- [ ] "likely to occur ," → "likely to occur," (486)
- [ ] "terminate the Agreement to end without a notice period" / "to end with N weeks' notice" (232, 241): reword, e.g. "terminate the Agreement without notice" / "with N weeks' notice"
- [ ] "according to the then-current Tax Administration's current guidelines" (366): "current" appears twice
- [ ] Mixed `'` and `’` apostrophes throughout: pick one
- [ ] Payment term reused as the acceptance period in fixed-price contracts: see 6.1.

## 3. Performance and repo size

- [ ] **Purge Tailwind.** `assets/tailwind.min.css` is the full Tailwind 2.2.19 build (2.9 MB), sent to every visitor. A one-time run of the Tailwind CLI against `index.html` would cut it to about 20 KB. Commit the output so there is still no build step at runtime, and add the regeneration command to the README, because new classes need a re-run.
- [x] **Defer the PDF scripts.** `jspdf.umd.min.js` and the three `PlusJakartaSans-*.js` font files (~740 KB together) block page rendering in `<head>`. They are only needed when the user clicks generate, so add `defer`. `translations.js` and `globalstate.js` must still load before Alpine (Alpine already uses `defer`).
- [x] **Delete the unused pdf.js files (~12 MB):**
  - `assets/pdfjs/build/*.map`, `assets/pdfjs/web/viewer.mjs.map`
  - `assets/pdfjs/web/compressed.tracemonkey-pldi-09.pdf` (the pdf.js demo document)
  - `assets/pdfjs/web/debugger.css`, `assets/pdfjs/web/debugger.mjs`
  - Possibly most of `assets/pdfjs/web/locale/` (2.3 MB) if only fi/en are needed. **Caveat:** also remove the deleted languages from `locale/locale.json`. The viewer picks the browser's language from that file, so a listed language whose `.ftl` file is missing makes the fetch fail. Languages missing from the file fall back to `en-us`.
  - The demo PDF is only the viewer's `defaultUrl`; we always pass `?file=`, so it is never loaded. The debugger only loads with the `#pdfbug` hash.
- [ ] **Move the jsPDF fonts.** `assets/pdfjs/fonts/PlusJakartaSans-*.js` are jsPDF font files and have nothing to do with pdf.js. Move them to `assets/fonts/` so a pdf.js upgrade doesn't delete them.
- [ ] **Fix the web font.** The `@font-face` rule in `index.html` declares `format('woff2')` for a `.ttf` file. Convert the font to real woff2 (~110 KB saved) or change the hint to `format('truetype')`.
- [ ] **Compress `assets/og-image.png`** (509 KB).

## 4. Simplification and code quality

- [ ] **Remove the client/supplier duplication** in [globalstate.js](../js/globalstate.js). The `kirjaaValmis*` handlers for company, Y-tunnus, contact person, email and phone are near-copies for `tilaajan*` and `toimittajan*`. Generic helpers (e.g. `commitYtunnus('tilaajan')`, `commitEmail(prefix)`, `commitPhone(prefix)`) would remove about 120 lines and fix 1.5 as a side effect.
- [ ] **Simplify PDF output.** Remove `dataURItoBlob` ([globalstate.js:758](../js/globalstate.js#L758)): get a blob directly with `doc.output('blob')` and use one blob URL for both the preview and the download. Revoke the previous URL with `URL.revokeObjectURL` when the user generates again; the current code leaks one per generation.
- [ ] **Move hard-coded texts to `translations.js`:**
  - the fixed-price `confirm()` message in `continueClicked` ([globalstate.js:747](../js/globalstate.js#L747))
  - the hard-coded Finnish `title` attributes in `index.html`: `"Valmis"`, `"Muokkaa"`, `"Numero, esimerkiksi 100 tai 100,00"`, `"Valitse päivämäärä jolloin työ alkaa"`, `"Useimmissa sopimuksissa nykypäivänä IPR menee tilaajalle"`
- [ ] **Bind `<html lang>` to the language.** It is fixed to `"en"`, but the default language is Finnish. Set it from `currentLanguage` (e.g. in `changeLanguage` and at init) for screen readers and hyphenation.
- [ ] **Fix the section-number comments** in [pdfgeneration.js](../js/pdfgeneration.js). The comments number sections 1–23, but optional sections shift the real numbering. Drop the numbers, or keep them as names only.
- [ ] **Remove the 12 copies of the edit-icon SVG** in `index.html`. Use a CSS class with a background image, or one `<symbol>` referenced with `<use href>`.
- [ ] **Small cleanups:**
  - fix the indentation in `downloadClicked` and stop it creating `new Date()` three times
  - turn the literal `270` page-bottom limit ([pdfgeneration.js:26](../js/pdfgeneration.js#L26)) and the `200` signature-section limit ([pdfgeneration.js:540](../js/pdfgeneration.js#L540)) into named constants next to `MARGIN_TOP`
  - Finnish and English identifiers are mixed; not worth a rename, but stick to the existing convention in new code

## 5. Documentation (README)

- [ ] **The Raaka/Valmis convention.** Explain the `*Raaka` (raw input) / `*Valmis` (value committed on blur by `kirjaaValmis*`) pattern, and why the `show*()` functions are computed instead of using flags (see the comment at [globalstate.js:503](../js/globalstate.js#L503)). This is the main thing a new contributor needs to know.
- [ ] **File map:** `index.html` (form UI), `globalstate.js` (Alpine state and validation), `pdfgeneration.js` (contract text and layout), `translations.js` (UI strings and court/region data).
- [ ] **Updating the vendored libraries:** which versions of jsPDF, pdf.js, Alpine and Tailwind are bundled, where to get them, which pdf.js files can be left out, and how the jsPDF font files were generated (jsPDF font converter).
- [ ] **Deployment:** how and where the site is published.
- [ ] **Policy on clause text:** state in the README that clause text in `pdfgeneration.js` is changed only after legal review (see the policy at the top of this file).
- [ ] **Checklist after editing contract text:** generate every combination (hourly with no fixed hours / hourly with allocation / fixed-price × remote / on-site × fi / en) and compare with `sample_output_*.pdf`. Regenerate the sample PDFs when the text changes.

## 6. Deferred: contract-logic questions ⚖ legal review

Open questions about what the contract says. Not to be changed until reviewed (see the policy at the top).

### 6.1 Payment term is also the acceptance period in fixed-price contracts

The form asks one number, the payment term in days (`maksuaika`, default 14, labelled only as payment days). For fixed-price contracts (`urakkalaskutus`), the same number is used twice in the contract:

- **Payment term** ([pdfgeneration.js:296](../js/pdfgeneration.js#L296)): "Laskujen maksuaika on **N** päivää netto laskun päiväyksestä."
- **Acceptance period** ([pdfgeneration.js:209](../js/pdfgeneration.js#L209)): "Urakka katsotaan toimitetuksi, jos Tilaaja ei esitä Toimittajalle perusteltua kirjallista huomautusta **N** päivän kuluessa urakan tulosten vastaanottamisesta."

So a user who picks a 30-day payment term also gives the client 30 days to inspect and object, without the form telling them.

How the deadlines stack:

1. The supplier delivers.
2. The client has N days to object; after that the delivery counts as accepted.
3. The supplier invoices (unless agreed otherwise, the invoice is sent only after delivery).
4. The client has N days to pay.

With a 30-day term the supplier may wait up to about 60 days from delivery to payment.

A related overlap: the warranty section (applies to all contract types) has its own acceptance rule. Work is accepted if the client hasn't objected in writing by the invoice due date. In a fixed-price contract this is a second acceptance step after step 2.

Options:

- **Keep as is**, and only explain in the UI that for fixed-price contracts the number is also the acceptance period. No change to the contract text.
- **Fixed acceptance period** (e.g. always 14 days) in the clause.
- **Separate "acceptance period" field**, shown only for fixed-price contracts.

The first option needs no legal review. The other two change the clause.
