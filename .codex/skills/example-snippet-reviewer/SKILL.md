---
name: example-snippet-reviewer
description: Use this skill when creating, editing, or reviewing code samples, YAML examples, CLI steps, or partial snippets in the Kestra docs repo. Applies to docs and blog content and focuses on teaching value, consistency, and accuracy signals in examples.
---

# Example Snippet Reviewer

Use this skill to review documentation examples as teaching artifacts.

## Scope

- Primary targets: YAML flows, CLI commands, config fragments, API examples, and partial snippets in content files
- Primary concern: whether the example teaches clearly and credibly
- Secondary concern: whether the example matches nearby docs patterns

## What to inspect first

1. Read `references/example-rules.md`.
2. Read the surrounding page section to understand what the example is meant to teach.
3. Check whether the example is full or partial.
4. Check whether the page tells the reader how to interpret or verify the example.

## Default workflow

1. Identify the teaching goal of the example.
2. Remove details that do not support that goal.
3. Check names, IDs, namespaces, inputs, and task labels for consistency.
4. Check code fence language tags and command formatting.
5. Confirm the page explains what the example shows before or after the block.
6. Flag stale, fragile, or unverifiable details.
7. Prefer the smallest safe patch that improves teaching value without changing product meaning.

## Repo-specific rules

- Use realistic minimalism rather than toy placeholders when a clearer product-shaped example is possible.
- Prefer full flows in how-to guides unless the omitted sections are irrelevant and explicitly labeled.
- Keep commands separate from command output where practical.
- If a snippet is partial, say exactly what portion it shows.
- Keep naming consistent within a page and with nearby docs unless there is a clear reason not to.

## Boundaries

- Do not claim that an example was executed unless you actually verified it.
- Do not add fake outputs or unsupported product behavior to make an example feel complete.
- Do not multiply examples when one well-framed example is sufficient.
- Do not rewrite surrounding prose beyond what is needed to frame or interpret the example.

## When to ask instead of guessing

- Multiple example shapes are plausible and the intended audience changes the right choice.
- The example depends on external services, credentials, or version-specific behavior you cannot verify.
- A “minimal” example would omit context that may be essential for user success.
- The existing example appears wrong but the correct behavior is not verifiable from local sources.

## Output expectations

- Distinguish editorial improvements from technical uncertainty.
- Say when an example looks plausible but was not executed.
- Preserve the teaching goal and reduce noise around it.

## Skill maintenance

- Use pressure tests on real docs pages to find example-review gaps.
- If a pressure test reveals a class of example problem the skill did not clearly cover, update `references/example-rules.md` with a concise new check or fix pattern.
- Prefer generalizable checks such as snippet completeness, stability, or framing over page-specific notes.
