---
title: "How We Unified Our Release Process for Ecosystem tools?"
description: "We maintain SDKs in several languages, a CLI, and an infrastructure-as-code provider (each with its own way of cutting a release). Here's how we replaced that patchwork with a single rule: push a tag to ship, and the tag is the version."
date: 2026-06-17T10:00:00
category: Engineering
authors:
  - name: "Jérémy Maire"
    linkedin: https://www.linkedin.com/in/jeremymaire/
    image: jmaire
    role: Plugins and Ecosystem Engineer
image: ./main.png
schema:
  "@context": "https://schema.org"
  "@type": "FAQPage"
  mainEntity:
    - "@type": "Question"
      name: "What changed in our release process?"
      acceptedAnswer:
        "@type": "Answer"
        text: "Every ecosystem tool now releases the same way: a release happens only when someone pushes a version tag, and that tag states the version. Merging code no longer ships anything on its own."
    - "@type": "Question"
      name: "Does merging code to the main branch trigger a release?"
      acceptedAnswer:
        "@type": "Answer"
        text: "No. Code can land on the main branch freely; nothing reaches users until someone deliberately pushes a version tag. Everyday development and the act of shipping are fully decoupled."
    - "@type": "Question"
      name: "How is the version number decided?"
      acceptedAnswer:
        "@type": "Answer"
        text: "It is stated explicitly on the tag. To release 1.3.0, you tag 1.3.0. There is no inference from commit messages and no guessing from history: the tag is the single source of truth for the version."
    - "@type": "Question"
      name: "Does every tool publish the same way under the hood?"
      acceptedAnswer:
        "@type": "Answer"
        text: "No, and that is intentional. The Go SDK uses GoReleaser, the Java SDK publishes to Maven Central, the JavaScript SDK to npm, and the Python SDK to PyPI. We unified the trigger and the contract (a tag means a release, and the tag names the version), not the per-ecosystem publishing mechanics."
    - "@type": "Question"
      name: "Do release tags need to match a specific Kestra version?"
      acceptedAnswer:
        "@type": "Answer"
        text: "Yes. Each ecosystem tool tracks the Kestra core it is compatible with, so releases are cut from version-specific branches. The person releasing tags the branch that matches the Kestra version the release targets."
---

::::alert{type="info"}
**Ecosystem vs. Plugins:** *Ecosystem* relates to all the tools we build to manage and operate Kestra itself, while *Plugins* are how Kestra connects to the rest of the world. This post is about releasing the **ecosystem** tools.
:::

