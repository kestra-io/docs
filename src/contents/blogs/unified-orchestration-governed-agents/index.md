---
title: "Connecting AI Agents Is Easy. Governing Them Is the Hard Part."
metaTitle: "Why Unified Orchestration Is Becoming Its Own Category"
description: "AI agents can reach any API in minutes. Governing what they do across data, infrastructure, applications and business processes needs one orchestration layer above every tool, model and agent."
metaDescription: "Kestra's Global Field CTO on why AI agents need a unified orchestration layer: governance across domains, transaction IDs outside the agent, and sovereignty."
date: 2026-11-13T10:00:00
category: Solutions
image: ./main.webp
author:
  name: Kai Waehner
  linkedin: https://www.linkedin.com/in/kaiwaehner/
  image: kwaehner
  role: Global Field CTO
---

Most enterprises run a separate automation stack per domain, and often several inside one domain. Infrastructure scheduling alone usually means cron jobs, glue code, a twenty-year-old scheduler and a modern cloud scheduler running side by side. Now AI agents are being added on top. I discussed this on the [Six Five webcast](https://www.sixfivemedia.com/content/why-unified-orchestration-is-becoming-its-own-category), and the episode is below.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/niG6sxUOaRI" title="Why Unified Orchestration Is Becoming Its Own Category" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Automation Breaks at the Seams

Moving data between systems is a solved problem: batch, streaming and APIs have done it for twenty years. Coordinating the systems is a different layer, and most companies built it per domain (scheduling, provisioning, one business process) without connecting the pieces.

It works most days. Then a process that spans data, infrastructure, applications and business processes fails, and there is no end-to-end observability or governance. Nobody knows where the problem is, and the person who does is on vacation. Incident handling often exists only on paper or in a phone call.

An executive dashboard shows the failure but can't act on it. An unified orchestration layer can: it sees the whole process, governs it, and decides what happens next when a step fails.

## Agents Make It Harder

Agents show up in two ways:

- **Inside one domain.** An agent handles the easy customer service requests first. You still need rules on when it decides alone and when it only recommends to a human, for example above a revenue threshold, because agents hallucinate.
- **Across domains.** One agent provisions infrastructure, tells the application a new container is ready, and opens the incident process. This is where most companies want to go.

Connecting the agent takes minutes. You expose the APIs through MCP, which more and more vendors already support. Governing it is the real work: what data it can access, what it is allowed to change, and how you stay compliant. An agent doesn't ask before acting, so the controls have to sit around it.

## Keep the Transaction ID Outside the Agent

A large bank I met recently has a process that spans infrastructure provisioning, certificate renewal, an application and a business process. An agent automates it and runs root cause analysis when something fails, so it needs access to everything. That raises two questions: what can it read, and what can it do with it?

The pattern that works:

- The agent does the analysis, faster than any team could.
- Case or incident management sits on top, and a human makes the decision in critical cases.
- The transaction ID lives outside the agent. Whether an application, a human or an agent makes a decision, it stays the same transaction, governed end to end.

In Kestra that transaction is the execution: the event, the AI step, the human approval and the remediation in one run with one audit trail. I showed it in the [Kestra 2.0 launch demo](/blogs/kestra-2-0-what-you-actually-get).

It also has to work across models. Large organizations already mix providers for sovereignty and cost, sometimes several US providers plus open models. Governance at the orchestration layer stays the same when you swap the model underneath.

## Design for Sovereignty First

Sovereignty, data privacy and security don't come for free with any product. Decide them before you evaluate tools:

- Can you run cloud only?
- Do you need hybrid?
- Do you need an air-gapped deployment?

Kestra separates the control plane, where you define orchestration, from the workers that run it. Workers run where the data is: next to Snowflake or Databricks in the cloud, next to a mainframe and existing schedulers in your data center, or fully air-gapped in a factory. If you bolt these requirements on after the fact for agentic AI, the project fails.

## Example: Threat Intelligence at JPMorgan Chase

[JPMorgan Chase's cybersecurity teams](/stories/jpmorgan-chase) use Kestra to collect threat intelligence from dozens of external feeds, such as malicious domains and leaked credentials, analyze it, and deliver it to fraud detection teams and business units in near real time. The pipeline handles more than 4,000 API pulls a week for over 100 users. Failed pulls are retried, and urgent alerts go out fast.

The right order for any project is the business problem first, then the architecture, then the technical details.

Watch the [full episode on Six Five Media](https://www.sixfivemedia.com/content/why-unified-orchestration-is-becoming-its-own-category), or see one execution carry an agent, a human decision and the remediation in the [Kestra 2.0 launch recap](/blogs/kestra-2-0-what-you-actually-get).
