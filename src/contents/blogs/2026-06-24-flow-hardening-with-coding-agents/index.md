---
title: "Your AI Wrote the Flow. Will It Survive Production?"
description: "Coding agents are great at scaffolding Kestra flows. Turning those flows into automation that survives production is a different skill — and that's exactly where domain-expert knowledge, encoded as an agent skill, turns a fast autocomplete into a reliable advisor. Here's how an agent hardened two small example weather-extraction flows."
date: 2026-06-24T09:00:00
category: Solutions
author:
  name: Benoit Pimpaud
  linkedin: https://www.linkedin.com/in/pimpaudben/
  image: "bpimpaud"
image: ./main.png
schema:
  "@context": "https://schema.org"
  "@type": "FAQPage"
  mainEntity:
    - "@type": "Question"
      name: "Can a coding agent make a Kestra flow production-ready?"
      acceptedAnswer:
        "@type": "Answer"
        text: "A coding agent can scaffold a working flow in seconds, but production-readiness — retries, timeouts, failure handling, concurrency control, and idempotency — requires domain judgment. When that judgment is encoded as an agent skill — distilled from experienced engineers and the customers running Kestra in production and critical environments — the agent stops guessing and starts advising: it audits the flow against a severity taxonomy, classifies each task by idempotency before recommending a retry, and validates every property against the live Kestra schema."
    - "@type": "Question"
      name: "Why is a blind retry dangerous in a data pipeline?"
      acceptedAnswer:
        "@type": "Answer"
        text: "A retry is good advice for a transient read failure and catastrophic for a non-idempotent write — a retried POST or insert can double-charge a customer or duplicate rows. A good hardening skill classifies every task as safe (read-only), conditionally safe (write with an idempotency key), or unsafe/unknown, and only recommends retries where they cannot cause duplicate side-effects."
    - "@type": "Question"
      name: "What does a hardening audit actually check?"
      acceptedAnswer:
        "@type": "Answer"
        text: "Resilience (retries and timeouts on transient-prone tasks), failure handling (error alerting, cleanup, final-state actions), concurrency and idempotency (limits, overlap behavior, duplicate guards), guardrails (SLAs, input typing, validation checks), and hygiene (descriptions, labels, large-output handling). Findings are ranked by severity so the highest-risk gaps are addressed first."
---

Ask a coding agent to "write a Kestra flow that pulls weather data for a city and stores it as a CSV," and you'll have a working flow before you finish your coffee. The agent knows the task types, the templating syntax, the plugin catalog. Generation is no longer the bottleneck.

The bottleneck is everything that happens *after* it works once on your laptop. Does it survive a flaky API? A hung download? A schedule that fires before the previous run finishes? A transient 500 at 3 a.m. when nobody is watching? That gap — between *runs* and *runs in production* — is where automation projects quietly fall apart.

This is the part people assume AI can't help with, because it looks like it requires taste and scar tissue. It does. But taste and scar tissue can be written down. That knowledge doesn't only come from the Kestra team — it's earned alongside the many customers running Kestra in critical, high-stakes production environments, who surface the failure modes that matter. When that hard-won knowledge is packaged as an **agent skill**, the coding agent stops behaving like an autocomplete and starts behaving like a senior reviewer sitting next to you.

This post walks through exactly that, using two small example flows we recently hardened. They're deliberately simple — meant to illustrate the *approach*, not to stand in for a real production pipeline.

## Generation is easy. Hardening is the hard part.

Here's the flow the agent generated first. It fetches a city's coordinates, downloads the hourly temperature, and normalizes it into a CSV with DuckDB:

