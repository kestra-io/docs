# Kestra Docs — Project Guide

## Quick Commands

- **Dev**: `npm run dev`
- **Build**: `npm run build`
- **Preview**: `npm run build && wrangler dev`
- **Deploy**: `npm run build && wrangler deploy`
- **Lint**: `oxlint . --fix`
- **Format**: `oxfmt . --write && prettier --write **/*.astro`

## Tech Stack

- **Framework**: Astro 5 (SSR via Cloudflare adapter)
- **Interactivity**: Vue 3 (SFC, `client:load` / `client:idle` / `client:visible`)
- **Styling**: SCSS + Bootstrap 5.3, `--ks-*` CSS custom properties
- **Content**: Markdown/MDX collections with Zod schemas
- **Images**: Cloudflare image service (prod), passthrough (dev with `NO_IMAGE_OPTIM=true`)
- **Linting**: oxlint + prettier-plugin-astro
- **Animations**: USAL (`data-usal` attributes)
- **Fonts**: Mona Sans (body), JetBrains Mono (code)

## Architecture

```
src/
├── components/       # Astro (.astro) + Vue (.vue) components by feature
├── contents/         # Content collections (docs/, blogs/, etc.)
├── pages/            # Route pages ([...slug].astro patterns)
├── assets/styles/    # SCSS (app.scss imports all)
├── utils/            # TypeScript utilities
├── composables/      # Vue composables
├── markdown/         # Custom remark/rehype plugins
├── schemas/          # Zod validation schemas
├── scripts/          # Global client-side scripts
└── middleware.ts     # Cloudflare middleware chain
```

## Key Conventions

- **Components**: PascalCase filenames. Props via TypeScript `interface Props`.
- **Content ordering**: Prefix dirs/files with `01.`, `02.` — stripped by `generateId()`.
- **Imports**: Use `~/` alias for `./src/` (e.g., `import X from "~/utils/X"`).
- **Styles**: Scoped `<style lang="scss">` per component. Global vars in `_variable.scss`.
- **Vue in Astro**: Use `client:load` for immediate, `client:idle` for deferred, `client:visible` for lazy.
- **Animations**: `data-usal="fade-r delay-0 duration-400 ease-out"` on elements.
- **Theme**: Dark mode via `.dark` class on `<html>`. CSS vars toggle automatically.

## Content Collections

Defined in `src/content.config.ts`. Key collections: `docs`, `blogs`, `legal`, `vs`, `customerStories`, `tutorialVideos`, `feeds`. Each has a Zod schema. Use `generateId` for clean slug generation.

## Do NOT

- Commit `.env`, `wrangler.toml` secrets, or `node_modules/`
- Use inline styles — always use SCSS or CSS custom properties
- Create class components — Vue uses Composition API only
- Skip `alt` text on images
