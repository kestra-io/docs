---
title: "Introducing Kestra Fundamentals: Workflow Orchestration from First Principles"
description: "Workflow orchestration is a craft with a real conceptual stack. The Kestra Fundamentals course introduces the core principles through working examples across data pipelines, infrastructure, and business processes, and a certification when you're done."
date: 2026-05-04T09:00:00
category: Solutions
author:
  name: Elliot Gunn
  image: egunn
  role: Product Marketing Manager
image: ./main.png
---

Workflow orchestration shows up everywhere: data pipelines that ETL across a dozen systems, infrastructure jobs that provision and tear down on a schedule, business processes that loop through thousands of records and alert a human when something needs review. The underlying problem is the same in all three cases: coordination, not just execution.

Most engineers arrive at this coordination layer in pieces. A tutorial here, a Stack Overflow answer there, a few days of trial and error. That's enough to ship. It's not enough to reason: to know why a flow is shaped the way it is, when to reach for a [subflow](../../docs/05.workflow-components/10.subflows/index.md) instead of inline tasks, or how to turn a scheduled job into an event-driven one without rewriting it.

The [Kestra Fundamentals course](https://academy.kestra.io/kestra-fundamentals) closes that gap. It's a self-led course across four modules (introduction, core concepts, plugins and blueprints, and a quiz), with hands-on examples throughout. Pass the quiz and you earn a certificate that lives on your LinkedIn profile.

<div class="video-container">
<iframe width="100%" height="100%" src="https://www.youtube.com/embed/EjNvS69nUVE" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

## Who this course is for

You'll get the most from the course if one of these sounds like you:

- **You're new to Kestra and want to learn it properly.** You've seen enough to know it's worth understanding deeply, and you want to build the mental model from scratch rather than copying examples until something works.
- **You're evaluating Kestra for your team.** You want to understand the abstractions well enough to tell whether the tool fits your use case, not just whether it technically can do what you need.
- **You're moving off another orchestration tool.** The concepts don't map one-to-one to what you used before, and you want the new model, not a translation.

Prerequisite: you're comfortable enough with YAML to read a config file, and you've written at least one script that fetches data or automates something.

## What the course covers

### Orchestration isn't scheduling

A workflow orchestrator isn't a fancy scheduler. The scheduling part is almost incidental.

What an orchestrator actually does: coordinates multi-step workflows in the right order, monitors for errors and handles them gracefully, triggers work based on schedules and events, and provides visibility into what's running and what went wrong. That applies whether you're building [data pipelines](../../docs/use-cases/01.data-pipelines/index.md), automating [infrastructure](../../docs/use-cases/04.infrastructure/index.md), or running business processes and AI workflows. When a task fails, an orchestrator tells you which task failed, why it failed, what its inputs were, and what it produced before it died. A scheduler tells you nothing.

The first module makes that distinction concrete. You build a workflow from scratch, break it on purpose, and see exactly what you can recover when things go wrong.

### The concepts that compound

The rest of the course walks the conceptual stack in order: [flows](../../docs/05.workflow-components/01.flow/index.md), [tasks](../../docs/05.workflow-components/01.tasks/index.mdx), [inputs](../../docs/05.workflow-components/05.inputs/index.md), [outputs](../../docs/05.workflow-components/06.outputs/index.md), [triggers](../../docs/05.workflow-components/07.triggers/index.mdx), [expressions](../../docs/expressions/index.mdx), [flowable tasks](../../docs/05.workflow-components/01.tasks/00.flowable-tasks/index.md). You can't understand expressions without outputs. You can't use flowable tasks without expressions. Learning them out of order means memorizing syntax without a model. Learning them in order means each piece has somewhere to land.

Two ideas in particular don't get enough attention in most orchestration docs, and the course gives each one a proper treatment:

**[Language-agnosticism](/features/code-in-any-language) is the whole point.** Kestra workflows are written in YAML, but tasks run in any language. One flow can call a Python script, run a SQL query, execute a shell command, and hit an HTTP endpoint. YAML is the coordination layer, not the implementation language. Your existing scripts don't need to be rewritten to be orchestrated; they just need to be wrapped.

**The [execution context](../../docs/05.workflow-components/03.execution/index.md) is your state manager.** Tasks produce outputs; downstream tasks pull from them through expressions. You're not passing state through files, environment variables, or a sidecar database. Once you see how data actually moves through a flow, debugging changes from guesswork to tracing.

By the end of this module, you can read any Kestra flow and understand what it does, and reach for the right abstraction for the problem instead of the nearest one you've copied.

### Plugins and blueprints

[Plugins](/plugins) are how your workflows connect to the outside world. Every task type in Kestra is backed by a plugin, the extension layer that lets you interact with any external system without writing custom integration code. There are 1200+ of them, covering the systems you're likely already using: [PostgreSQL](/plugins/plugin-jdbc-postgres), [S3](/plugins/plugin-aws), [Slack](/plugins/plugin-slack), [Snowflake](/plugins/plugin-jdbc-snowflake), [dbt](/plugins/plugin-dbt), [Kafka](/plugins/plugin-kafka). You declare what you want; the plugin handles the rest.

Every workflow is unique, but most start from the same base patterns: fetch data and load it somewhere, monitor a service and alert on failure, loop through records and trigger downstream logic. [Blueprints](/blueprints) are production-ready workflows built around those patterns. You copy one, run it, and adapt it to your environment rather than reasoning from scratch each time. The [Data Engineering Pipeline Blueprint](/blueprints/data-engineering-pipeline) gives you a complete ETL out of the box: fetch from an API, transform with Python, load into a database. The [Microservices and APIs Blueprint](/blueprints/microservices-and-apis) hands you a working health-check workflow. That's how the course approaches hands-on learning: you're always working from something real.

### The certification

Orchestration is one of those skills most engineers pick up informally, which makes it hard to demonstrate. Anyone can say they've built pipelines.

That's why we added a quiz that you have to pass to get a certificate you can post to LinkedIn. The certificate says something more specific: that you understand what an [execution](../../docs/05.workflow-components/03.execution/index.md) is, how data flows between [tasks](../../docs/05.workflow-components/01.tasks/index.mdx), when to use a [subflow](../../docs/05.workflow-components/10.subflows/index.md), and how to make a workflow [event-driven](../../docs/05.workflow-components/07.triggers/index.mdx).

Set aside an afternoon and [take the Kestra Fundamentals course](https://academy.kestra.io/kestra-fundamentals). When you earn your certificate, share it with us. We'd love to see it.