```yaml
id: extract
namespace: acme.weather

inputs:
  - id: time
    type: DATE
    after: 2024-01-01
    required: true
  - id: city
    type: SELECT
    values: [Berlin, Paris, "New York"]
    required: true

tasks:
  - id: geocoding
    type: io.kestra.plugin.core.http.Request
    uri: https://geocoding-api.open-meteo.com/v1/search?name={{inputs.city | urlencode}}&count=1&language=en&format=json

  - id: geo_output
    type: io.kestra.plugin.core.output.OutputValues
    values:
      latitude: "{{ outputs.geocoding.body.results[0].latitude ?? 52 }}"
      longitude: "{{ outputs.geocoding.body.results[0].longitude ?? 13 }}"

  - id: download_weather_data
    type: io.kestra.plugin.core.http.Download
    uri: https://archive-api.open-meteo.com/v1/archive?latitude={{ outputs.geo_output.values.latitude }}&longitude={{ outputs.geo_output.values.longitude }}&start_date={{inputs.time}}&end_date={{inputs.time}}&hourly=temperature_2m

  - id: normalize_data
    type: io.kestra.plugin.jdbc.duckdb.Queries
    store: true
    inputFiles:
      data.json: "{{ outputs.download_weather_data.uri }}"
    sql: |
      INSTALL json; LOAD json;
      COPY (
        SELECT unnest(hourly.time) AS time,
               unnest(hourly.temperature_2m) AS temperature_2m,
               '{{inputs.city}}' AS city
        FROM '{{workingDir}}/data.json'
      ) TO '{{outputFiles["result.csv"]}}' (HEADER, DELIMITER ',');
    outputFiles:
      - result.csv
```

It's clean. It's correct. It even has nice defensive touches — typed inputs, and a `?? 52` fallback if geocoding returns nothing. And it has zero resilience: two external HTTP calls and a query, none of them bounded by a timeout, none of them allowed to recover from a transient failure.

## An advisor, not an autocomplete

