---
name: content-link-fixer
description: Use this skill when working in the Kestra docs repo to find broken links in content under src/contents and repair them safely. Applies to Markdown and MDX pages, image references, anchor links, and cross-links between docs, blogs, legal pages, customer stories, and VS pages.
---

# Content Link Fixer

Use this skill for link-checking and link repair work in this repository.

## Scope

- Content lives primarily under `src/contents`.
- Internal content links usually point to source files such as `index.md` or `index.mdx`, not final website URLs.
- The repo expects relative links for content and images whenever possible.
- Route-level compatibility fixes can also live in `src/contents/redirects/docs.yml`.

## What to inspect first

1. Identify the failing file and the exact broken link.
2. Read `README.md` for the repo rule: links and images should stay relative.
3. Use `src/content.config.ts`, `src/utils/generateId.ts`, and `astro.config.mjs` only as routing/reference context when the correct target is unclear.

## Link types

- Relative content links: `./...`, `../...`
- Root-relative site routes: `/docs`, `/plugins`, `/pricing`
- Relative asset links: `./image.png`, `../assets/example.svg`
- External links: `https://...`
- Anchor links: `#section`, `./index.md#section`

## Default workflow

1. Start from the reported failure, changed files, or the file the user is editing.
2. Open the source file and resolve the link relative to that file's directory.
3. Check whether the target exists on disk.
4. If it does not exist, search nearby siblings first, then the relevant content collection, then the full `src/contents` tree.
5. Decide whether the right fix is a source-link patch or a redirect entry in `src/contents/redirects/docs.yml`.
6. Patch the link or redirect with the smallest safe change.
7. Re-check the edited file or redirect rule for other obviously related breakage.

## Repo-specific repair rules

- Prefer relative source-file links between content pages.
- Prefer `index.md` or `index.mdx` targets when linking into a content directory.
- Keep root-relative routes only when they intentionally point to non-content pages such as `/plugins`, `/docs`, `/pricing`, `/demo`, or similar site routes.
- Do not replace internal links with full `https://kestra.io/...` URLs unless the destination is truly external.
- Keep image links relative when the asset is stored with the content.
- If both `.md` and `.mdx` are plausible, choose the file that actually exists.
- Preserve hash fragments when the target page is still correct.
- If the broken path is an old public docs route that should remain supported, add or update a rule in `src/contents/redirects/docs.yml` instead of forcing content files to carry compatibility-only links.

## How to validate a target

- For file existence, use `rg --files src/contents` or `find src/contents -type f`.
- For renamed pages, search by distinctive slug fragments, title text, or nearby directory names.
- For anchors, confirm the destination heading still exists in the target file before keeping or changing the hash.
- When a docs path has numbered folders such as `05.workflow-components/17.states/index.md`, link to the real source path; the site build handles public URL rewriting.
- For old website routes, inspect `src/contents/redirects/docs.yml` before inventing a new content path.

## When to patch content vs redirects

- Patch content files when the source markdown link itself is wrong.
- Patch `src/contents/redirects/docs.yml` when the broken reference is an old or moved public `/docs/...` route that should still resolve for incoming traffic.
- If both are broken, fix both: correct the source link and preserve backwards compatibility with a redirect only when there is evidence the old public route was used before.
- Keep redirect changes narrowly scoped. Prefer the most specific `regexp` that covers the old route without catching unrelated pages.

## Redirect conventions for `src/contents/redirects/docs.yml`

- Follow the existing YAML list format exactly:

```yml
- regexp: "/docs/old-path/?$"
  to: "/docs/new-path"
```

- Keep both `regexp` and `to` values quoted unless the destination is an intentional external URL already following a repo pattern.
- Write regexes against public URL paths such as `/docs/...`, not source file paths under `src/contents`.
- Escape literal dots as `\\.` when matching old file-like URLs such as `.md`.
- Use `/?$` when the old route should match both with and without a trailing slash.
- Use `(.*)` or more specific groups only when you need to preserve part of the old path in `to`.
- Reuse capture groups with `$1`, `$2`, etc. in the `to` field when preserving suffixes.
- Use `^` only when you need to force a strict beginning-of-path match. Most existing rules omit it unless ambiguity was a concern.
- Prefer exact or narrowly grouped patterns over broad catch-alls like `/docs/.*` unless the repo already uses that shape for a known migration.
- Point `to` at the canonical public destination route, usually another `/docs/...` URL, not a filesystem path.
- Check nearby rules before adding a new one. If an existing regex already covers the route, update that rule instead of adding a duplicate.
- Keep rule order in mind: place narrower rules before broader ones when overlap is possible.

## Fix selection heuristics

- Prefer the same collection first: docs-to-docs, blog-to-blog, legal-to-legal.
- If a page moved, prefer the canonical replacement over a broader landing page.
- If a blog references product docs, cross-collection links into `src/contents/docs` are normal.
- If only the extension is wrong, change only the extension.
- If only the directory slug changed, keep the rest of the path structure intact.

## When to ask the user instead of guessing

- Multiple candidate targets exist and the intended one is not obvious.
- The old page appears deleted without a clear replacement.
- The link text implies a semantic destination that conflicts with the nearest matching file.
- Fixing the link would require changing information architecture rather than correcting a path.
- A redirect would need a broad regex that could shadow neighboring docs routes.

## Useful commands

```bash
rg -n '\]\((\.{1,2}/|/|https?://|#)[^)]+\)' src/contents
```

```bash
rg --files src/contents | rg 'slug-or-filename-fragment'
```

```bash
find src/contents -type f \( -name '*.md' -o -name '*.mdx' \)
```

## Output expectations

- Make the minimal safe patch.
- Mention any unresolved ambiguous links explicitly.
- If you changed anchors based on inference, say so.
