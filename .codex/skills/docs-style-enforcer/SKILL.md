---
name: docs-style-enforcer
description: Use this skill when drafting, editing, or reviewing Kestra docs prose for clarity, structure, tone, and consistency. Applies to Markdown and MDX content in the docs repo and enforces the Kestra documentation style guide without changing technical meaning.
---

# Docs Style Enforcer

Use this skill for editorial cleanup and style review in the Kestra docs repo.

## Scope

- Primary target: prose in docs content files
- Primary concern: clarity, tone, structure, terminology, and scannability
- Secondary concern: whether a page matches its intended page type

## What to inspect first

1. Read `references/style-guide.md`.
2. Read the target page from top to bottom once before editing.
3. Check the first sentence carefully because cards and previews may reuse it.
4. If page-type expectations matter, compare the page against the contributor guide in `src/contents/docs/04.contribute-to-kestra/04.docs-contributor-guide/index.mdx`.

## Default workflow

1. Identify the page type: concept, how-to guide, reference page, landing page, or migration guide.
2. Check whether the page opening explains the topic clearly and quickly.
3. Review headings for sentence case, clarity, and redundancy.
4. Tighten prose for second person, active voice, present tense, and direct wording.
5. Remove hype, filler, vague claims, and unnecessary formatting.
6. Normalize terminology within the page.
7. Check whether procedures include prerequisites, ordered steps, and verification.
8. Make the smallest set of edits that materially improves readability and consistency.

## Repo-specific rules

- Keep the first sentence short and standalone.
- Match existing Kestra terminology and page patterns before introducing new phrasing.
- Keep internal links relative when the destination is source content.
- Use alerts only when the information is genuinely warning-, outcome-, or context-worthy.
- Prefer concise paragraphs and shallow heading depth.

## Boundaries

- Do not invent product behavior, version claims, or architectural details.
- Do not change technical meaning to make prose sound smoother.
- Do not force a full rewrite when targeted edits solve the problem.
- Do not ask unnecessary clarification questions for routine copy edits; ask only when meaning or intent is genuinely ambiguous.

## When to ask instead of guessing

- The source text appears technically wrong and you cannot verify the right statement.
- Terminology conflicts with product naming and local evidence is inconclusive.
- Rewriting for clarity would require changing the page’s intent or audience.
- The page mixes multiple page types and the fix is structural rather than editorial.

## Output expectations

- Preserve intent while improving clarity.
- Flag style issues separately from technical uncertainty.
- Say when a change is based on the Kestra style guide versus a local page-pattern inference.