We ship more than one thing. Alongside Kestra itself, we maintain a set of client SDKs in several languages, a command-line tool ([kestractl](https://kestra.io/docs/kestra-cli/kestractl)), and an infrastructure-as-code provider (our [Terraform provider](https://kestra.io/docs/terraform)). Over time, each of these had grown its own way of cutting a release.

That sounds harmless, but it added up to real friction. So we spent a morning making our releases boring.

## The situation before

Every component released slightly differently, and the inconsistency was its own kind of cost.

- **Different triggers.** Some components released automatically whenever code landed on the main branch. Others released only when someone deliberately created a version tag. The answer to "how does a release happen here?" depended entirely on which component you were looking at.
- **Different version formats.** Version tags didn't follow a single convention. Some carried a `v` prefix, some didn't; some encoded the target language in the tag name. Depending on which project you opened, the same release could look like `v1.2.3`, `1.3.0`, `v1.2.3-python`, or `go-sdk/v1.1.0`. Anyone moving between projects had to relearn the rules each time.
- **Automation that decided versions for you.** A couple of components used a tool that read commit messages and *inferred* the next version number : bump the patch for a fix, the minor for a feature, and so on. Clever, but it meant the version of a release was a side effect of how commits happened to be worded, rather than a deliberate decision. Occasionally it produced a release nobody specifically asked for, simply because the right kind of commit landed on the main branch.

None of this was broken, exactly. But every release carried a little tax of "wait, how does *this* one work again?"

## What we wanted instead

One mental model, everywhere. The goals were simple:

1. **A release is an explicit, human decision** : never an accidental byproduct of merging code.
2. **The version is stated up front**, not inferred after the fact.
3. **The same procedure applies to every component**, so knowledge transfers instantly from one project to the next.

## What we did

We standardized on a single model: **a release happens when, and only when, someone pushes a version tag.**

That one sentence carries the whole design:

- **Merging code never ships anything.** Code can land on the main branch all day; nothing reaches users until a person decides "this is the version we want to release" and tags it. The everyday flow of development is completely decoupled from the act of shipping.
- **The tag is the single source of truth for the version.** Whatever version you put on the tag is exactly what gets published : no inference, no guessing from commit history, no surprises. To release version 1.3.0, you tag 1.3.0. That's it.
- **We removed the automatic, commit-driven releases.** The mechanism that derived versions from commit messages and released straight off the main branch is gone. It optimized for a kind of automation we decided we didn't want: we'd rather releases be rare, deliberate, and obvious than frequent, implicit, and occasionally accidental.
- **We aligned the version format** so tags look the same across components. No more per-project dialects to memorize.

We also kept one important nuance: not every component publishes the same way under the hood. Different languages and ecosystems have genuinely different publishing mechanics. The Go SDK is built and released by GoReleaser, the Java SDK is pushed to Maven Central, the JavaScript SDK is published to npm, and the Python SDK is uploaded to PyPI. We didn't try to flatten those real differences. What we unified was the **trigger and the contract**: everywhere, a tag means a release, and the tag names the version. *How* the artifact then gets built and published can stay native to each ecosystem.

One thing this model still asks you to stay mindful of: a release tag has to target the *right* Kestra version. Each ecosystem tool tracks the Kestra core it's compatible with, so we cut releases from version-specific branches. The tag makes the version explicit but it's on the person releasing to tag the branch that matches the Kestra release it's meant for, so a `1.3.0` of a tool lines up with the Kestra version it actually supports.

## Why this is better

- **Releases are predictable.** Looking at the tags tells you the full release history, and each tag maps to exactly one published version. Nothing ships that wasn't deliberately tagged.
- **There's one procedure to learn.** Whether you're cutting a release for the CLI, a client SDK, or the infrastructure provider, the steps are the same. Onboarding gets easier and mistakes get rarer.
- **Intent is explicit.** A release now reflects a clear human decision: "we are shipping this version, now." That's exactly what a release *should* be.
- **Less magic, less surprise.** Removing the commit-message-driven automation means fewer moving parts and no more "why did that release happen?" moments.

## The takeaway

The interesting part of this work wasn't a clever new tool : it was *removing* cleverness. We traded a set of bespoke, partly-automated release flows for one boring, explicit rule that every engineer can hold in their head: **push a tag to ship; the tag is the version.**

Automation is great when it removes toil. But automation that quietly makes decisions for you, like *what version to release and when*, can cost more in confusion than it saves in keystrokes. Sometimes the best release process is the one that does exactly what you told it to, and nothing more.

## Frequently asked questions

### What changed in our release process?
Every ecosystem tool now releases the same way: a release happens **only when someone pushes a version tag**, and that tag states the version. Merging code no longer ships anything on its own.

### Does merging code to the main branch trigger a release?
No. Code can land on the main branch freely; nothing reaches users until someone deliberately pushes a version tag. Everyday development and the act of shipping are fully decoupled.

### How is the version number decided?
It's stated explicitly on the tag. To release `1.3.0`, you tag `1.3.0`. There's no inference from commit messages and no guessing from history — the tag is the single source of truth for the version.

### Does every tool publish the same way under the hood?
No, and that's intentional. The Go SDK uses GoReleaser, the Java SDK publishes to Maven Central, the JavaScript SDK to npm, and the Python SDK to PyPI. We unified the **trigger and the contract** — a tag means a release, and the tag names the version — not the per-ecosystem publishing mechanics.

### Do release tags need to match a specific Kestra version?
Yes. Each ecosystem tool tracks the Kestra core it's compatible with, so releases are cut from version-specific branches. The person releasing tags the branch that matches the Kestra version the release targets.
