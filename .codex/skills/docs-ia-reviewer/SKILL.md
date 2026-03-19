---
name: docs-ia-reviewer
description: Use this skill when you need to assess or improve the information architecture of Kestra docs, including page placement, page boundaries, section structure, duplication, source-of-truth ownership, and navigation clarity.
---

# Docs IA Reviewer

Use this skill to review or improve information architecture in the Kestra docs repo.

## Scope

- Primary target: one page, a small section, or a group of related docs pages
- Primary concern: whether content is in the right place and structured for findability and maintainability
- Secondary concern: whether the current section, hierarchy, or source-of-truth model creates duplication or user confusion

## What to inspect first

1. Read `references/ia-checklist.md`.
2. Read the target page or section and identify its main user job.
3. Inspect nearby siblings, parent index pages, and likely competing pages.
4. Check whether the content overlaps with existing docs, how-to guides, concepts, migration guides, or enterprise docs.
5. Review local navigation signals such as numbered directories, landing pages, `ChildCard` usage, and section titles only after you understand the content itself.

## Default workflow

1. Identify the page or section's primary user goal.
2. Decide whether the content type is concept, how-to guide, reference, landing page, migration guide, or mixed.
3. Check whether the current section is the right home for that content type and audience.
4. Look for duplication, split ownership, or competing source-of-truth pages.
5. Assess whether the page is doing too many jobs at once.
6. Recommend the smallest structural change that meaningfully improves findability and maintainability.
7. If changes are needed, propose concrete actions such as keep, move, split, merge, convert to landing page, or add cross-links.

## Repo-specific rules

- Prefer one clear source of truth for each recurring task, concept, or reference topic.
- Prefer existing sections and established patterns over inventing new top-level categories.
- Keep migration-specific material in migration guides unless users would otherwise get incorrect evergreen guidance.
- Keep edition-specific material clearly scoped to enterprise or cloud docs when that is the real owner.
- Treat numbered directories and landing pages as navigation tools, not just storage locations.
- Prefer updating an existing landing page or canonical page before creating a new standalone page.

## What this skill should not do

- Do not rewrite prose unless a tiny structural example is needed to explain the recommendation.
- Do not recommend broad reorganizations without clear user-findability justification.
- Do not create duplicate hubs or new sections when a local fix would solve the problem.
- Do not treat every long page as an IA problem; some pages are long because the topic is inherently broad.

## When to ask instead of guessing

- Two sections are plausible homes and both have a credible claim to ownership.
- A move would materially affect docs URLs, backlinks, or external references and the tradeoff is unclear.
- The content serves multiple audiences with no obvious primary one.
- The recommendation would require a broad reorganization rather than a local improvement.

## Output expectations

- Return a compact assessment with these fields:
  - `ia_status`
  - `problem_type`
  - `user_findability_impact`
  - `recommended_action`
  - `candidate_source_of_truth`
  - `candidate_moves_or_splits`
  - `affected_paths`
  - `reasoning`
  - `gaps_or_unknowns`
- Prefer decisions such as `keep`, `move`, `split`, `merge`, `convert to landing page`, or `add cross-links`.
- Tie recommendations to user journeys and source-of-truth quality, not just personal preference.

## Skill maintenance

- Use real page and section reviews as pressure tests for this skill.
- If a pressure test reveals an IA pattern the skill did not clearly instruct you to catch, update `references/ia-checklist.md`.
- Add generalizable structural rules, not one-off page memories.
