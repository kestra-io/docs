# Example rules

Use this checklist for docs examples and snippets.

## Core goals

- The example should teach one clear thing.
- The example should look credible to a technical reader.
- The example should be as small as possible without becoming misleading.

## Naming defaults

Use existing local patterns first. If no local pattern is established, these defaults are reasonable:

- namespace: `company.team`
- flow id: kebab-case such as `http-request-example`
- task ids: descriptive snake_case or kebab-case, but stay consistent within the example
- inputs: short, descriptive names

## Review checks

1. Is the example full or partial?
2. Does the page say what to look for in the example, not just what the example is?
3. Is the code fence tagged with the correct language?
4. Is the snippet complete, with closed quotes, balanced delimiters, and a complete command or program?
5. Are identifiers and values consistent?
6. Are there unnecessary branches, options, or unrelated details?
7. Does the example reflect current product terminology and likely behavior?
8. Does the example rely on unstable tags, release-candidate images, or external services that may age poorly?
9. Does the page explain how to verify success?
10. For operational setup examples, should image tags or versions be pinned for reproducibility, or at least called out explicitly if they are intentionally floating?

## Common fixes

- Replace vague IDs with descriptive ones.
- Remove unrelated steps or parameters.
- Label partial snippets explicitly.
- Fix truncated snippets and unbalanced quotes before making stylistic edits.
- Add a short lead-in before the block.
- Add a short lead-in that tells the reader what the example demonstrates or what to notice.
- Add a brief interpretation or verification note after the block.
- Split commands from output when copy-paste matters.
- Flag floating `latest` tags in setup and deployment examples for review, even if you do not change them automatically.

## Technical caution

- Prefer validated examples when feasible.
- If you cannot run or verify an example, avoid overstating confidence.
- Flag deprecated syntax, outdated behavior, and brittle external dependencies.
