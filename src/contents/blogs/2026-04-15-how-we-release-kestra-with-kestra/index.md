---
title: "How We Release Kestra With Kestra"
description: "How to automate parallel releases across multiple versions with automatic retry handling."
date: 2026-04-15T09:00:00
category: Engineering
author:
  name: Roman Acevedo
  image: racevedo
  role: Software Engineer
image: ./main.png <!-- [to do] add main.png -->
---

Every Tuesday, the Kestra engineering team ships bug fixes across multiple maintained versions simultaneously. [LTS](https://kestra.io/blogs/introducing-lts), latest, and older releases. At peak, that's four parallel releases going out on the same day.

For a while, coordinating those releases looked like this: checking GitHub Actions every 15 minutes, relaunching [flaky tests](https://kestra.io/blogs/flaky-tests-a-journey-to-beat-them-all) by hand, keeping a mental tab on which version was at which step across two repositories. This did the job but created a lot of interruptions. 

We build orchestration software, so fixing this with Kestra was an obvious move. I'll walk through what that looked like, what I built to fix it, and what happened after I rolled it out. 

## What the Tuesday releases looked like

A release used to go like this. First, we bump the version number on the branch. Then we manually trigger the GitHub Actions workflows on both the open-source repo and the enterprise repo.

The jobs run for an hour, sometimes longer on older releases with more accumulated test debt. So I'd context-switch back to whatever I was working on, try to get something done, and check back in 15 minutes to see where things stood.

If both workflows passed, great. Tag and ship.

If a flaky test failed (and they do, on every release, at some frequency), I'd relaunch the job manually and start the waiting cycle again. Then repeat the whole thing for each version being released. Four versions means four cycles of this, running in loose parallel, all of them needing attention at unpredictable intervals.

With these many interruptions, real work got fragmented into whatever I could fit between status checks. Fortunately, orchestration software like Kestra makes this process much more efficient.

## The flow: parallel branches, automatic retries

Before I describe the flow, I should address the obvious concern: if Kestra's infrastructure is down, doesn't using Kestra to run your releases mean you can't fix it?

My answer: the flow is just YAML. If the instance goes down, an engineer opens the file, reads the steps, and runs them manually. The orchestrator adds automation, not a dependency you can't escape.

Parallel execution is the top-level behavior. Instead of manually triggering GitHub Actions for the OS and enterprise repos on each version, the flow does this automatically, in parallel. Start it, and it handles the fan-out across however many versions are going out that week.

[Screenshot] <!-- [to do] -->

Retry logic for flaky tests lives in a dedicated [subflow](https://kestra.io/docs/workflow-components/subflows) that the main flow calls per version. When a test fails, the subflow retries without any input from me. I don't have to watch for it.

Anyone on the team can run, modify, or debug the flow without a handoff. It doesn't depend on me knowing what I built.

## Two touchpoints instead of fifteen-minute check-ins

Before, release days meant staying on standby. Something would need attention within the hour, so anything requiring sustained focus was off the table. Now I start a release and get back to work. The flow handles the intermediate state.

[Screenshot] <!-- [to do] -->

## YAML makes adoption easy

I built this for myself initially, running it during support duty when I had the bandwidth to iterate on it. Once I was confident it worked reliably, I shared it with the team.

My colleague Brian picked it up almost immediately. He saw the pattern and applied it to something that had been bothering him too: the manual checklist work that follows a major release. Opening PRs to downstream repos, updating changelogs, the small but error-prone steps that nobody wants to own. He built a second flow that handles all of it. 

And there's now a third flow: [nightly CI runs](https://kestra.io/use-cases/ci-cd) on production branches. Every night, GitHub Actions runs against the active branches. Engineers start in the morning with a health signal. If a branch is red, it's almost certainly a flaky test, not a regression introduced overnight. Knowing that before you start your day is different from discovering it mid-PR review.

None of this required a meeting or a formal handoff. I built a flow, shared it, and the team saw what was possible and proactively added more. The YAML is readable enough that picking it up takes minutes, not another team sync. 

## Why not just coordinate this in GitHub Actions?

GitHub Actions is excellent for CI steps. It's less suited for coordinating across multiple Actions runs and handling retries at the orchestration layer.

A shell script could do the polling, but it's fragile and invisible. There's no DAG view,  execution history, or failure alerts. You'd be replacing one manual process with a brittle automated one. The moment something goes wrong, you'd be debugging a script with no observability instead of reading an execution log.

Kestra gives you coordination, [retry logic](https://kestra.io/docs/workflow-components/retries), and [execution history](https://kestra.io/docs/workflow-components/execution) out of the box. For a process that runs every week and fails in non-deterministic ways, the observability alone justifies the choice.

[Screenshot] <!-- [to do] -->

Once I put it in a flow, engineers stopped checking Slack every 15 minutes on Tuesdays.

## Try it yourself

[Kestra is open source](https://github.com/kestra-io/kestra). The release coordination flow, the post-release checklist, and the nightly CI monitor are each a few dozen lines of YAML. If you want to build something similar, that's a reasonable place to start.