Instead of asking the agent to "add some retries," we pointed it at a [**flow-hardening skill**](https://github.com/kestra-io/agent-skills) — a set of instructions distilled from Kestra's own engineers and from the customers running these workloads in production and mission-critical environments. The skill doesn't make the model smarter; it makes it *disciplined*. A few of the rules it enforces:

- **The schema is the source of truth.** Before recommending any property, the agent fetches the live Kestra flow schema and verifies the property exists for this version. No hallucinated fields, no version traps (`maxAttempts` vs the older `maxAttempt`).
- **Classify before you retry.** Every task is sorted into *safe* (read-only), *conditionally safe* (a write with a natural idempotency key), or *unsafe/unknown* (an opaque write). A blind retry on a non-idempotent write is treated as a **critical** mistake, not a convenience — a retried insert duplicates data.
- **Rank by severity, and never invent risk.** Findings come back as Critical / High / Medium / Low. If a flow is already sound, "no high findings" is a valid, encouraged answer. The skill explicitly forbids manufacturing busywork.
- **Be proportional.** A manually-run toy gets a lighter touch than a flow on a daily schedule that writes real data.

That last point matters: the agent reasons about *what the flow does and where it runs*, not a fixed checklist.

### The audit

Run against `extract`, the agent produced a ranked report. The key findings:

- **High — no timeouts on `geocoding`, `download_weather_data`, `normalize_data`.** A hung HTTP call or stuck query stalls the run forever; there is no flow-level timeout in Kestra, so each task must bound itself.
- **Medium — no retries on transient-prone tasks.** Here's the part a naive autocomplete gets wrong. The agent didn't just slap retries everywhere — it *justified* each one: the two HTTP calls are `GET`s (read-only, safe), and `normalize_data` is a deterministic transform that overwrites its output CSV (re-running produces an identical result). All three are safe to retry, and the agent said *why*.

The hardened tasks:

```yaml
  - id: geocoding
    type: io.kestra.plugin.core.http.Request
    uri: https://geocoding-api.open-meteo.com/v1/search?name={{inputs.city | urlencode}}&count=1&language=en&format=json
    timeout: PT30S
    retry:
      type: exponential
      maxAttempts: 3
      interval: PT5S
      maxInterval: PT1M

  - id: normalize_data
    type: io.kestra.plugin.jdbc.duckdb.Queries
    description: Flatten the hourly arrays and write a per-city CSV (deterministic overwrite).
    timeout: PT2M
    retry:
      type: exponential
      maxAttempts: 3
      interval: PT5S
      maxInterval: PT1M
    store: true
    # ... inputFiles / sql / outputFiles unchanged
```

Crucially, the agent also told us where **not** to act: because the pipeline only does deterministic overwrites — no external, non-idempotent side effects — it explicitly declined to add a duplicate-protection guard. That restraint is the difference between an advisor and a code generator that adds every feature it knows.

## The scheduled control flow

The second flow loops over cities and runs `extract` as a subflow, on a daily schedule:

```yaml
id: extract-all
namespace: acme.weather

concurrency:
  behavior: QUEUE
  limit: 5

tasks:
  - id: run_extract
    type: io.kestra.plugin.core.flow.Loop
    values: '["Paris", "Berlin"]'
    tasks:
      - id: subflow
        type: io.kestra.plugin.core.flow.Subflow
        namespace: acme.weather
        flowId: extract
        inputs:
          time: '{{ trigger.date ?? now() | date("yyyy-MM-dd") }}'
          city: "{{ item.value }}"

triggers:
  - id: schedule
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "@daily"
    allowConcurrent: true
```

The agent acknowledged what was already right — there's a concurrency limit and a clean subflow structure — and then focused on the gaps that only matter *because it's scheduled*:

- **High — no failure alerting.** This is the scheduled entry point. If a city fails, the execution goes `FAILED` silently. The agent added an `errors` handler at the flow level so a failure surfaces once per run (not once per city).
- **Medium — no SLA.** Nothing bounds how long a daily run may take. It added an `sla` of type `MAX_DURATION` with breach labels that an alerting trigger can key off.
- **Low — overlapping runs.** `allowConcurrent: true` lets a new daily run start before the previous finishes; combined with `QUEUE`, slow days pile up executions for no benefit on an idempotent extract. It flipped this to `false`.

The hardened result:

```yaml
id: extract-all
namespace: acme.weather
description: Daily control flow — runs the weather extract subflow for each city.

concurrency:
  behavior: QUEUE
  limit: 5

sla:
  - id: max_duration
    type: MAX_DURATION
    duration: PT15M
    behavior: FAIL
    labels:
      sla: miss
      reason: durationExceeded

errors:
  - id: log_failure
    type: io.kestra.plugin.core.log.Log
    level: ERROR
    message: "extract-all FAILED — execution {{ execution.id }} ({{ flow.namespace }}.{{ flow.id }})"

# ... tasks unchanged ...

triggers:
  - id: schedule
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "@daily"
    allowConcurrent: false
```

## Why the expertise has to come from the experts

It's tempting to read this and conclude "the AI hardened the flow." It's more accurate to say the AI *applied the Kestra team's hardening playbook*, faithfully and quickly. The model supplied the language fluency and the tireless attention to every task; the skill supplied the judgment — what to check, how severe each gap is, when a retry is a fix and when it's a foot-gun, and when to do nothing at all.

That division of labor is the whole point. A general-purpose model left to its own devices will happily add a retry to a payment task. A model guided by a skill that encodes idempotency tiers, a severity taxonomy, and "validate against the live schema" produces changes you can actually merge. That expertise — earned by Kestra's engineers *and* by the many organizations running Kestra in production and mission-critical systems — isn't replaced by the agent; it's *amplified* by it, and made available to every engineer who runs the skill.

This is what moves coding agents from "great for prototypes" to "trusted for production." Deterministic automation doesn't come from a clever prompt. It comes from hard-won domain knowledge — from the teams and operators who've been paged at 3 a.m. running Kestra at scale — written down once and then enforced consistently on every flow the agent touches.

## Try it

The flows above are intentionally small so the reasoning is easy to follow — the same approach scales to flows with cloud jobs, scripts, and non-idempotent writes, where the idempotency judgment earns its keep. If you're building automation with a coding agent, the lesson is simple: pair it with skills authored by people who know the domain, and let it audit before it edits. The flow-hardening skill used here — along with others — lives in [kestra-io/agent-skills](https://github.com/kestra-io/agent-skills).

If you have questions, reach out via [Slack](/slack) or open [a GitHub issue](https://github.com/kestra-io/kestra). If you like the project, give us [a GitHub star](https://github.com/kestra-io/kestra) and join [the community](/slack).
