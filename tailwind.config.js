// Tailwind 2.2.19. Generates vendor/tailwind.min.css with only the classes used in the files below.
// Re-run `npm run build:css` after adding new Tailwind classes, and commit the output.
// Classic purge mode (not JIT) on purpose: it keeps the full build's rule order, which decides
// conflicting classes such as `px-4 ... px-6` on the same element.
module.exports = {
  purge: {
    enabled: true, // otherwise Tailwind 2 only purges when NODE_ENV=production
    content: ['./index.html', './js/**/*.js'],
  },
  theme: {},
  variants: {},
  plugins: [],
};
