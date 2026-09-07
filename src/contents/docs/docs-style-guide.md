---
title: Kestra Docs Style Guide
h1: Kestra Docs Style Guide
description: Writing and editorial standards for Kestra documentation contributors.
hideSidebar: true
---

Writing and editorial standards for the Kestra docs. Use it when writing new pages, reviewing pull requests, or editing existing content.

## Core principles

- **Be clear before being clever.** Optimize for task completion, not elegance.
- **Explain the why, not just the how.** Readers who understand the reason make better decisions when the instructions don't perfectly match their situation.
- **Write for a global technical audience.** Avoid idioms, culturally specific references, and assumed familiarity.
- **Prefer consistency over novelty.** Match existing Kestra terminology and page patterns before introducing new phrasing.
- **Keep the page focused.** One dominant page type per page. Mixed-type pages are harder to write and harder to use.

## Page types

Every docs page should have a single dominant type. Mixed-type pages are harder to write and harder to use.

| Type | Purpose | Examples |
|---|---|---|
| **Landing page** | Orient readers and route them to sub-pages | Section index pages |
| **Concept** | Explain what something is and why it matters | Architecture, Multi-tenancy |
| **How-to guide** | Drive one specific task to completion | How to set up webhooks |
| **Reference** | Help readers look up facts quickly | API reference, CLI commands |
| **Migration guide** | Explain what changed between versions and how to adapt | pluginDefaults Removed |

If you find yourself writing a concept explanation inside a how-to, extract it. If you find a how-to inside a reference page, move it.

## Page openings

The first sentence is the most important on the page. It appears in ChildCards, search results, and link previews.

**Requirements:**
- Explains what the page covers in plain language
- Stands alone without context from the title or URL
- Stays under 30 words
- Uses no filler: avoid "In this page," "This document will," "Welcome to," or "This guide covers"

**Before:**
> In this guide, we will walk through how you can configure webhooks to trigger Kestra flows.

**After:**
> Configure a Webhook trigger to start a flow in response to an HTTP POST request.

## Voice and tone

- **Second person** — address the reader as "you." Never use "we," "our," or first-person plural; Kestra docs address the reader, not the writing team.
- **Active voice** — prefer "Kestra executes the task" over "the task is executed by Kestra."
- **Present tense** — describe product behavior as it is now, not as it will be or was.
- **Direct** — cut filler phrases. "Note that," "It's worth mentioning," "Simply," and "Just" add no meaning.
- **Calm and technical** — avoid enthusiasm markers ("powerful," "amazing," "easy"), anthropomorphism ("Kestra knows," "the task understands"), and marketing language.

## Headings

- Use **sentence case** for all body headings — capitalise only the first word and proper nouns.
- Use **Title Case** for `title` and `sidebarTitle` in frontmatter.
- Do not restate the page title as the first H2. The first heading should introduce the first distinct section.
- Keep heading depth shallow. Prefer H2 and H3; use H4 only when genuinely necessary.
- Make headings descriptive. "Configuration" is vague; "Configure internal storage" is specific.

**Before:**
> ## Introduction to webhooks
> ### What is a webhook?
> #### Example of webhook usage

**After:**
> ## How webhooks work
> ### Configure a webhook trigger

## Capitalization

Kestra has specific capitalization conventions. The key principle: capitalize a term when referring to the named product entity; use lowercase for the generic concept.

| Term | Generic (lowercase) | Product entity (capitalized) |
|---|---|---|
| flow | "orchestrate your flows" | "open the Flow editor" |
| task | "add a task to the flow" | — (always generic) |
| namespace | "organize flows by namespace" | — (always generic) |
| execution | "view past executions" | "open the Executions tab" |
| trigger | "add a trigger" | "a Webhook trigger," "a Flow trigger" |

**Always match visible UI labels exactly**, including capitalization and punctuation. If the UI says "Worker Queues," write "Worker Queues," not "worker queues."

Kestra feature names that are always capitalized:
- Policies, Worker Queues, Apps, Blueprints, AI Copilot
- Internal Storage (when referring to the storage layer)
- RBAC (always acronym)

## Procedures

A procedure drives one task to completion. Structure it as:

