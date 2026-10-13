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

- The homepage was redesigned around the company logo's brand colors (deep purple + an orange accent) using the IBM Plex superfamily (Sans / Sans Arabic / Mono).
- Markup lives in `index.html`; the design system is in `src/style.css`; interactions (language switch, scroll reveals, header state, stat count-up, mobile nav, form) are in `src/main.js`.
- The site is bilingual **Arabic / English**, and Arabic is the default (RTL). Every string carries `data-en` / `data-ar` (placeholders use `data-en-ph` / `data-ar-ph`). The navbar language button toggles `<html lang/dir>`, and the choice is saved in `localStorage`. You can also deep-link a language with `?lang=ar` or `?lang=en`.
- Brand logos are real assets in `public/` (`logo.png` for light surfaces, `logo-white.png` for dark ones).
- Motion respects `prefers-reduced-motion`, reveals use `IntersectionObserver` (no scroll listeners), and layout uses CSS logical properties so RTL mirrors automatically.
- Tailwind CSS v4 is still wired in via `@tailwindcss/vite` and imported at the top of `src/style.css`.
