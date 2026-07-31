---
title: When Your API Writes Its Own Docs With Kestra
rank: 2
description: How Gravitee, a 2024 Gartner Magic Quadrant Leader for API Management, consolidated its AI-powered documentation and ML model pipelines onto Kestra, letting two engineers ship SpecGen in six months.
metaTitle: "Gravitee & Kestra: When Your API Writes Its Own Docs"
metaDescription: Gravitee consolidated AI-powered API documentation and ML pipelines onto Kestra, letting two engineers ship SpecGen in six months with zero customer training needed.
heroImage: ./hero.jpg
featuredImage: ./hero.jpg
logo: ./logo.svg
logoDark: ./logo-dark.svg
logoIcon: ./icon.svg
tasks:
  - io.kestra.plugin.jdbc.postgresql.Query
  - io.kestra.plugin.docker.Run
  - io.kestra.plugin.notifications.slack.SlackIncomingWebhook
  - io.kestra.plugin.core.http.Request
kpi1: |-
  ##### Zero
  customer training needed
kpi2: |-
  ##### 50%
  reduction of pipelines maintenance time
kpi3: |-
  ##### 2
  engineers to build the product
quote: Our goal is for Kestra to become the go-to solution across the
  organization whenever data wrangling and complex pipeline orchestration are
  needed.
quotePerson: Rémi Sultan
quotePersonTitle: AI/ML Lead
industry: API Management
headquarter: Denver, Colorado, USA
region: Americas
companySize: "51–500"
solution: Gravitee brings modern DevOps principles to API management with built-in support for GitOps, Kubernetes, and APIOps.
tagline: Open-source API management platform for modern DevOps teams
companyName: Gravitee
useCase: Orchestrating AI-powered OpenAPI spec generation and ML model pipelines so Gravitee customers can auto-document their APIs with one click
useCaseShort: API Management
deployment: "TODO: deployment"
intro: "Gravitee, a 2024 Gartner Magic Quadrant Leader for API Management, built SpecGen: a system that watches live API traffic and uses machine learning and generative AI to keep documentation in sync with what's actually deployed. Two engineers built and shipped the entire pipeline on Kestra in six months, from data ingestion through model training to one-click documentation generation."
cta: "What would change if your API documentation stayed synchronized with every release, automatically, with no one having to remember to update it?"
---

## The problem

<div class="problem-list">
<div class="problem-item">
<span class="problem-number">01</span>
<div class="problem-title">Static documentation couldn't keep pace with rapid API iteration</div>
<div class="problem-desc">Gravitee's customers needed OpenAPI documentation that reflected what was actually deployed, not a stale snapshot from whenever someone last remembered to update it. Writing that documentation by hand was time-consuming, often jargon-heavy, and easy for developers to deprioritize under deadline pressure.</div>
</div>
<div class="problem-item">
<span class="problem-number">02</span>
<div class="problem-title">Existing CI/CD tools weren't built for long-running ML pipelines</div>
<div class="problem-desc">Gravitee's SpecGen system needed to analyze live API traffic with machine learning, generate natural-language descriptions with generative AI, and continuously retrain models through a champion-challenger strategy. Traditional CI/CD pipelines and prescriptive automation tools could handle deployments, but not resource-intensive, long-running, stateful ML workflows. <em class="inline-quote">"Most tools we tried became the bottleneck. You had to work around their limitations instead of solving real problems."</em></div>
</div>
<div class="problem-item">
<span class="problem-number">03</span>
<div class="problem-title">A two-person team needed to ship a full ML pipeline in months, not build a platform from scratch</div>
<div class="problem-desc">Gravitee's AI/ML team had two engineers to build data ingestion, model training, documentation generation, and monitoring end to end, without also taking on the overhead of building and maintaining a bespoke orchestration layer.</div>
</div>
</div>

<div class="problem-close">
<div class="problem-close-prefix">// The requirement</div>
An orchestration platform that could run declarative workflows across SQL, Docker, and LLM APIs, support the champion-challenger ML pattern natively, and let <strong class="problem-close-key">two engineers ship a production ML pipeline in six months</strong>.
</div>

## What Kestra fixed

