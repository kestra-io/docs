---
name: issue-pr-docs-impact-assessor
description: Use this skill when you need to review a GitHub issue and related pull request, determine whether user-facing documentation changes are needed, and identify what docs should be updated. Applies to product, UI, API, workflow, configuration, migration, and behavior changes that may affect Kestra docs.
---

# Issue PR Docs Impact Assessor

Use this skill to decide whether a GitHub issue and connected PR require user-facing documentation work.

## Scope

- Primary target: a GitHub issue, its linked PR, and the PR diff or changed files
- Primary concern: whether the change affects user-facing behavior, workflows, configuration, or upgrade paths enough to require docs updates
- Secondary concern: what kind of docs work is appropriate and where it should likely live

## What to inspect first

1. Read `references/docs-impact-checklist.md`.
2. Read the issue to understand the problem statement, affected audience, and expected behavior.
3. Read the PR description and changed files to understand the implemented behavior, not just the intent.
4. If available, inspect tests, screenshots, migration notes, or release labels for user-facing evidence.
5. Search the docs tree only after you understand the product change well enough to look for likely owners.

## Default workflow

1. Summarize the user-visible change in one or two sentences.
2. Classify the docs impact as `required`, `likely`, `optional`, or `not needed`.
3. Identify the affected audience such as users, operators, plugin developers, enterprise admins, or API consumers.
4. Determine the likely docs type: existing page update, new how-to, concept update, reference update, migration note, release note, or no docs change.
5. Search for likely existing source-of-truth pages in `src/contents/docs` and related collections.
6. Recommend the smallest sufficient docs change that keeps user guidance accurate.
7. Call out unknowns explicitly if the issue or PR does not provide enough evidence.

## Repo-specific rules

- Focus on user-facing impact, not internal refactors with no observable behavior change.
- Treat changed defaults, renamed labels, new required configuration, and altered failure modes as strong docs signals.
- Treat edition-limited, version-limited, or upgrade-sensitive changes as especially likely to require docs work.
- Look for stale examples, screenshots, and workflow steps that the PR may have invalidated.
- Prefer updating an existing authoritative page over creating a new page unless the change introduces a genuinely new user task or concept.

## What this skill should not do

- Do not assume every issue or PR needs docs.
- Do not treat internal code cleanup, dependency bumps, or refactors as docs-worthy unless they change user-facing behavior.
- Do not recommend a new page when an existing source-of-truth page can absorb the change cleanly.
- Do not guess at product behavior that is not evidenced in the issue, PR, diff, or local docs.

## When to ask instead of guessing

- The issue and PR disagree about the intended user-facing behavior.
- The diff suggests a behavior change, but tests or descriptions do not confirm it.
- Multiple docs homes are plausible and there is no clear existing owner.
- The change may be user-facing only in certain editions, versions, or deployment modes and that scope is unclear.

## Output expectations

- Return a compact assessment with these fields:
  - `docs_required`
  - `user_impact`
  - `affected_audience`
  - `doc_types`
  - `candidate_paths`
  - `reasoning`
  - `gaps_or_unknowns`
- Keep the recommendation decision-oriented rather than speculative.
- Say explicitly when the assessment is partial because the issue, PR, or diff was incomplete.

## Skill maintenance

- Use real issue and PR reviews as pressure tests for this skill.
- If a pressure test exposes a docs-impact signal the skill did not clearly instruct you to catch, update `references/docs-impact-checklist.md`.
- Add generalizable decision rules, not page-specific memories.
