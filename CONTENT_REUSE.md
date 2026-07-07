# Content reuse strategy

This document defines how and when we single-source content in the Kestra docs. It
applies to **all content contributors** — writers, engineers, and automated agents
alike. If you are about to copy a block of content from one page to another, stop and
read this first.

## Why we reuse content

Copied content drifts. When the same notice, command, or explanation lives in several
pages, every product change requires finding and updating every copy — and in
practice, some copies get missed. Readers then encounter contradictory instructions,
and we can't tell which version is correct without archaeology.

Single-sourcing means each shared block has exactly one source file. Update it once,
and every page that includes it is updated at the next build. The goal is not to
deduplicate text for its own sake — it is to make the docs trustworthy under change.

## Principles

1. **Reuse significant, self-contained units — not sentence fragments.** Good
   candidates are whole admonitions, complete command blocks, full step sequences,
   entire example flows. If you are tempted to single-source half a sentence, don't:
   the reading flow of each page matters more than deduplicating a few words. For
   short recurring sentences, standardize the wording manually instead.

2. **Design for future updates, not current convenience.** Before creating a shared
   fragment, ask: *when this content changes, should every page that uses it change
   in exactly the same way?* If yes, it belongs in one source. If the copies could
   legitimately diverge — different audiences, different contexts, deliberate
   variations — keep them separate and cross-link instead. Forced reuse is worse
   than duplication: it either blocks a needed page-specific change or silently
   breaks other pages.

3. **Shared content must read correctly everywhere.** A reusable fragment appears on
   many pages, at different depths of the site, in different narrative contexts. It
   must therefore be context-free: no "as shown above", no "in this guide", no
   relative links. Write it so it works on a page you haven't seen.

4. **One canonical home per fact.** Definitions and conceptual explanations should
   live on one authoritative page; other pages link to it rather than restating it.
   Transclusion is for content that must appear inline on several pages (notices,
   commands); linking is for content the reader can follow a reference to.

5. **Broken reuse must fail loudly.** A reference to a missing or renamed fragment
   should fail the build, never render as literal markup or silently disappear.
   Every rendering path — HTML pages, raw-markdown endpoints, machine-readable
   exports — must resolve reuse the same way, so human and AI readers see identical
   content.

6. **Reuse is a shared vocabulary, so keep it cataloged.** A fragment nobody can
   find is a fragment somebody will duplicate. Every reusable fragment gets a
   catalog entry recording what it contains and which pages consume it. Check the
   catalog before writing a new fragment; update it whenever you add, change, or
   retire one.

## When to create a shared fragment

Create one when **all** of these hold:

- The block appears (or will appear) on **three or more pages**, or on two pages
  where drift would be user-visible and harmful (e.g., an install command).
- The copies must stay **identical by intent** — when one changes, all must change.
- The block is **self-contained** (principle 1) and **context-free** (principle 3).

Do **not** create one when:

- Copies look similar but serve different purposes and may legitimately diverge.
  Cross-link the canonical explanation instead.
- The text is a definition that already has an authoritative page. Link to it
  (principle 4).
- The content is a short sentence woven into surrounding prose. Standardize the
  wording; don't fragment the page source for a negligible maintenance win.

## How

The docs support two reuse mechanisms: Markdown fragment transclusion via the
`::snippet` directive, and code-file imports via the `file=` code-fence meta. Both
are resolved at build time across every rendering path. The snippet library, its
catalog, and the authoring syntax live in
[`src/contents/docs/_snippets/README.md`](src/contents/docs/_snippets/README.md);
contributor-facing instructions are in the docs contributor guide.

## Maintenance and review

- **Editing a shared fragment edits every consumer page.** Before changing one,
  check its consumer list in the catalog and skim at least two consumers to make
  sure the new wording still fits their context.
- **PR review enforces the strategy.** A PR that adds another copy of an existing
  block should be redirected to the shared fragment. A PR that edits one copy of a
  block that exists elsewhere should be redirected to edit the source fragment.
- **Ownership follows content type.** Wording of edition and availability notices is
  owned by the docs team; check before changing gating language. Frontmatter `title`,
  `h1`, and `description` remain owned by the SEO lead.
- **Dev-server caveat:** the content layer caches rendered pages, so after editing a
  fragment, restart the dev server (or touch a consumer page) to see the change.

## Localization

The docs are currently English-only. If localization is introduced, shared fragments
localize as units — one fragment file per locale — which is another reason to keep
them self-contained and free of mid-sentence context.
