# Docs impact checklist

Use this checklist to decide whether an issue and PR require user-facing documentation work.

## High-signal triggers for docs updates

Treat docs updates as strongly indicated when the change introduces or alters:

- a user-visible feature
- a workflow step
- a UI label, screen, or navigation path
- required configuration or environment setup
- defaults, limits, or behavior under common usage
- error handling, failure modes, or troubleshooting guidance
- API fields, request shape, or response shape
- plugin properties, inputs, outputs, or examples
- upgrade or migration behavior
- edition-specific or version-specific availability
- screenshots, diagrams, or recorded walkthroughs that now look wrong

## Lower-signal changes

These often do not need docs unless they change user-observable behavior:

- refactors
- test-only changes
- dependency bumps
- internal naming cleanup
- code movement without product impact
- implementation detail changes hidden behind stable behavior

## Questions to answer

1. What changed for a user, operator, or developer?
2. Who would notice the change without reading the PR?
3. Does the change alter what users must do, see, configure, or expect?
4. Could current docs become misleading or incomplete after this PR merges?
5. Does the change belong in existing docs, release notes, a migration guide, or nowhere?

## Recommended output labels

Use one of these for `docs_required`:

- `required`
- `likely`
- `optional`
- `not needed`

## Candidate doc types

- existing page update
- new how-to guide
- concept page update
- reference page update
- migration guide entry
- release notes mention
- screenshot or media refresh
- no docs change

## Version-handling rule

- Treat normal docs as the source of truth for the current product behavior.
- Do not recommend adding prose like `as of version X.YY` to ordinary docs by default.
- Prefer migration guides for version-to-version change framing.
- Outside migration guides, mention versions only when version scoping is necessary and cannot be handled more cleanly through metadata, structure, or page placement.

## Candidate paths to look for

Search likely source-of-truth pages in:

- `src/contents/docs`
- `src/contents/blogs` when the change is announcement-oriented rather than canonical docs
- migration guides when upgrade behavior changed
- enterprise docs when scope is `EE` or `Cloud`
- plugin developer or how-to sections when the change affects builders rather than end users

## Decision heuristics

- Prefer `required` when users must change behavior or when existing docs would become wrong.
- Prefer `likely` when the change is user-facing but narrow, additive, or low-risk.
- Prefer `optional` when docs would help discoverability but current docs would not be inaccurate.
- Prefer `not needed` when no user-facing behavior or guidance changed.

## Output template

```text
docs_required: required | likely | optional | not needed
user_impact: <1-2 sentence summary>
affected_audience:
- ...
doc_types:
- ...
candidate_paths:
- ...
reasoning:
- ...
gaps_or_unknowns:
- ...
```
