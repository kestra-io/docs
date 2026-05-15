---
title: How a Government SOC Team Replaced Palo Alto XSOAR When Its On-Prem Roadmap Stalled
rank: 1
description: A European government IT provider managing security operations for multiple German federal states replaced Palo Alto XSOAR with Kestra, building 100+ SOC workflows with zero cloud dependencies.
metaTitle: Government SOC Team Replaced Palo Alto XSOAR with Kestra
metaDescription: How a European government IT provider replaced Palo Alto XSOAR with Kestra — building 100+ SOC alert workflows fully self-hosted, with no cloud dependencies, serving multiple German federal states.
heroImage: ./hero.jpg
featuredImage: ./hero.jpg
tasks:
  - io.kestra.plugin.elasticsearch.Search
  - io.kestra.plugin.core.http.Request
  - io.kestra.plugin.scripts.python.Script
  - io.kestra.plugin.notifications.slack.SlackIncomingWebhook
kpi1: |
  100+
  SOC workflows in production
  going live May 2026
kpi2: |
  6
  German federal states served
  public sector IT and security ops
kpi3: |
  1
  SOAR platform replaced
  Palo Alto XSOAR
kpi4: |
  0
  cloud dependencies
  fully self-hosted, air-gapped SOC
quote: The support that came with Kestra Enterprise Edition was great. Any questions we had were solved really quickly.
quotePerson: System Architect
quotePersonTitle: SOC Development Team, Government IT Provider
industry: Government & Public Sector
headquarter: Germany
region: Europe
solution: Alert orchestration for a government SOC — replacing Palo Alto XSOAR with a fully self-hosted platform covering detection, enrichment, and automated response across multiple German federal states
companyName: Government IT Provider
intro: A European government IT services provider managing security operations across multiple German federal states needed to replace Palo Alto XSOAR after the vendor shifted new capabilities primarily to its cloud offering. With citizen data that cannot touch a commercial cloud by law, the SOC team evaluated five alternatives — purpose-built SOARs included — and selected Kestra. They built 100+ security workflows on top of it, covering the full alert lifecycle with no cloud dependencies.
deployment: Self-hosted · Docker Compose · On-prem
useCase: Security Operations Center alert orchestration — replacing Palo Alto XSOAR
cta: What would change if your security operations ran on a platform built to stay on-prem — actively developed, open source at its core, and fully under your control?
---

## The problem

The SOC team handles detection events for systems managing citizen data across multiple federal states. That data cannot move to a cloud provider. Any tool requiring cloud connectivity for features, storage, or licensing was automatically disqualified. The evaluation had to find a self-hosted platform with an active roadmap — one whose vendor had no incentive to eventually pressure users toward migration.

**01 — On-prem XSOAR was falling behind its own cloud version**

Palo Alto had shifted XSOAR investment toward its hosted offering. New features appeared in the cloud version first and reached on-prem after a 6-to-9-month lag. An increasing share of new capabilities became cloud-only. For a team whose regulatory mandate prohibits cloud processing of citizen data, staying on XSOAR was not a viable long-term strategy.

**02 — Support that operated on vendor timelines, not security timelines**

Technical issues with XSOAR entered a support process that moved slowly. *"If there were any technical problems, it took them years to solve."* A security automation platform whose vendor cannot respond at the pace security operations require is not a platform teams can rely on.

**03 — A 10-year on-prem mandate that ruled out most alternatives**

The data handled by this SOC makes cloud processing legally impermissible for at least the next decade. Any vendor requiring cloud connectivity for features was disqualified. The evaluation had to identify a self-hosted platform whose business model would not eventually lead to the same pressure the team was already escaping from XSOAR.

The three constraints pointed to one requirement: a self-hosted platform with an active roadmap, whose vendor had no incentive to push them toward the cloud.

## What Kestra fixed

**On-prem by design, no migration pressure**

Kestra runs on the team's own servers. Cloud connectivity is never required. There is no commercial incentive pushing users toward a hosted offering, which means the self-hosted roadmap is not treated as a second-class product.

**Active development for self-hosted users**

*"We like that Kestra is developing so fast,"* the SOC team noted. New features ship on a regular cadence — a stark contrast to XSOAR's 6-to-9-month on-prem feature lag.

**Support that responds**

After the XSOAR experience, support responsiveness was non-negotiable. On Kestra Enterprise, issues get resolved quickly. For a SOC team running live alert workflows, slow support is an operational risk.

**Evaluation before commitment**

The open source edition let the team run Kestra on their own infrastructure before any commercial conversation. *"I like that there's an open source edition so you can try things and evaluate before you go to the Enterprise Edition."* No sales call, no expiring trial, no procurement gate. The team could self-host, test, and build on their own timeline.

## Outcomes

**100+ workflows** — Going to production in May 2026, covering alert fetching, OSINT enrichment via VirusTotal and MISP, and automated response including account lockdowns and critical event escalation.

**XSOAR decommissioned** — Palo Alto XSOAR removed from the SOC stack after years of support lag and a roadmap pointing increasingly toward cloud-only features the team could not use.

## Kestra in the SOC environment

Kestra Enterprise runs on Docker Compose on the SOC team's dedicated servers. The detection layer is Elastic SIEM, which collects signals and identifies deviations from baseline. Kestra handles everything downstream.

Each alert runs through four steps: fetch from the source system, extract relevant fields from large JSON payloads, enrich via OSINT APIs (VirusTotal, MISP, and others), and take action based on the enrichment result — alerting the night shift for critical events, locking accounts, or triggering other automated responses.

The full stack: Kestra Enterprise · Elastic SIEM · Docker Compose · Elasticsearch · VirusTotal · MISP · Prometheus · GitLab SSO · JDBC Secrets.
