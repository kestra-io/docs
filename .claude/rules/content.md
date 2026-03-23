---
paths:
  - "src/contents/**/*.md"
  - "src/contents/**/*.mdx"
  - "src/contents/**/*.yaml"
---

# Content Rules

## Structure
- Every content file must have frontmatter with at least `title`
- Use numbered prefixes (`01.`, `02.`) for ordering — they are stripped from URLs
- Use `index.md` for section landing pages
- Validate frontmatter matches the Zod schema in `src/content.config.ts`

## Markdown Conventions
- External links automatically get `target="_blank"` — don't add manually
- Images in markdown automatically get lightbox zoom — no extra markup needed
- Use fenced code blocks with language identifiers for syntax highlighting
- Use `:::note`, `:::warning` directives for callouts — not raw HTML

## SEO
- Keep `title` under 60 characters for search results
- Keep `description` under 155 characters for meta descriptions
- Use descriptive, keyword-rich titles — not generic ("Getting Started with Kestra Triggers" not "Triggers")
- Every page should have a unique `description` in frontmatter

## Images in Content
- Always provide alt text that describes the image content
- Use relative paths for images in the same content directory
- For shared images, reference from `src/assets/`
- Set explicit width/height on `<img>` tags to prevent CLS

## Heading Hierarchy
- Start content with `## h2` — the page `title` from frontmatter renders as `h1`
- Never skip heading levels (h2 → h4 without h3)
- Keep headings concise — they become anchor links and TOC entries
- Use sentence case for headings ("Getting started" not "Getting Started")