<div class="fix-list">
<div class="fix-item">
<div class="fix-check">✓</div>
<div>
<div class="fix-title">Declarative YAML workflows replaced brittle, hand-built automation</div>
<div class="fix-desc">Kestra let Gravitee define the entire SpecGen pipeline (SQL polling, Docker-based Python preprocessing, LLM calls, Slack alerting) as declarative flows instead of a mesh of custom scripts. <em class="inline-quote">"Kestra's YAML syntax allows us to define workflows in a clear and concise way, making them easy to understand, modify, and reuse."</em></div>
</div>
</div>
<div class="fix-item">
<div class="fix-check">✓</div>
<div>
<div class="fix-title">Native HTTP tasks turned LLM calls into a first-class pipeline step</div>
<div class="fix-desc">Kestra's `http.Request` task feeds structured API specifications directly to language models to generate developer-friendly documentation, with no custom client code required. <em class="inline-quote">"Kestra seamlessly manages the flow of data throughout our AI pipelines."</em></div>
</div>
</div>
<div class="fix-item">
<div class="fix-check">✓</div>
<div>
<div class="fix-title">Docker-based task runners kept preprocessing language-agnostic</div>
<div class="fix-desc">Python scripts that clean and structure API specifications run inside Docker containers orchestrated by Kestra, keeping preprocessing logic decoupled from the orchestration layer itself and easy to update independently.</div>
</div>
</div>
<div class="fix-item">
<div class="fix-check">✓</div>
<div>
<div class="fix-title">Champion-challenger model deployment ran as a native workflow pattern</div>
<div class="fix-desc">SpecGen's machine learning component evaluates new models against production traffic and promotes the winner automatically. Kestra orchestrates data ingestion, parallel challenger-model runs, and accuracy and latency comparisons as one flow. <em class="inline-quote">"You can literally debug a flow live, fix a task, and replay it without restarting. It's like time travel for pipelines—and a huge productivity boost."</em></div>
</div>
</div>
<div class="fix-item">
<div class="fix-check">✓</div>
<div>
<div class="fix-title">Built-in monitoring and Slack alerts replaced manual pipeline babysitting</div>
<div class="fix-desc">Kestra tracks execution time, resource utilization, and success rate for every run, and pushes a Slack alert the moment something fails, so the team isn't watching dashboards or waiting on a customer to report broken docs. <em class="inline-quote">"It's great to go with solutions that open-source their code—it builds confidence. Kestra is super easy to use, works with any code, and comes with tons of ready-made connectors."</em></div>
</div>
</div>
</div>

## Outcomes

<div class="results-list">
<div class="result-item">
<div class="result-metric">Zero customer training needed</div>
<div class="result-desc">Gravitee customers generate accurate API documentation with a single click. No onboarding and no new tooling on their end, just documentation that stays in sync with what's actually deployed.</div>
</div>
<div class="result-item">
<div class="result-metric">50% reduction in pipeline maintenance time</div>
<div class="result-desc">Moving off ad hoc scripts and CI/CD workarounds onto declarative Kestra flows cut the ongoing maintenance burden on the SpecGen pipeline roughly in half.</div>
</div>
<div class="result-item">
<div class="result-metric">2 engineers, 6 months, one production ML pipeline</div>
<div class="result-desc">Gravitee's AI/ML team built and shipped the entire SpecGen pipeline, data ingestion, model training and deployment, documentation generation, and monitoring, with two engineers in six months.</div>
</div>
<div class="result-item">
<div class="result-metric">Expanding beyond documentation into a default data and ML layer</div>
<div class="result-desc">What started as a documentation pipeline is becoming Gravitee's default orchestration layer for data, automation, and machine learning work more broadly. <em class="inline-quote">"Kestra is already changing how we work. Eventually, it'll be our default for anything involving data, automation, or machine learning."</em></div>
</div>
</div>

## Kestra at Gravitee

Gravitee's SpecGen pipeline runs on Kestra as a set of declarative flows. Kestra polls SQL databases for new or updated API specifications, triggering downstream processing automatically whenever changes appear, with no manual kickoff required.

Preprocessing runs in Docker containers, so the Python logic that structures and cleans API specs stays decoupled from the orchestration layer. Once specs are ready, Kestra's native `http.Request` task calls out to a large language model, the same mechanism the pipeline uses to reach NewtAI, Gravitee's own in-house agentic AI system, to generate human-readable descriptions and metadata. On the ML side, the same orchestration layer runs a champion-challenger pattern: new models are evaluated against live production traffic in parallel, and the best performer is promoted automatically.

Every run reports execution time, resource utilization, and success rate, and Slack receives an alert the moment anything fails, so Gravitee's two-person AI/ML team spends its time building new capabilities instead of babysitting pipelines.

<div class="stack-row">
<span class="stack-pill">SQL Database</span>
<span class="stack-pill">Docker</span>
<span class="stack-pill">Python</span>
<span class="stack-pill">LLM API</span>
<span class="stack-pill">Slack</span>
<span class="stack-pill">NewtAI</span>
</div>
