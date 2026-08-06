---
title: "Kestra 2.0 is almost here: help shape the future of orchestration"
description: "Kestra 2.0 rebuilds the execution engine, redesigns the UI, and stays Apache 2.0. Run the release candidates on your own workloads and tell us what breaks."
date: 2026-08-06T10:00:00
category: News & Product Updates
author:
  name: Ludovic Dehon
  image: ldehon
  linkedin: https://www.linkedin.com/in/ludovic-dehon/
  role: CTO & Co-founder
image: ./main.png
---

Kestra 2.0 marks the biggest update in the project's history with a complete overhaul of the execution engine, a redesigned UI, and the most substantial set of changes we've ever released. Importantly, **Kestra 2.0 remains open source under the Apache 2.0 license**, the same as from the start. Unlike many projects that use major versions to change licenses, we are leveraging ours to open up earlier.

## Why consider 2.0

Here is a glimpse of what the release will change for you:

- **Run it where your business rules require.** Stateless workers use gRPC to communicate with the control plane and do not directly access the database, even in different regions, restricted networks, or air-gapped environments.
- **From seconds to milliseconds.** Large task outputs are loaded on demand, so thousands of tasks and gigabytes of outputs no longer slow the UI or the database.
- **Better developer experience.** Cleaner flow semantics, a redesigned interface, Drafts you can run mid-edit, and AI-generated flows from plain English.
- **MCP to expose your flows.** One trigger turns any flow into a named tool agents can discover and call, from Claude, Cursor, or any MCP client.
- **Use AI to create your flows.** Create and manage Kestra flows from your favorite AI assistant, all powered through the Kestra MCP server.

Will walks through all of it in the video below if you want to see it running rather than read about it.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/kVzXYvGrKwc" title="Kestra 2.0 is almost here" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Already tested. Now it meets your workloads.

Every release candidate undergoes our QA across the full deployment matrix, and we run 2.0 in production on our own infrastructure, orchestrating our own workloads. Release candidates ship roughly every two weeks. You can [pull the v2.0.0-rc7 Docker image](https://hub.docker.com/layers/kestra/kestra/v2.0.0-rc7/images/sha256-e85ab0746d54f7d6c87cbc31fefa587caeb28f78b55ea81a89e893eadf3e6442) and run it today.

What we cannot reproduce in any test lab is your stack. Your flows, plugins, deployment, and edge cases. That is the part only you can bring, and it is exactly the feedback that shapes what GA looks like.

Found something? Open an issue on [the public repo](https://github.com/kestra-io/kestra/issues). Kestra 2.0 issues go where yours go, and the community can see what we are fixing and why. If you want to go further, the door to [contributions](/docs/getting-started/contributing) is open too. Docs, plugins, bug fixes: there is plenty of surface to help with.

## Want your fingerprints on the release? Join the Early Adopter Program

The [Early Adopter Program](/early-adopter-program) is designed for teams that want to put a release candidate through real-world workloads before GA and to influence what ships.

What you get:

- Pre-release builds as they ship, with the changelog that matters
- Weekly office hours with the team building 2.0. Ask anything, show your flows, get unblocked live
- A direct line to the engineers: what you report lands in the next RC, and you will see it fixed
- A head start on migration, with our engineers looking at your actual flows, so upgrade day is a non-event for you while everyone else is just getting started

More than 40 teams have already joined, running the current release candidate against production-shaped workloads. Their feedback has already changed what ships at GA, from migration docs tested by the program itself to fixes landing in RC after RC. The 2.0 that reaches everyone else will be partly their release. It can be partly yours.

And if you would rather watch before you jump in, we are hosting a series of pre-launch sessions in the coming weeks covering governance, scale, AI, and deployment.

## What about migration?

Your existing flows continue to work. A few advanced constructs, such as ForEach and trigger conditions, will require a guided migration.

We would rather tell you now than surprise you later, so we built the tooling first. The [flow migration CLI](https://github.com/kestra-io/kestra2-flow-migration) is already public: point it at your flow YAML to get a per-flow diff of what 2.0 changes, and preview everything with a dry run before touching anything. The full migration guide documents every change with before-and-after examples.

## The releases you remember are the ones you were part of

Kestra exists because engineers adopted it, contributed to it, and trusted that the open-source core would remain open. A major version is exactly the moment when that trust is tested, and exactly the moment when we get to prove it holds.

Kestra 2.0 is almost here. Download [the latest release candidate, v2.0.0-rc7](https://github.com/kestra-io/kestra/releases/tag/v2.0.0-rc7), or [pull the same build from Docker Hub](https://hub.docker.com/layers/kestra/kestra/v2.0.0-rc7/images/sha256-e85ab0746d54f7d6c87cbc31fefa587caeb28f78b55ea81a89e893eadf3e6442). Then join the [Early Adopter Program](/early-adopter-program), or tell us what you found on [Slack](/slack).

The engine is rebuilt. Help shape the future of orchestration.
