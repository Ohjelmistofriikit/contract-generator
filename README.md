# Contract generator

https://sopimusgeneraattori.ohjelmistofriikit.fi/

## Development

The contract generator is static HTML, JS and CSS that runs straight from the committed files. Serve the repo root locally with e.g. `npx live-server` (without a path argument; the PDF preview needs a server, `file://` isn't enough).

The only generated file is `vendor/tailwind.min.css` (Tailwind 4, built from `tailwind.css`), which contains just the Tailwind classes the page uses. After adding a new Tailwind class, regenerate and commit it:

```sh
npm install
npm run build:css
```

### Project layout

| Path | What it is |
|---|---|
| `index.html` | The whole UI: one form, one `<fieldset>` per step, driven by Alpine.js |
| `js/globalstate.js` | Form state, validation, step progression, PDF preview and download |
| `js/pdfgeneration.js` | The contract: clause texts and PDF layout (jsPDF) |
| `js/translations.js` | UI texts in Finnish and English, and the district court list |
| `vendor/` | Third-party libraries, never edited by hand (see Updating dependencies) |
| `assets/` | Our own fonts and images |
| `docs/improvements.md` | Improvement backlog |

[CLAUDE.md](CLAUDE.md) has more detail on conventions and pitfalls; it's written for AI coding assistants but useful for people too.

### How the form state works

Every text field has two values: `fooRaaka` is what the user is typing (bound with `x-model`), and `fooValmis` is the committed value, copied and validated by `kirjaaValmisFoo()` when the field loses focus or Enter is pressed. The PDF and the collapsed section summaries use the `Valmis` values.

Whether a step is complete (`onkoValmisFieldsetFoo()`) and whether it is shown (`showFoo()`) are computed from these values, not stored as flags. Users can go back and change earlier answers, which can change which steps apply, and the form has to advance with a single click.

## Contract text

**Clause texts in `js/pdfgeneration.js` are only changed after legal review**, including typo fixes: a small wording change can change the legal meaning. Each clause has a Finnish and an English version; a generated contract is in one language.

After an approved change to the contract text or contract logic:

1. Generate a contract for every combination: hourly billing with no fixed hours / hourly with allocation / fixed price, remote / on-site, in Finnish and in English.
2. Read the changed sections in each, and compare with `sample_output_fi.pdf` / `sample_output_en.pdf`.
3. Regenerate the two sample PDFs from the form and commit them.

## Updating dependencies

| Library | Version | File(s) | Get it from |
|---|---|---|---|
| Alpine.js | 3.17.5 | `vendor/alpinejs.min.js` | `https://cdn.jsdelivr.net/npm/alpinejs@<version>/dist/cdn.min.js` |
| jsPDF | 2.5.1 | `vendor/jspdf.umd.min.js` | `https://cdn.jsdelivr.net/npm/jspdf@<version>/dist/jspdf.umd.min.js` |
| pdf.js | 5.3.31 | `vendor/pdfjs/` | `pdfjs-<version>-dist.zip` from https://github.com/mozilla/pdf.js/releases |
| Tailwind CSS | see `package.json` | `vendor/tailwind.min.css` | `npm install -D -E tailwindcss@<version> @tailwindcss/cli@<version>`, then `npm run build:css` |

**pdf.js** is only used for the preview. After unpacking a new release into `vendor/pdfjs/`, remove what the preview doesn't need: `*.map` files, `web/compressed.tracemonkey-pldi-09.pdf`, `web/debugger.*`, `web/standard_fonts/`, `web/cmaps/`, `web/wasm/`, `web/iccs/` (only needed for PDFs that don't embed their fonts or contain images; ours embed Plus Jakarta Sans), and the `web/locale/` folders other than `fi`, `sv-SE` and `en-US`. Then edit `web/locale/locale.json` to list only those three; a language listed there without its folder breaks the viewer for browsers in that language. Check the preview still loads.

**Fonts** (Plus Jakarta Sans, from Google Fonts, OFL licence):

- `assets/fonts/PlusJakartaSans-VariableFont_wght.woff2` is the web font: the variable TTF from Google Fonts converted to WOFF2 with fontTools (`pip install fonttools brotli`, then `fonttools ttLib.woff2 compress PlusJakartaSans-VariableFont_wght.ttf`).
- `assets/fonts/PlusJakartaSans-{normal,bold,italic}.js` embed the font in the PDF. They were made with jsPDF's font converter ([`fontconverter/fontconverter.html`](https://github.com/parallax/jsPDF/blob/master/fontconverter/fontconverter.html) in the jsPDF repo; open it locally in a browser) from the static Regular, Bold and Italic TTFs, with font name `PlusJakartaSans` and styles `normal` / `bold` / `italic` (the names `js/pdfgeneration.js` uses).

## Deployment

The site is hosted on Netlify (project `sopimusgeneraattori`; the domain is a CNAME to `sopimusgeneraattori.netlify.app`). Netlify publishes the repo root as committed; no build command is needed. Its settings live in the Netlify UI, not in a `netlify.toml`. Every pull request gets a deploy preview at `https://deploy-preview-<PR number>--sopimusgeneraattori.netlify.app`, linked from the PR checks; check the preview before merging.

## License

This repo is dual-open-source-licensed with requirement for attribution (see [LICENSE.md](LICENSE.md) for details.)

If you use the contract generator for its intended purpose, you don't have to worry about licensing. You can make any modifications you want to your own contract. For example, you can remove attribution from your own contract. Our intent with licensing is related to competing products, such as other contract generators or contract templates. Our intent with licensing is NOT to encumber any party who merely generates a contract for their own use (either as a freelancer, or as a client who contracts a freelancer).