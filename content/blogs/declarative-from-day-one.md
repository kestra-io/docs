---
title: "Declarative from Day One: Why we choose this path"
description: Many platforms are now touting declarative configurations or visual builders, trying to retrofit declarative features into complex workflow code systems.
date: 2025-04-16T13:00:00
category: Solutions
author:
  name: Emmanuel Darras
  image: edarras
  role: CEO & Co-Founder
image: /blogs/declarative-orchestration.jpg
---

[Kestra](https://github.com/kestra-io/kestra) committed to a **declarative-first approach** from day one – and we’re more convinced than ever that it was the right decision. While others bolt on YAML or no-code layers as afterthoughts, Kestra was **designed from the ground** to be declarative, flexible, and language-agnostic.

Kestra is fully **declarative by design**. It provides a clean foundation for orchestrating complex workflows with clarity and scale. You’ll see why this approach reduces friction, enables true flexibility, and empowers both engineers and business users alike.

## Declarative Foundation: YAML Workflows by Design

We embraced **Infrastructure-as-Code principles** for workflow orchestration. At its core, Kestra uses YAML to define workflows – a human-readable configuration that describes how tasks and processes connect, without locking you into any specific programming language. This declarative YAML foundation brings multiple benefits:

**Clarity and Readability:** A Kestra workflow is essentially a YAML document describing what needs to happen (tasks, dependencies, triggers) rather than imperative code on *how* to do it. This makes workflows easy to read and reason about, even for those who aren’t familiar with the underlying code. As one comparison noted, in code-first tools like Airflow you must read Python to understand the DAG, whereas Kestra’s YAML flows don’t require programming skills to be readable. The syntax is simple enough that more people in an organization can collaborate on building and reviewing workflows.

**Abstraction & Flexibility:** By declaring ***what* the workflow should do** in YAML, we separate orchestration logic from business logic. Your data transformation code (SQL, Python, Java, etc.) lives in tasks or external scripts, and Kestra orchestrates these pieces from the YAML plan. This means you can swap out or modify task implementations without rewriting the orchestration layer. The business logic remains in the language of your choice while the workflow’s **coordination** is handled in Kestra’s config. It’s a powerful separation of concerns that keeps pipelines flexible and maintainable.

**Versionability and Governance:** Workflows as YAML files can be treated just like code in version control. Kestra fully supports Git integration and even has an official Terraform provider to manage flows as code. Every change is a diff in YAML, enabling peer reviews and audit trails. Unlike code-first systems where a pipeline change might mean pushing a new code deploy, Kestra allows updating the YAML via UI or API and the change takes effect immediately. No need to redeploy application servers for a simple workflow tweak. This dramatically shortens the feedback loop for developing and improving workflows.

Even if you use Kestra’s UI to modify a workflow, the platform is still generating and updating the YAML definition under the hood. The source of truth is always the declarative config. In fact, any change made via the UI or API automatically adjusts the YAML, ensuring the orchestration logic is **always** managed as code. This consistency is something retrofitted approaches struggle with. Other orchestrators often require separate steps or config files for different concerns (one file for pipeline code, another for scheduling, plus manual UI setup for triggers) – essentially bolting a declarative layer onto an imperative core. Kestra avoids that complexity entirely: **one YAML file can encapsulate tasks, dependencies, schedules, and event triggers** in one place. We built it that way intentionally, and it pays off in far simpler workflow management.

## Visual + Code: A Dual Interface for All Skill Levels

One of our core guiding principles is to **meet users where they are.** Not everyone on a data team codes Python, and not every engineer wants to click through GUIs – so we provide the best of both worlds. We offer a **dual interface**: a rich visual **web UI** and a full code-as-config experience, tightly integrated.

For those who prefer low-code or no-code interaction, Kestra’s **UI** allows building and managing workflows visually. You can click to add tasks, adjust parameters, set up triggers and see the DAG (topology) update in real time as you design your flow. The UI provides a live topology view of your workflow as a DAG that updates as you edit, plus integrated documentation and even a built-in code editor. This makes it accessible for analysts or less-technical users – for example, a data analyst can modify a SQL query or tweak a parameter directly in the browser without touching a git repo or Python script. Kestra encourages this kind of cross-role collaboration: business stakeholders can contribute through the UI, while the platform still captures those changes in the YAML config behind the scenes.

At the same time, experienced developers and engineers get a **full code experience** when they want it. Kestra’s UI includes an embedded VS Code-like editor with syntax highlighting, autocompletion, and schema validation for the YAML flows. Power users can drop into the code view, edit the YAML directly, leverage templates, and manage flows via their usual code workflows (pull requests, CI/CD deployments using Kestra’s API or Terraform). In other words, Kestra offers **no-code, low-code, and full-code** in one platform. Entry-level users can start with the visual builder, while advanced users can fine-tune the YAML or automate pipeline creation through scripts and CI – all without switching tools or losing context. This dual approach grows with your team’s skills and needs, ensuring you never hit a wall where the platform is either too simplistic or too rigid.

## Any Language, Any Tool: True Language-Agnostic Flexibility

Traditional orchestrators often tie you to a specific programming language or runtime.

Kestra was explicitly created to break free of this. We believe your orchestration engine should not dictate what language your tasks are written in. Kestra’s declarative approach and plugin architecture make it truly **language-agnostic** and extensible.

What does this mean in practice? With Kestra, you can orchestrate *any* code in *any* language, framework, or environment – as first-class citizens of your workflow. Want to execute a Spark job, run a SQL query on Snowflake, trigger a bash script on a server, call a REST API, and train a Python ML model all in one pipeline? Kestra can do that. Our YAML workflow definitions are **universal**: they describe the flow and dependencies, while the actual tasks can be implemented in whatever tool or language is best for the job. Kestra’s engine doesn’t require tasks to be Python functions or Java classes – it supports both through plugins, along with hundreds of other integrations.

This is possible because of Kestra’s **rich plugin ecosystem**. The platform comes with **hundreds of plugins (over 600 and counting!)** that interface with databases, cloud services, messaging systems, filesystems, and more. Each plugin extends Kestra with new task types, so you can, say, drop in a `BigQuery` query task, or an `AWS S3` file transfer task, or a `Spark` submit, without writing any glue code. Under the hood, Kestra will handle running that task in the appropriate environment (some plugins run tasks in isolated Docker containers, others call external APIs, etc.), but from the user perspective, it’s just another YAML step. Crucially, *if* a specific integration doesn’t exist yet, developing a custom plugin is straightforward and fast – often just a few hours of work.

 Our plugin framework is developer-friendly, meaning your engineers can easily extend Kestra to talk to in-house systems or niche tools. You’re not limited by the orchestrator’s built-in library; you have the freedom to expand it. This level of extensibility transforms Kestra from a static tool into a platform that evolves with your tech stack.

Because Kestra separates business logic from orchestration, your team can use the **best language for each task**. If your data scientists prefer R for a particular analysis, no problem – Kestra can orchestrate an R script alongside SQL and Python tasks. If your DevOps team needs to call Terraform or Ansible as part of a pipeline, go for it (we have plugins for those too). Kestra doesn’t force a polyglot team to standardize on one language. As we say, *bring your own code*. Kestra will handle the scheduling, dependencies, and monitoring around it.

To sum it up: **Kestra can orchestrate your entire business, not just your Python code**

 By being language-agnostic from day one, Kestra opened the door for engineers from diverse backgrounds to collaborate on workflows. There’s no barrier to entry – use the languages and tools you already know and let Kestra handle the rest. This approach future-proofs your workflows as well. New technology or service tomorrow? Write a plugin or use a generic script task and incorporate it; you won’t be waiting on the orchestrator’s maintainers to support it. Declarative-first for Kestra also meant **API-first**, making all workflow components accessible via REST API for integration with any external system. Everything in Kestra (flows, tasks, triggers, etc.) can be managed through APIs, which pairs perfectly with our language-agnostic stance – you’re free to integrate Kestra with your CI/CD, GitOps processes, or custom UIs without constraint. In short, **flexibility is baked in**, not bolted on.

## API First by Design

Every action you can do in the UI is also exposed via REST API. From day one, we envisioned Kestra as part of a larger ecosystem. You can create, update, and trigger flows programmatically, integrate with CI/CD pipelines (e.g. update your workflows as part of a deploy process), or embed Kestra in a larger data platform. We even provide an official Terraform provider and CLI so that infrastructure engineers can manage Kestra resources (flows, namespaces, etc.) using familiar IaC workflows. Being API-first also means the system is *eventually consistent* with its declarative state: you’re always working with representations (like YAML or JSON via API) of the workflow state, not poking at some in-memory singleton. This aligns with declarative philosophy – **you declare the desired state, Kestra’s engine makes it happen**.

In short, **Kestra’s declarative-first mentality drove us to create an orchestrator that is scalable, event-driven, API-accessible, and easy to augment.** We didn’t have to “bolt on” flexibility or extensibility later – we built with those requirements in mind. The payoff is a system that caters to a wide range of use cases (from scheduled ETL jobs to real-time event reactions) in one coherent platform.

## Conclusion

By sticking to a declarative-first philosophy from day one, we ensured that Kestra could fulfill that vision without being held back by legacy constraints. 

Being declarative-first turned out to be a *future-proof* decision. The tech stack is constantly evolving, but because Kestra is agnostic to languages and environments, it evolves right along with it. New cloud service? There’s likely a plugin for that (or you can create one). More stakeholders needing insight into pipelines? They can jump into the UI and collaborate safely. Larger workloads or real-time events? Kestra’s event-driven, scalable architecture is ready to handle it – no retrofitting needed. Other platforms are now racing to add “declarative” capabilities because the industry recognizes the need for them. Kestra doesn’t have to race; we’ve been running this track from the start.

In practical terms, this means data engineers and platform engineers can rely on Kestra as a stable foundation that *just works*. You spend less time wrangling the orchestrator and more time building actual data products. Meanwhile, solution architects and technical leaders can introduce Kestra to their broader teams (analysts, operations, etc.), knowing it will reduce friction and not overwhelm them. It’s a rare mix of power and approachability – **bold in capability, polished in user experience**.

**Kestra is orchestration done right, from the start.** If you’re ready to embrace a declarative, flexible, and universal approach to orchestrating your data and processes, Kestra is here – with a purple welcome screen inviting you to create your first flow. Dive into our documentation and see for yourself why a declarative-first orchestrator makes all the difference.

::alert{type="info"}
If you have any questions, reach out via [Slack](https://kestra.io/slack) or open [a GitHub issue](https://github.com/kestra-io/kestra).

If you like the project, give us [a GitHub star](https://github.com/kestra-io/kestra) and join [the community](https://kestra.io/slack).
::
