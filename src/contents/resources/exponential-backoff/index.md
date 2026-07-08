---
title: "What Is Exponential Backoff (and Why Your Retries Need Jitter)"
description: "Exponential backoff is the standard retry strategy for transient failures. This guide explains how it works, why jitter matters, and how to declare it in one YAML block instead of scattering retry loops across your code."
metaTitle: "What Is Exponential Backoff? Retry Patterns"
metaDescription: "Exponential backoff retries failed operations with increasing delays. Learn how it works, when to add jitter, and how to configure retries in one YAML block."
tag: infrastructure
date: 2026-07-08
faq:
  - question: "What is exponential backoff?"
    answer: "Exponential backoff is a retry strategy where the wait time between attempts grows after each failure — typically doubling (2s, 4s, 8s, 16s...) up to a maximum. Instead of hammering a failing service with immediate retries, it gives the service progressively more room to recover, which resolves most transient failures without human intervention."
  - question: "Why should I add jitter to exponential backoff?"
    answer: "Without jitter, every client that failed at the same moment retries at the same moment — the synchronized wave of retries (the 'thundering herd') can knock the recovering service straight back down. Jitter adds a random offset to each delay so retries spread out over time instead of arriving together."
  - question: "What is the difference between constant and exponential retry?"
    answer: "A constant retry waits the same fixed interval between every attempt, which is fine for quick, isolated hiccups. Exponential retry increases the interval after each failure, which is safer for rate limits and overloaded services: early attempts recover fast from blips, while later attempts stop contributing to the overload."
  - question: "How many retry attempts should I configure?"
    answer: "A common production default is 4 to 6 attempts with a capped maximum interval (for example, start at 2 seconds, cap at 1 minute) and a total duration limit. The right numbers depend on the failure you are protecting against: rate limits recover in seconds, failovers in minutes. Whatever you choose, always pair retries with an alert on final failure."
  - question: "Should retries live in application code or in the orchestrator?"
    answer: "In the orchestrator whenever the operation is part of a workflow. Retry loops scattered across scripts are invisible, inconsistent, and untested; a declarative retry policy at the orchestration layer applies uniformly, shows every attempt in the execution history, and can trigger alerting when attempts are exhausted."
  - question: "Does exponential backoff work for rate limits (HTTP 429)?"
    answer: "Yes — it is the recommended client behavior for HTTP 429 and most cloud API throttling. Growing delays naturally reduce your request rate until it fits under the limit. If the API returns a Retry-After header, honor it as the minimum wait before your backoff resumes."
---

> **TL;DR** — Exponential backoff is a retry strategy that increases the wait time between attempts after each failure — typically doubling it — so a struggling service gets room to recover instead of being hammered by immediate retries. Combined with random jitter and a retry cap, it is the standard way to make distributed systems and data pipelines resilient to transient failures.

Every data pipeline eventually meets a failure that would have fixed itself: an API returns 429 because you hit a rate limit, a warehouse connection drops during a failover, an SFTP server blinks for ten seconds. Retrying immediately makes these failures worse — the struggling service gets hit again while it's down. Waiting too long turns a ten-second blip into an hour of stale data.

Exponential backoff is the pattern that resolves this tension, and it's simple enough to explain in one line: **wait longer after each failure.**

## How exponential backoff works

After each failed attempt, the delay before the next attempt is multiplied — most implementations double it:

```
delay = initial_interval × 2^(attempt - 1), capped at max_interval
```

With a 2-second initial interval and a 1-minute cap, the retry schedule looks like: 2s → 4s → 8s → 16s → 32s → 60s. Early attempts recover quickly from momentary blips; later attempts stop contributing load to a service that clearly needs more time.

Three parameters define the policy, and all three matter:

| Parameter | What it controls | Typical production value |
| :-- | :-- | :-- |
| Initial interval | How fast the first retry fires | 1–5 seconds |
| Maximum interval | The cap on growth (prevents absurd waits) | 30s–5 minutes |
| Max attempts / max duration | When to stop retrying and fail loudly | 4–6 attempts, bounded total duration |

### The thundering herd — why jitter exists

Backoff alone has a failure mode: if 500 workers all failed at the same instant (say, a service restarted), they all retry at the same instant too — 2 seconds later, then 4, then 8, in synchronized waves that can knock the recovering service straight back down.

**Jitter** breaks the synchronization by adding a random offset to each delay. Instead of 500 requests at t+8s, the requests spread across a window. If you remember one refinement to the pattern, make it this one.

## Why backoff belongs in the orchestrator, not your code

Most teams first implement backoff as a `try/except` loop inside a script. It works — once. Then the pattern gets copy-pasted with different parameters into every script, some loops log their attempts and some don't, and nobody can answer "what is our retry policy?" because there isn't one — there are forty.

Moving retries to the orchestration layer changes the economics:

- **One policy, declared once** — reviewable in a pull request, consistent across every task.
- **Every attempt is observable** — retries show up in the execution history instead of hiding inside a loop.
- **Exhaustion has a path** — when the last attempt fails, the workflow's error handling takes over: alert, fallback, or halt.

## Declare exponential backoff in Kestra

In Kestra, backoff is a [retry property](/docs/workflow-components/retries) you attach to any task — no loop to write. Here is a scheduled API sync that survives rate limits and transient outages:

```yaml
id: resilient-api-sync
namespace: company.integrations

tasks:
  - id: fetch_orders
    type: io.kestra.plugin.core.http.Request
    uri: "https://api.partner.com/v1/orders?since={{ trigger.date }}"
    method: GET
    headers:
      Authorization: "Bearer {{ secret('PARTNER_API_TOKEN') }}"
    retry:
      type: exponential
      interval: PT2S
      maxInterval: PT1M
      maxAttempt: 6
      maxDuration: PT10M

triggers:
  - id: hourly
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 * * * *"
```

Worth noticing, because these are exactly the parts a hand-rolled retry loop tends to miss:

- **The policy is data, not code.** Changing the cap from 1 minute to 5 is a one-line diff that your reviewer can actually evaluate.
- **`maxDuration` bounds the whole story.** Attempts stop after 10 minutes total no matter what — the task fails loudly instead of retrying into your next scheduled run.
- **It generalizes for free.** The same `retry` block works on a Snowflake query, an SFTP transfer, or a Python script; set it once for a whole flow (or namespace) with `pluginDefaults` instead of per task.
- **Exhausted retries are a first-class event** — pair the task with an `errors` branch to page someone only when backoff has genuinely given up.

### Retry, alert, or both?

A useful rule of thumb: **retry what is transient, alert on what is exhausted.** Backoff should absorb rate limits, network blips, and failovers silently — those are noise. But when six attempts over ten minutes all failed, that is no longer transient; the workflow should stop and tell a human, with the full attempt history attached. Retries without an exhaustion alert just convert outages into silent data staleness.

## Where exponential backoff pays off

- **API rate limits (HTTP 429)** — the canonical case; growing delays naturally settle your request rate under the quota.
- **Warehouse and database contention** — lock timeouts and connection drops during failovers resolve within seconds to minutes.
- **File transfers** — SFTP and object-storage endpoints are disproportionately blippy; backoff turns nightly transfer alerts into non-events.
- **Webhook and notification delivery** — downstream receivers go down; your pipeline shouldn't fail because a Slack message didn't send on the first try.

## Related concepts

[Data orchestration](/resources/data/data-orchestration) · [Change data capture](/resources/data/change-data-capture) · [Retries in Kestra](/docs/workflow-components/retries) · [Schedule trigger](/docs/workflow-components/triggers/schedule-trigger)
