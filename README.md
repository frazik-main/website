# Frazik

Personal website and technical blog built with Astro and React.

## Local development

```powershell
npm install
npm run dev
```

Open `http://localhost:4321`.

## Build and preview

```powershell
npm run check
npm run build
npm run preview
```

Astro generates the static site in `dist/`. The GitHub Actions deployment workflow builds this directory and publishes it to GitHub Pages.

## Project structure

- `src/pages/` - site routes
- `src/content/blog/` - Markdown blog posts
- `src/components/` - reusable Astro and React components
- `src/styles/` - site styling
- `public/` - static assets
