---
title: When Your API Writes Its Own Docs With Kestra
description: This is the story of how Gravitee, a 2024 Gartner® Magic Quadrant
  Leader for API Management, brought orchestration and AI together to generate
  documentation, optimize ML models, and scale real-time pipelines with Kestra.
metaTitle: "Gravitee & Kestra: When Your API Writes Its Own Docs"
metaDescription: This is the story of how Gravitee, a 2024 Gartner® Magic
  Quadrant Leader for API Management, brought orchestration and AI together to
  generate documentation, optimize ML models, and scale real-time pipelines with
  Kestra.
heroImage: ./hero.jpg
featuredImage: ./hero.jpg
logo: ./logo.svg
logoDark: ./logo-dark.svg
tasks:
  - io.kestra.plugin.jdbc.postgresql.Query
  - io.kestra.plugin.docker.Run
  - io.kestra.plugin.notifications.slack.SlackIncomingWebhook
  - io.kestra.plugin.core.http.Request
kpi1: |-
  ##### Zero
  Customer training needed
kpi2: |-
  ##### 50%
  Reduction of Pipelines maintenance time
kpi3: |-
  ##### 2
  Engineers to build the product
quote: Our goal is for Kestra to become the go-to solution across the
  organization whenever data wrangling and complex pipeline orchestration are
  needed.
quotePerson: Rémi Sultan
quotePersonTitle: AI/ML Lead
industry: API Management
headquarter: Denver, Colorado, USA
solution: Gravitee brings modern DevOps principles to API management with
  built-in support for GitOps, Kubernetes, and APIOps.
companyName: Gravitee
---

[Gravitee](https://www.gravitee.io/) was born from a simple promise: make APIs easier to use, manage, and understand. Since its founding in 2015, the company has grown into a Gartner-recognized leader in API management, powering ecosystems for global brands like Michelin, Roche, and Blue Yonder.

But as Gravitee expanded its capabilities and customer base, it faced a familiar challenge shared by many modern API platforms: how do you generate documentation that evolves with your APIs, without creating more work for developers?

At the heart of that question was Gravitee’s **SpecGen system**, an internal engine that watches real-world API traffic and uses a combination of machine learning and generative AI to create OpenAPI specifications. But SpecGen alone wasn’t enough. It needed orchestration—flexible, scalable, developer-friendly automation that could bring the whole system to life.

That’s when Gravitee turned to Kestra.

## A Button That Writes the Docs

For Gravitee, the end goal was remarkably elegant: give every customer the power to generate accurate, well-written API documentation with a single click. Behind that click, though, sat a much more complex reality.

> “We wanted our users to generate docs with one click. That’s it. Just press a button, and get something usable, readable, and correct.”— Rémi Sultan, AI/ML Lead


That simple interaction hides an entire pipeline: detecting changes, validating data, transforming formats, querying models, formatting responses, and flagging any errors. Building it manually would’ve required a brittle mesh of scripts and processes, held together with fragile scheduling and constant babysitting. That wasn’t an option.

Kestra offered a clear alternative—declarative workflows that could be triggered programmatically, monitored in real time, and extended as needed.

## From Fragmented Tools to Fluid Workflows

Before Kestra, Gravitee’s orchestration options were limited to traditional CI/CD pipelines and overly prescriptive automation tools. These systems, while reliable for deployments, weren’t built for the long-running, resource-intensive tasks that SpecGen required. They lacked flexibility, didn’t support their preferred stack, and offered little visibility into what was happening when things broke.

> “Most tools we tried became the bottleneck. You had to work around their limitations instead of solving real problems.”
> 

Kestra changed that dynamic. The team could now define workflows in YAML, run their Python preprocessing inside Docker containers, connect with SQL databases to trigger workflows automatically, and call out to LLM APIs to generate natural-language summaries. The orchestration layer was finally under control—and it wasn’t locked to a single programming language or cloud provider.

## From ML Strategy to Production Reality

The engineering problem didn’t stop at documentation generation. Gravitee’s SpecGen system was designed to evolve over time through a **champion/challenger** strategy: evaluate new ML models against production traffic, compare their performance, and promote the winner. But coordinating these experiments manually was costly and fragile.

Kestra made it natural. With flows orchestrating every step, from ingesting API traffic, to running challenger models in parallel, to measuring accuracy and latency—the team could move faster, test more, and iterate without fear.

> “You can literally debug a flow live, fix a task, and replay it without restarting. It’s like time travel for pipelines—and a huge productivity boost.”
> 

The level of resilience was a game-changer. If any step failed, the team could inspect the output, tweak the logic, and resume execution from exactly where it left off. it was orchestration designed for data science.

## Building Confidence, Not Just Pipelines

With Kestra, Gravitee built a documentation system that now runs with minimal supervision, scales as their customer base grows, and can adapt to whatever technologies they need to integrate next. Implementation took just two engineers over six months—proof that the tool was built for fast iteration and thoughtful design.

> “Kestra is already changing how we work. Eventually, it’ll be our default for anything involving data, automation, or machine learning.”
> 

The engineering impact is clear: fewer manual interventions, less time spent troubleshooting, and a platform that enables not limits the pace of development. But just as importantly, it gave Gravitee something harder to quantify: confidence.

Confidence that their automation would hold. That their customers would always see the latest version of the truth. That AI workflows could be transparent, testable, and collaborative.

> “It’s great to go with solutions that open-source their code—it builds confidence. Kestra is super easy to use, works with any code, and comes with tons of ready-made connectors.”

## One Button. Full Automation. Better APIs.

By pairing orchestration with generative AI, they transformed what used to be a burden into a value-add. Developers don’t need to worry about staying up to date. They just press the button. Kestra takes care of the rest.

And as their systems grow, so will the workflows behind them. More AI. More data. More automation. All orchestrated, all observable, all flexible enough to scale.

This is what orchestration looks like, when it’s built to work with you.

Thanks to Rémi SULTAN and the Gravitee team for sharing their success with Kestra.