1. **Goal sentence** — one line describing what the reader will accomplish.
2. **Prerequisites** — what the reader needs before starting. Use a dedicated prerequisites section, not buried alerts or body text.
3. **Numbered steps** — each step is one action, written as an imperative verb ("Click **Create**," "Set the `region` property").
4. **Verification** — how the reader confirms it worked.
5. **Next steps** — where to go from here, if relevant.

Avoid collapsing multiple actions into one step. "Click Create, fill in the form, and save" is three steps.

## Code and examples

- Introduce every code block. Tell the reader what they are about to see before they see it.
- Specify the language on every fenced code block: ` ```yaml `, ` ```bash `, ` ```python `.
- Prefer complete, runnable examples in how-to guides. If an example is intentionally incomplete, say so explicitly.
- Explain the result or the key decision after the block when it isn't obvious.
- Use `company.team` as the namespace in all flow examples.

**Before:**
> Here is an example:
> ```yaml
> kestra:
>   storage:
>     type: s3
> ```

**After:**
> Configure internal storage to use AWS S3:
> ```yaml
> kestra:
>   storage:
>     type: s3
>     s3:
>       bucket: "kestra-internal-storage"
>       region: "us-east-1"
> ```
> Replace `bucket` and `region` with your own values. See [internal storage configuration](./configuration/02.runtime-and-storage/index.md) for all available options.

## Alerts

Use alerts sparingly. Reserve them for content that would cause failure or confusion if missed.

| Alert type | When to use |
|---|---|
| `warning` | Destructive, irreversible, or data-loss actions |
| `info` | Prerequisites, edition requirements, or non-obvious constraints that affect correctness |
| `success` | Rarely needed; only for outcomes that are genuinely non-obvious |

**Do not use alerts for:**
- General information that works equally well as a sentence in body text
- Tips or suggestions that are optional
- Two alerts in a row — consolidate or convert one to prose

## Links and media

**Links:**
- Use descriptive link text. "See [Policies](./policies)" not "click [here](./policies)."
- Link to the source of truth rather than duplicating content across pages.
- Use relative links between docs pages.

**Screenshots:**
- Include a screenshot only when it materially helps — a complex UI interaction, a before/after comparison, or a result that is hard to describe in words.
- Write descriptive alt text that describes what is shown, not just what the image is called.
- Keep screenshots current. An outdated screenshot is worse than no screenshot.

**Videos:**
- Embed videos after the page's opening sentence, before the main content, using the `video-container` div class.
- Do not use videos as a substitute for written content — readers on slow connections or screen readers cannot access them.

## What to remove

Cut the following on sight:

- **Promotional language** — "powerful," "flexible," "seamless," "robust," "best-in-class"
- **Vague claims** — "easy to use," "quick and simple," "at any scale" without qualification
- **Throat-clearing** — "In this guide we will," "Before we get started," "It is important to note that"
- **Filler adverbs** — "simply," "just," "easily," "quickly"
- **Decorative screenshots** — images that show the UI but add no information the text doesn't already convey
- **Unexplained code blocks** — a block with no introduction or follow-up explanation
- **Redundant alerts** — information already in the body text repeated in an alert box

## Version references

Docs describe the current supported behavior by default. Avoid phrases like "as of version X.Y," "starting in version X.Y," or "currently" in normal docs pages — these go stale and create confusion about what applies to the reader's version.

**Exceptions:**
- Migration guides — always version-scoped by design
- A `version` frontmatter property on a page, which renders a version badge automatically
- An inline `:::badge` component when a single section of a page applies only to certain versions

Outside these cases, if version scoping is necessary, prefer structured metadata over prose mentions.

## Review checklist

Before submitting or approving a docs change, verify:

1. The page type is clear and consistent throughout.
2. The first sentence stands alone as a summary.
3. All body headings use sentence case.
4. Capitalization matches Kestra feature names and visible UI labels.
5. Prose is second person, active voice, and present tense.
6. No filler phrases, hype, or anthropomorphism.
7. Terminology is consistent within the page and matches the rest of the docs.
8. Every code block is introduced and (where non-obvious) followed by an explanation.
9. Links use descriptive text and point to the source of truth.
10. Screenshots are current and earn their place.
11. Alerts are used only for genuinely warning- or constraint-worthy content.
12. The reader can verify success or find the next relevant path.
