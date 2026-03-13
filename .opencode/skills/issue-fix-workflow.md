# Issue Fix Workflow

Use this workflow whenever the user shares a GitHub issue URL/number and asks for a fix.

1. Read the issue details and all comments first.
2. Extract the expected behavior, including maintainer guidance.
3. Inspect the local codebase for existing patterns (components, style tokens, naming, architecture).
4. Implement the smallest possible change that matches existing project standards.
5. Avoid unrelated edits; keep the diff focused.
6. Verify impact (build/test/lint when possible).
7. If verification cannot run, report exactly why and what was checked instead.
8. Recheck changed files to confirm no accidental modifications.
9. Summarize what changed, why, and how it aligns with project style.
10. If blocked or not fixable, communicate clearly with the blocker and recommended next step.

## Command Checklist

- Issue context: `gh issue view <number> --repo <owner/repo> --comments`
- Working tree check: `git status --short`
- Scope check: `git diff -- <changed files>`
- Optional verification: run project build/tests/lint scripts when available

## Guardrails

- Do not change unrelated files.
- Do not introduce new design patterns if an existing one already covers the use case.
- Prefer project theme tokens and shared classes over local ad hoc styles.
- If a requested fix conflicts with project standards, follow standards and explain the tradeoff.
