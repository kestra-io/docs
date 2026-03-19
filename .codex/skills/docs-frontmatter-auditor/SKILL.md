---
name: docs-frontmatter-auditor
description: Use this skill when creating, editing, reviewing, or moving Kestra docs content and you need to verify frontmatter, page type fit, or section metadata. Applies to docs pages under src/contents/docs and focuses on schema-valid metadata, card-friendly openings, and repo-specific conventions.
---

# Docs Frontmatter Auditor

Use this skill for metadata and page-type review in the Kestra docs repo.

## Scope

- Primary target: `src/contents/docs/**/*.md` and `src/contents/docs/**/*.mdx`
- Primary concern: frontmatter correctness and page-role fit
- Secondary concern: whether the opening content supports navigation cards and section pages

## What to inspect first

1. Read `src/content.config.ts` to confirm the current docs collection schema.
2. Read `src/contents/docs/04.contribute-to-kestra/04.docs-contributor-guide/index.mdx` for repo-specific conventions.
3. For section-card behavior, check `src/components/docs/ChildCard.astro` and `src/components/docs/GuidesChildCard.astro`.
4. Load `references/frontmatter-rules.md` for the working checklist.

## Default workflow

1. Identify the page type from the content: concept, how-to guide, landing page, reference page, or migration guide.
2. Check whether the file lives in the right section for that page type.
3. Validate required frontmatter fields and note missing or suspicious metadata.
4. Check whether optional fields are present only when they add meaning.
5. Inspect the first sentence because section cards reuse early body content.
6. Make the smallest safe patch that brings the page in line with repo conventions.
7. If the page role itself is unclear, ask instead of inventing metadata that changes information architecture.

## Repo-specific rules

- Treat `src/content.config.ts` as the source of truth for allowed docs frontmatter fields.
- Keep `title` clear and descriptive.
- Add `description` when the page should surface better in search, previews, or navigation.
- Use `sidebarTitle` only when the nav label should be shorter than the page title.
- Use `icon` when the page belongs to docs patterns that display an icon in headers or cards.
- Use `topics` and `stage` for how-to guides and similar guide pages when the section expects them.
- Use `editions`, `version`, and `release` only when they communicate real product constraints.
- Use `docId` only when the page should support contextual in-app docs behavior.
- Do not add speculative metadata just because similar pages have it.

## What this skill should not do

- Do not rewrite the full page for tone or style unless that change is needed to support metadata behavior.
- Do not guess product editions, version constraints, or `docId` mappings when the source of truth is unclear.
- Do not move pages across sections unless the user asks for information architecture changes.

## When to ask instead of guessing

- The page could plausibly be more than one page type.
- A missing field would require product knowledge you cannot verify locally.
- A section appears to use inconsistent conventions and there is no clear dominant pattern.
- Adding `editions`, `version`, `release`, or `docId` would be inference rather than evidence-based.

## Output expectations

- Report missing, unnecessary, or suspicious metadata clearly.
- Prefer minimal fixes over broad normalization.
- Say explicitly when a recommendation is an inference from nearby patterns rather than a confirmed repo rule.
