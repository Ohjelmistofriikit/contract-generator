# Contract generator

https://sopimusgeneraattori.ohjelmistofriikit.fi/

## Development

The contract generator is static HTML, JS and CSS that runs straight from the committed files. Serve the repo root locally with e.g. `npx live-server` (without a path argument). The main dependencies are AlpineJS, PDFjs and jsPDF; they are pre-built and bundled into `vendor/`.

The only generated file is `vendor/tailwind.min.css`, which contains just the Tailwind classes the page uses. After adding a new Tailwind class, regenerate and commit it:

```sh
npm install
npm run build:css
```

See [CLAUDE.md](CLAUDE.md) for the project layout and conventions.

## License

This repo is dual-open-source-licensed with requirement for attribution (see [LICENSE.md](LICENSE.md) for details.)

If you use the contract generator for its intended purpose, you don't have to worry about licensing. You can make any modifications you want to your own contract. For example, you can remove attribution from your own contract. Our intent with licensing is related to competing products, such as other contract generators or contract templates. Our intent with licensing is NOT to encumber any party who merely generates a contract for their own use (either as a freelancer, or as a client who contracts a freelancer).