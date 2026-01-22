---
title: "The Road from Kestra 0.1 to 1.0"
description: We are getting closer to the 1.0 release, this is our journey
date: 2025-09-04T13:00:00
category: News & Product Updates
author:
 name: Ludovic Dehon
 image: ldehon
 role: CTO & Co-Founder
image: ./main.jpg
---

On Tuesday, September 9th, we will officially launch **Kestra 1.0,** a release that will **change the face of orchestration forever**.

That’s not a phrase we use lightly. 1.0 is a **true revolution**: stable, enterprise-ready, open-source at the core, and built for the AI era.

## A Philosophy That Doesn’t Change

First, let’s be clear: our philosophy has always been the same.

- **Open Source**: Kestra will always provide a strong open-source environment, free and accessible to anyone who wants to orchestrate their data, AI, infrastructure, or business processes.
- **Enterprise Grade When You Need It**: Kestra Enterprise delivers advanced features for security, governance, and scale, with the same open DNA.
- **No Lock-In**: Openness isn’t just a licensing choice; it’s a design principle. Kestra is built to run anywhere, on-premises, in any cloud, or in an air-gapped environment.

This balance between **community accessibility** and **enterprise reliability** is the foundation of everything we do, and it will continue to guide us well beyond 1.0.

## Why declarative, and why from day one

Our first principle was to make orchestration **declarative**. Instead of coding every step, you declare **what** the workflow should achieve, **which** tasks it contains, **when** it should run, and **under what conditions**. Kestra takes care of the **how**: executing, scaling, retrying, resuming, tracing, and auditing consistently, every time.

Declarative orchestration means workflows are portable, version-controlled, and safe to evolve. Automation stops being a fragile script or shadow IT in uncontrolled SAAS tools; it becomes a product: testable, observable, and governed by design.

Over the years, we expanded the model into a **complete developer experience**:

- **Everything as Code**: Flows, dashboards, secrets, plugins—every part of Kestra can be version-controlled and Git-native, fitting seamlessly into CI/CD pipelines.
- **Everything from the UI**: A multi-panel editor brings YAML, no-code forms, docs, and files together. You can switch between code and UI instantly, always seeing the truth of what’s running. You can even iterate quickly thanks to our Playground.
- **Code in Any Language**: With Docker and SDKs for Java, Python, Go, and JavaScript, Kestra lets you orchestrate in the stack you already know.

This is how Kestra turned declarative orchestration into something universal, usable by every engineer, on any team, in any environment.

## Open source as a foundation, not a tactic

We chose **open source** from day one. Not as a marketing lever, but because orchestration is too critical to be a black box. The code should be inspectable. The community could report, contribute.

By keeping Kestra open, we gave the community a lever to make Kestra better, and they did.

Over the years, the community has pushed Kestra to places we might not have reached alone. When we say the platform is trusted by **Fortune 500**, we mean trust that was earned one execution at a time, in production, under load, with outcomes that mattered.

## The long road through 0.x

Kestra was born out of a real challenge. In **2019**, at **Leroy Merlin France**, one of Europe’s largest retailers, the data team was stuck between legacy orchestrators and the demands of the cloud. They were migrating from **Teradata** to **BigQuery**, modernizing pipelines, and scaling to thousands of workflows. What they needed was clear: a platform both **enterprise-ready** and **engineer-friendly,** stable enough for production at scale, but open enough to evolve with the business. Existing tools couldn’t deliver, too fragile, too slow, too locked-in, so Kestra was born.

From those first flows at Leroy Merlin, the platform grew release after release with one purpose: to make orchestration **stable at scale and usable by anyone.** We added subflows to reduce complexity, Git synchronization to bring orchestration into the GitOps era, and task runners that made workloads portable across Kubernetes, AWS, Azure, and GCP with a single YAML property. Enterprise-grade building blocks followed, tenant isolation, SCIM for identity, audit logs, and Secret managers integration, not as “extras,” but as fundamentals of a control plane you can actually trust.

And this is just a glimpse of what the team has delivered during those past years.

Alongside these features, the **community became a force multiplier.** Kestra trended on GitHub multiple times, surged past **20,000 stars**. Every contribution, bug report, and edge-case fix helped turn Kestra into the orchestrator that could run anywhere, for anyone.

And trust followed. Today, **Apple, Toyota, Bloomberg, JPMorgan Chase, SoftBank, Deutsche Telekom, BHP, and many others** run Kestra in production, orchestrating billions of workflows across data, AI, infrastructure, and business operations. Trust was earned one execution at a time, under load, with outcomes that mattered.

## “Nine hundred plugins? That seems like a lot.”

It is a lot. And yes, they **work**.

Every time we mention that Kestra now spans **:PluginCount plugins**, we get two reactions. The first is excitement because it means you can connect to practically anything: data stores, file stores, messaging systems, observability stacks, back‑office apps, and the long tail of tools that enterprises rely on. The second is skepticism: can that many integrations really be trustworthy?

They can, and they are, because we treat the plugin ecosystem with the same discipline we apply to the core. Plugins are part of the product. We test them daily. We keep them up to date. We make upgrades safe. In Enterprise Edition, **plugin versioning** lets you pin exactly what your workflows depend on, run multiple versions in parallel, and adopt changes at your own pace. The size of the ecosystem is the result of years of work, so that integration breadth doesn’t come at the cost of quality. This is the level we are reaching, and it’s the same bar for everyone.

## One control plane, everywhere you run

From the beginning, we refused to tie orchestration to a deployment model. Some teams need to run **on‑premises**, close to the data, under strict regulatory requirements. Others are all‑in on cloud providers, or somewhere in between with hybrid footprints. Some operate **air‑gapped** for good reasons. Kestra respects those realities. The core is **open source** and runs where you need it to run. The Enterprise edition layers in governance, isolation, and safety for organizations that need to coordinate thousands of users and workloads without losing control. But the orchestration model, and the promise it makes, doesn’t change because your environment does.

## What 1.0 will stand for

So what does **Kestra 1.0** actually **mean**?

It means the ideas we started with: **declarative orchestration**, **open source**, **governance by design,** have matured into a platform worthy of long‑term commitments. It means we’ve earned the right to call this next release **LTS** (Long Term Support), with all the discipline that entails. Our Fortune 500 customers asked us for guarantees on the stability of their workflows, and we’re proud to take on that responsibility for the long term.

Most of all, it means you can trust Kestra. You can make it the single orchestration layer across data, infrastructure, and business operations. You can consolidate the glue that used to live in cron jobs and shell scripts. You can stop explaining to auditors why the most critical paths in your company depend on duct tape.

We are proud of where we landed. **Kestra 1.0** is ready. The release you’ll see on Tuesday is a culmination of that philosophy: a platform that is stable, understandable, and ready to carry critical workflows with integrity.

If you’ve been with us since the early days, thank you for the issues you opened, the pull requests you sent, and the ideas you pushed us to test. If you’re just discovering Kestra now, welcome. You’ll find a platform that values clarity, reliability, and openness over lock‑in.

The countdown is on. In 5 days, we’ll reveal what will **permanently redefine orchestration.**