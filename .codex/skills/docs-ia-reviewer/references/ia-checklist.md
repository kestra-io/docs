# Information architecture checklist

Use this checklist to evaluate whether docs content lives in the right place and has the right structural boundaries.

## Core questions

1. What is the main user goal for this page or section?
2. Is the page type clear?
3. Is this the best section for that goal and audience?
4. Does another page already own this topic more clearly?
5. Would a user know where to find this content without already knowing it exists?

## Common problem types

- wrong section
- mixed page types
- duplication
- split source of truth
- missing landing page
- weak cross-linking
- page too broad
- page too narrow
- unclear sibling ordering
- enterprise or migration material leaking into evergreen docs

## Signals that a page may need IA work

- The first screen does not make the page's purpose clear.
- The page mixes concept explanation, step-by-step guidance, and reference material without strong structure.
- Multiple pages explain the same task or concept with slightly different instructions.
- A landing page behaves like a full guide instead of routing readers.
- Important child pages are hard to discover from their parent section.
- Users would need to guess whether a topic belongs under concepts, how-to guides, enterprise, plugin developer guide, or migration.
- The page contains version-framed or edition-framed content that likely belongs elsewhere.

## Recommended actions

- `keep` when placement and boundaries are already clear
- `move` when another section is the obvious owner
- `split` when one page is serving multiple main jobs
- `merge` when two pages compete as sources of truth
- `convert to landing page` when a parent page should route rather than teach in depth
- `add cross-links` when the structure is acceptable but discovery is weak

## Decision heuristics

- Prefer the smallest structural change that improves findability.
- Prefer one canonical page over multiple partial explanations.
- Prefer keeping concepts, how-to guides, references, and migration notes distinct unless user needs clearly justify mixing them.
- Prefer adding cross-links before moving content when ownership is already clear and duplication is low.
- Prefer explicit section ownership for enterprise and cloud features.

## Output template

```text
ia_status: good | needs adjustment | restructure recommended
problem_type:
- ...
user_findability_impact: <1-2 sentence summary>
recommended_action:
- ...
candidate_source_of_truth:
- ...
candidate_moves_or_splits:
- ...
affected_paths:
- ...
reasoning:
- ...
gaps_or_unknowns:
- ...
```
