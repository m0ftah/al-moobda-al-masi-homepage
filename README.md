# Al-Moobda Al-Masi Company — Homepage

Static homepage mockup, now a Vite project with Tailwind CSS v4 installed.

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # production build to dist/
npm run preview  # preview the production build
```

## Notes

- The original mockup markup and its inline `<style>` block live in `index.html` and are untouched.
- Tailwind CSS v4 is wired in via `@tailwindcss/vite` (see `vite.config.js`), imported through `src/style.css` (`@import "tailwindcss";`) and loaded by `src/main.js`.
- You can start adding Tailwind utility classes directly in `index.html` right away.
