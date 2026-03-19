# Frontmatter rules

Use this checklist when auditing docs page metadata.

## Sources of truth

- Schema: `src/content.config.ts`
- Contributor guidance: `src/contents/docs/04.contribute-to-kestra/04.docs-contributor-guide/index.mdx`
- Card behavior: `src/components/docs/ChildCard.astro` and `src/components/docs/GuidesChildCard.astro`

## Docs collection fields

Allowed docs fields from the schema:

- `title`
- `sidebarTitle`
- `description`
- `icon`
- `release`
- `version`
- `editions`
- `topics`
- `stage`
- `hideSubMenus`
- `hideSidebar`
- `deprecated`

The contributor guide also documents repo conventions for `docId`, which is used for contextual in-app docs.

## Working checks

1. Confirm the file is in `src/contents/docs`.
2. Confirm the frontmatter fields match the page’s actual role.
3. Check that `title` is specific, user-facing, and uses Title Case.
4. Check that `description` is concise and accurate.
5. Check whether `sidebarTitle` would improve navigation clarity, and keep it in Title Case.
6. Check whether `icon` follows existing section patterns.
7. For guides, check whether `topics` and `stage` are expected.
8. For edition-limited or version-limited content, check `editions` and `version`.
9. For migration guides, check `release`.
10. For contextual docs pages, check whether `docId` is appropriate based on nearby patterns.

## Page-type fit checks

The metadata and the body should point to the same page type.

- Landing pages should orient the reader and link to child pages rather than carrying many worked examples.
- Concept pages should explain what something is and how it works before diving into task detail.
- How-to guides should focus on one outcome with prerequisites, steps, and verification.
- Reference pages should optimize for lookup rather than narrative walkthrough.
- Migration guides should stay tightly scoped to version changes and required actions.

If the frontmatter suggests one page role but the body behaves like another, flag that mismatch even if the raw schema is valid.

## Card-opening rule

The first non-heading, non-import body line may appear in cards and previews. It should:

- explain what the page covers
- stay concise
- avoid filler such as `This page is about`
- work as standalone text outside the full page context

## Common issues

- Missing or vague `description`
- Overlong page titles that should use `sidebarTitle`
- `title` or `sidebarTitle` written in sentence case instead of Title Case
- Guide metadata on pages that are not really guides
- Version or edition flags added without evidence
- Version-specific prose added to a normal page when structured metadata or a migration guide would be more appropriate
- First sentence too long or too generic for cards
- Icon missing on pages that visually belong with neighboring content
